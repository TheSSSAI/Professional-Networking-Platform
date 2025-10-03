# ------------------------------------------------------------------------------
# STAGING ENVIRONMENT VARIABLES
# ------------------------------------------------------------------------------
# This file provides values for the variables defined in variables.tf
# for the 'staging' environment. These values should mirror production as
# closely as possible, enabling HA and DR features for accurate testing.
# ------------------------------------------------------------------------------

# General
aws_region   = "us-east-1"
project_name = "pro-connect"
# NOTE: aws_account_id should be provided securely, e.g., via environment variable TF_VAR_aws_account_id
# aws_account_id = "123456789012"

# VPC
vpc_cidr_block = "10.1.0.0/16"

# EKS
eks_cluster_version = "1.28"
eks_node_groups = {
  default = {
    instance_type = "t3.large"
    min_size      = 2
    max_size      = 5
    desired_size  = 2
  }
}

# RDS (PostgreSQL)
rds_engine_version        = "15.5"
rds_instance_class        = "db.t3.medium"
rds_allocated_storage     = 100
rds_multi_az              = true # Staging mirrors production HA
rds_backup_retention_period = 14   # Shorter retention than prod

# ElastiCache (Redis)
redis_node_type       = "cache.t3.small"
redis_num_cache_nodes = 2
redis_engine_version  = "7.0"

# OpenSearch
opensearch_engine_version   = "OpenSearch_2.9"
opensearch_instance_type    = "t3.medium.search"
opensearch_instance_count   = 2 # Enable HA
opensearch_ebs_volume_size  = 20

# External Services
ses_domain_name        = "staging.pro-connect.com"
cloudflare_domain_name = "pro-connect.com"
# NOTE: cloudflare_zone_id should be provided securely, e.g., via environment variable TF_VAR_cloudflare_zone_id
# cloudflare_zone_id = "..."