# This file defines the outputs for the 'staging' environment.
# These outputs are consumed by CI/CD pipelines to configure application deployments.

output "aws_region" {
  description = "The AWS region where the environment is deployed."
  value       = var.aws_region
}

# ------------------------------------------------------------------------------
# VPC OUTPUTS
# ------------------------------------------------------------------------------
output "vpc_id" {
  description = "The ID of the provisioned VPC."
  value       = module.vpc.vpc_id
}

# ------------------------------------------------------------------------------
# EKS OUTPUTS
# ------------------------------------------------------------------------------
output "eks_cluster_name" {
  description = "The name of the EKS cluster."
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "The API server endpoint for the EKS cluster."
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_oidc_issuer_url" {
  description = "The OIDC issuer URL for the EKS cluster, used for IAM Roles for Service Accounts (IRSA)."
  value       = module.eks.cluster_oidc_issuer_url
}

# ------------------------------------------------------------------------------
# RDS OUTPUTS
# ------------------------------------------------------------------------------
output "rds_database_endpoint" {
  description = "The connection endpoint for the PostgreSQL RDS instance."
  value       = module.rds.db_instance_address
}

output "rds_database_port" {
  description = "The port for the PostgreSQL RDS instance."
  value       = module.rds.db_instance_port
}

output "rds_database_name" {
  description = "The name of the main database."
  value       = module.rds.db_instance_name
}

output "rds_database_username" {
  description = "The master username for the database."
  value       = module.rds.db_instance_username
}

output "rds_database_password_secret_arn" {
  description = "The ARN of the AWS Secrets Manager secret containing the database password."
  value       = module.rds.db_instance_password_secret_arn
  sensitive   = true
}

# ------------------------------------------------------------------------------
# ELASTICACHE (REDIS) OUTPUTS
# ------------------------------------------------------------------------------
output "redis_endpoint" {
  description = "The primary endpoint for the ElastiCache Redis cluster."
  value       = module.elasticache.primary_endpoint_address
}

output "redis_port" {
  description = "The port for the ElastiCache Redis cluster."
  value       = module.elasticache.port
}

# ------------------------------------------------------------------------------
# OPENSEARCH OUTPUTS
# ------------------------------------------------------------------------------
output "opensearch_endpoint" {
  description = "The domain endpoint for the OpenSearch cluster."
  value       = module.opensearch.domain_endpoint
}

# ------------------------------------------------------------------------------
# S3 & CDN OUTPUTS
# ------------------------------------------------------------------------------
output "media_s3_bucket_name" {
  description = "The name of the S3 bucket for user-uploaded media."
  value       = module.s3_media_bucket.bucket_id
}

output "media_cdn_url" {
  description = "The Cloudflare CDN base URL for accessing media."
  value       = module.cloudflare.media_cdn_url
}

# ------------------------------------------------------------------------------
# IAM OUTPUTS
# ------------------------------------------------------------------------------
output "eks_cluster_role_arn" {
  description = "ARN of the IAM role for the EKS cluster."
  value       = module.iam.eks_cluster_role_arn
}