.tflint.hcl
# .tflint.hcl
# This file configures the TFLint linter for Terraform.
# TFLint helps enforce best practices and catches errors before applying infrastructure changes.
# Documentation: https://github.com/terraform-linters/tflint

config {
  # This repository is exclusively for AWS, so we set the AWS ruleset as the default.
  # This improves linting performance by not loading unnecessary providers.
  default_set = "aws"

  # Report all issues of this severity or higher.
  # Options: "error", "warning", "notice", "info", "debug", "trace"
  # "warning" is a good default to catch potential issues without being overly noisy.
  log_level = "warning"

  # Enables module inspection. TFLint will download and inspect modules
  # to provide more accurate linting.
  module = true

  # TFLint will format its output in a compact, human-readable format.
  format = "default"

  # Force TFLint to exit with a non-zero status code for issues of this severity or higher.
  # This is critical for CI/CD pipelines to fail builds on linting errors.
  force = false # Set to true in CI environments
}

# TFLint plugins extend its functionality with provider-specific rules.
# We are enabling the official AWS ruleset.
plugin "aws" {
  enabled = true
  version = "0.26.0"
  source  = "github.com/terraform-linters/tflint-ruleset-aws"
}

# Example of disabling a specific rule if needed.
# This should be used sparingly and with justification.
# rule "aws_instance_invalid_type" {
#   enabled = false
# }