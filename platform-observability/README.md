# Platform Observability Configuration

This repository contains the version-controlled configurations for the professional networking platform's observability stack, embodying the "Monitoring as Code" philosophy. It is the single source of truth for how we monitor, visualize, and alert on the health and performance of our services.

This repository is managed by the Site Reliability Engineering (SRE) team. Changes are proposed via pull requests and are automatically validated and deployed through a GitOps workflow.

**As per REQ-1-083, this repository manages the configuration for:**
- **Prometheus**: Metrics collection and alerting.
- **Alertmanager**: Alert routing and notification.
- **Grafana**: Dashboards and visualization.
- **Loki & Jaeger**: Datasource connections within Grafana.

## Repository Structure

- `.github/workflows/`: Contains GitHub Actions for CI (validation) and CD (deployment).
- `grafana/`: Contains all Grafana-related configurations.
  - `dashboards/`: JSON models for each Grafana dashboard. This is where you add or edit visualizations.
  - `provisioning/`: Declarative configuration for Grafana itself.
    - `dashboards/`: Tells Grafana where to find dashboard JSON files.
    - `datasources/`: Defines the connections to Prometheus, Loki, and Jaeger.
- `prometheus/`: Contains all Prometheus and Alertmanager configurations.
  - `alertmanager/`: Configuration for `alertmanager.yml`, defining alert routing to PagerDuty, etc.
  - `rules/`: Modular rule files (`.rules.yml`) that define alerting and recording rules based on PromQL queries.
  - `prometheus.yml`: The main Prometheus configuration file, defining scrape targets and rule file locations.
- `scripts/`: Contains validation scripts used by the CI pipeline.

## Local Development & Testing

To test configuration changes locally, you can run the entire observability stack using Docker.

### Prerequisites

- Docker and Docker Compose installed.

### Running the Stack

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd platform-observability
    ```

2.  **Start the services:**
    ```bash
    docker-compose up
    ```

3.  **Access the services:**
    - **Grafana**: [http://localhost:3000](http://localhost:3000) (Login: admin/admin)
    - **Prometheus**: [http://localhost:9090](http://localhost:9090)
    - **Alertmanager**: [http://localhost:9093](http://localhost:9093)

Any changes made to the local configuration files will be reflected in the running containers, though some services may require a restart (`docker-compose restart <service-name>`) to pick up changes.

### Validating Configurations

Before committing, you can run the same validation script used by the CI pipeline to check your configurations for syntax errors.

```bash
# Ensure the script is executable
chmod +x ./scripts/validate-configs.sh

# Run the validation
./scripts/validate-configs.sh
```

## CI/CD Workflow

- **Continuous Integration (CI)**: Triggered on every pull request.
  1.  **Code Formatting Check**: Verifies that all YAML/JSON files adhere to the project's Prettier configuration.
  2.  **Configuration Validation**: Runs the `scripts/validate-configs.sh` script to check the syntax and validity of Prometheus and Alertmanager files using `promtool` and `amtool`.
  A pull request cannot be merged if any of these checks fail.

- **Continuous Deployment (CD)**: Triggered on every merge to the `main` branch.
  1.  The pipeline securely authenticates with our AWS EKS cluster.
  2.  It uses `kubectl` to apply the configuration files as Kubernetes `ConfigMaps`.
  3.  The relevant deployments (Prometheus, Grafana, Alertmanager) are rolled out to pick up the new configurations.

**Note on Secrets**: This repository **does not** contain any secrets (e.g., PagerDuty API keys, Grafana passwords for production). Secrets are managed via Kubernetes Secrets and are injected into the services at runtime.