#!/bin/bash

# ==============================================================================
# validate-configs.sh
#
# This script is a critical quality gate for the platform-observability
# repository. It validates the syntax and semantic correctness of all
# Prometheus, Alertmanager, and Grafana configuration files.
#
# It is designed to be run in a CI/CD pipeline to prevent the deployment
# of broken monitoring configurations.
#
# Exit Codes:
#   0 - All configurations are valid.
#   1 - A validation error occurred or a required tool is not installed.
#
# Requirements:
#   - promtool (from Prometheus)
#   - amtool (from Alertmanager)
#   - jq
#   - All tools must be in the system's PATH.
# ==============================================================================

# --- Strict Mode ---
# Exit immediately if a command exits with a non-zero status.
set -e
# Treat unset variables as an error when substituting.
set -u
# Pipes return the exit code of the last command to exit with a non-zero status.
set -o pipefail

# --- Color Codes for Logging ---
readonly COLOR_RESET='\033[0m'
readonly COLOR_GREEN='\033[0;32m'
readonly COLOR_RED='\033[0;31m'
readonly COLOR_YELLOW='\033[0;33m'
readonly COLOR_CYAN='\033[0;36m'

# --- Logging Functions ---
log_info() {
    echo -e "${COLOR_CYAN}INFO: $1${COLOR_RESET}"
}

log_step() {
    echo -e "\n${COLOR_YELLOW}===> $1${COLOR_RESET}"
}

log_success() {
    echo -e "${COLOR_GREEN}✔ SUCCESS: $1${COLOR_RESET}"
}

log_error() {
    echo -e "${COLOR_RED}✖ ERROR: $1${COLOR_RESET}" >&2
    exit 1
}

# --- Main Logic ---
main() {
    log_info "Starting observability configuration validation..."

    # Ensure the script is run from the repository root
    cd "$(dirname "$0")/.."

    check_dependencies
    validate_prometheus_config
    validate_prometheus_rules
    validate_alertmanager_config
    validate_grafana_dashboards

    log_success "All observability configurations are valid."
}

# --- Helper Functions ---

# check_dependencies verifies that all required command-line tools are installed.
check_dependencies() {
    log_step "Checking for required tools..."
    local missing_tools=0
    for tool in promtool amtool jq; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "Required tool '$tool' is not installed or not in PATH."
            missing_tools=1
        fi
    done
    if [ "$missing_tools" -eq 0 ]; then
        log_info "All required tools (promtool, amtool, jq) are present."
    fi
}

# validate_prometheus_config validates the main Prometheus configuration file.
validate_prometheus_config() {
    local config_file="prometheus/prometheus.yml"
    log_step "Validating Prometheus main configuration: ${config_file}"
    if [ ! -f "$config_file" ]; then
        log_error "Prometheus configuration file not found at '${config_file}'"
    fi
    promtool check config "$config_file"
    log_info "Prometheus main configuration is valid."
}

# validate_prometheus_rules validates all Prometheus rule files.
validate_prometheus_rules() {
    local rule_path="prometheus/rules"
    log_step "Validating Prometheus rule files in '${rule_path}'..."
    
    # Check if any rule files exist to avoid errors with globbing
    if ! ls "${rule_path}"/*.yml &> /dev/null; then
        log_info "No Prometheus rule files found to validate. Skipping."
        return
    fi
    
    promtool check rules "${rule_path}"/*.yml
    log_info "All Prometheus rule files are valid."
}

# validate_alertmanager_config validates the Alertmanager configuration file.
validate_alertmanager_config() {
    local config_file="prometheus/alertmanager/alertmanager.yml"
    log_step "Validating Alertmanager configuration: ${config_file}"
    if [ ! -f "$config_file" ]; then
        log_error "Alertmanager configuration file not found at '${config_file}'"
    fi
    amtool check-config "$config_file"
    log_info "Alertmanager configuration is valid."
}

# validate_grafana_dashboards checks that all Grafana dashboard files are valid JSON.
validate_grafana_dashboards() {
    local dashboard_path="grafana/dashboards"
    log_step "Validating Grafana dashboard JSON files in '${dashboard_path}'..."

    if ! ls "${dashboard_path}"/*.json &> /dev/null; then
        log_info "No Grafana dashboard files found to validate. Skipping."
        return
    fi

    local all_valid=true
    for file in "${dashboard_path}"/*.json; do
        if jq -e . "$file" > /dev/null; then
            log_info "  - '${file}' is valid JSON."
        else
            log_error "'${file}' is not a valid JSON file."
            all_valid=false
        fi
    done

    if [ "$all_valid" = true ]; then
        log_info "All Grafana dashboard files are valid JSON."
    else
        # The script will have already exited due to `set -e` and log_error
        # This is a fallback message in case `set -e` is ever removed.
        log_error "One or more Grafana dashboards are invalid."
    fi
}

# --- Script Entrypoint ---
main