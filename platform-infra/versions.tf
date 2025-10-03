# =================================================================================================
# REQUIRED TERRAFORM AND PROVIDER VERSIONS
#
# Specifies the required version of the Terraform CLI and pins the versions of all providers
# used throughout the infrastructure codebase. This ensures consistent, predictable, and
# repeatable builds across all environments (local, CI/CD, etc.) by preventing unexpected
# changes from provider or CLI updates.
#
# REQ-1-075: All cloud infrastructure is managed as code using Terraform.
# REQ-1-074: The platform is hosted on AWS.
# REQ-1-072: Cloudflare is used for CDN and security services.
# =================================================================================================

terraform {
  required_version = "~> 1.7" # Specifies a compatible range for the Terraform CLI version.

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.49" # Pinning the AWS provider to a specific minor version range.
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.31" # Pinning the Cloudflare provider for DNS and CDN management.
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6" # Used for generating unique names, passwords, and other random data.
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27" # Used for interacting with the EKS cluster post-provisioning.
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.13" # Used for deploying Helm charts (e.g., observability stack) onto the EKS cluster.
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5" # Used for local file operations, such as generating kubeconfig files.
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4" # Used for creating zip files, for example for Lambda source code.
    }
  }
}