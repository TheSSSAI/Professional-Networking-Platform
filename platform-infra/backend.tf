# =================================================================================================
# TERRAFORM REMOTE STATE BACKEND CONFIGURATION
#
# This file defines the remote backend for storing Terraform's state file. Using a remote
# backend is critical for collaborative, enterprise-grade infrastructure management.
#
# - State Storage: AWS S3 is used to centrally and durably store the state file.
# - State Locking: AWS DynamoDB is used for state locking to prevent concurrent runs
#   from corrupting the state.
# - Security: The state file contains sensitive information and is configured to be encrypted.
#
# This configuration is a template. The actual 'bucket', 'key', and 'dynamodb_table' values
# will be provided dynamically for each environment during the `terraform init` phase.
#
# REQ-1-075: All cloud infrastructure is managed as code using Terraform.
# =================================================================================================

terraform {
  backend "s3" {
    # The name of the S3 bucket where the Terraform state file will be stored.
    # This bucket MUST be created manually or via a separate, root Terraform configuration.
    # It MUST have versioning and server-side encryption enabled.
    # This value will be passed during `terraform init` using `-backend-config="bucket=..."`.
    # Example: "platform-terraform-state-us-east-1"
    bucket = "platform-professional-network-tf-state-bucket"

    # The path to the state file within the S3 bucket. This path is configured
    # per environment to ensure strict state isolation.
    # This value will be passed during `terraform init` using `-backend-config="key=..."`.
    # Example for staging: "environments/staging/terraform.tfstate"
    key = "global/s3/terraform.tfstate"

    # The AWS region where the S3 bucket and DynamoDB table are located.
    # This should be consistent for all environments.
    # This value will be passed during `terraform init` using `-backend-config="region=..."`.
    region = "us-east-1"

    # The name of the DynamoDB table used for state locking. This table MUST have a
    # primary key named 'LockID' of type String.
    # This value will be passed during `terraform init` using `-backend-config="dynamodb_table=..."`.
    # Example: "platform-terraform-state-lock"
    dynamodb_table = "platform_professional_network_tf_state_lock_db"

    # Enforces encryption of the state file at rest in S3. This is a critical security measure.
    encrypt = true
  }
}