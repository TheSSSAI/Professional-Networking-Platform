# ------------------------------------------------------------------------------
# DEVELOPMENT ENVIRONMENT VARIABLES
# ------------------------------------------------------------------------------
# This file provides values for the variables defined in variables.tf
# for the 'dev' environment. These values typically correspond to smaller,
# more cost-effective resource configurations.
# ------------------------------------------------------------------------------

# General
aws_region   = "us-east-1"
project_name = "pro-connect"
# NOTE: aws_account_id should be provided securely, e.g., via environment variable TF_VAR_aws_account_id
# aws_account_id = "123456789012"

# VPC
vpc_cidr_block = "10.0.0.0/16"

# EKS
eks_cluster_version = "1.28"
eks_node_groups = {
  default = {
    instance_type = "t3.medium"
    min_size      = 1
    max_size      = 3
    desired_size  = 2
  }
}

# RDS (PostgreSQL)
rds_engine_version        = "15.5"
rds_instance_class        = "db.t3.small"
rds_allocated_storage     = 20
rds_multi_az              = false # Cost-saving for dev
rds_backup_retention_period = 7     # Minimal backup for dev

# ElastiCache (Redis)
redis_node_type       = "cache.t3.micro"
redis_num_cache_nodes = 1
redis_engine_version  = "7.0"

# OpenSearch
opensearch_engine_version   = "OpenSearch_2.9"
opensearch_instance_type    = "t3.small.search"
opensearch_instance_count   = 1 # Cost-saving for dev
opensearch_ebs_volume_size  = 10

# External Services
ses_domain_name        = "dev.pro-connect.com"
cloudflare_domain_name = "pro-connect.com"
# NOTE: cloudflare_zone_id should be provided securely, e.g., via environment variable TF_VAR_cloudflare_zone_id
# cloudflare_zone_id = "..."