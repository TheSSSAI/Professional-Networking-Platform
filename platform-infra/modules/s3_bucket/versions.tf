# versions.tf in modules/s3_bucket
# This file specifies the required Terraform version and provider versions
# for this module, ensuring stability and compatibility.

terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}