# =================================================================================================
# TERRAFORM PROVIDER CONFIGURATION
#
# This file configures the providers that Terraform will use to interact with external APIs,
# such as AWS and Cloudflare. It sets global configurations like the default region and
# applies consistent tagging to all resources.
#
# REQ-1-074: Specifies AWS as the hosting platform.
# REQ-1-072: Specifies Cloudflare for CDN and security.
# =================================================================================================

# -------------------------------------------------------------------------------------------------
# AWS Provider Configuration
#
# Configures the default settings for the AWS provider. Authentication is handled implicitly
# through the environment (e.g., environment variables or IAM roles assumed by the CI/CD runner).
# For CI/CD, this setup assumes OIDC is used to grant temporary credentials from GitHub Actions.
# -------------------------------------------------------------------------------------------------
provider "aws" {
  # The default AWS region where resources will be created. This can be overridden
  # at the module or resource level if needed. Sourced from a variable for flexibility.
  region = var.aws_region

  # Default tags applied to all resources that support tagging. This is a best practice
  # for cost allocation, resource identification, automation, and access control.
  default_tags {
    tags = {
      Project     = "ProfessionalNetworkingPlatform"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Repository  = "https://github.com/organization/platform-infra"
    }
  }
}

# -------------------------------------------------------------------------------------------------
# Cloudflare Provider Configuration
#
# Configures the Cloudflare provider. Authentication is handled via an API token, which
# MUST be provided as an environment variable `CLOUDFLARE_API_TOKEN` for security.
# It should not be hardcoded or stored in version control.
# -------------------------------------------------------------------------------------------------
provider "cloudflare" {
  # The API token is automatically read from the CLOUDFLARE_API_TOKEN environment variable.
  # No explicit configuration is needed here if the environment variable is set.
}

# -------------------------------------------------------------------------------------------------
# Root Level Variables
#
# These variables are defined at the root to be used in provider configurations.
# They will be populated by the environment-specific .tfvars files.
# -------------------------------------------------------------------------------------------------

variable "aws_region" {
  description = "The default AWS region to deploy resources into."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The name of the deployment environment (e.g., 'dev', 'staging', 'prod')."
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "The environment must be one of: 'dev', 'staging', or 'prod'."
  }
}