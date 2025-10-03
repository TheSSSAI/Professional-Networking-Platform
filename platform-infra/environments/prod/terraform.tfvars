# ------------------------------------------------------------------------------
# PRODUCTION ENVIRONMENT VARIABLES
# ------------------------------------------------------------------------------
# This file provides values for the variables defined in variables.tf
# for the 'prod' environment. These values reflect production-grade,
# highly available, and scalable resource configurations.
# ------------------------------------------------------------------------------

# General
aws_region   = "us-east-1"
project_name = "pro-connect"
# NOTE: aws_account_id should be provided securely, e.g., via environment variable TF_VAR_aws_account_id
# aws_account_id = "123456789012"

# VPC
vpc_cidr_block = "10.2.0.0/16"

# EKS
eks_cluster_version = "1.28"
eks_node_groups = {
  general_purpose = {
    instance_type = "m5.large"
    min_size      = 3
    max_size      = 10
    desired_size  = 3
  },
  memory_optimized = {
    instance_type = "r5.large"
    min_size      = 2
    max_size      = 5
    desired_size  = 2
  }
}

# RDS (PostgreSQL)
rds_engine_version        = "15.5"
rds_instance_class        = "db.m5.xlarge"
rds_allocated_storage     = 200
rds_multi_az              = true # REQ-1-085: Production must be highly available
rds_backup_retention_period = 30   # REQ-1-082: Retain backups for 30 days for DR

# ElastiCache (Redis)
redis_node_type       = "cache.m5.large"
redis_num_cache_nodes = 3
redis_engine_version  = "7.0"

# OpenSearch
opensearch_engine_version   = "OpenSearch_2.9"
opensearch_instance_type    = "m5.large.search"
opensearch_instance_count   = 3 # REQ-1-085: Production must be highly available
opensearch_ebs_volume_size  = 50

# External Services
ses_domain_name        = "pro-connect.com"
cloudflare_domain_name = "pro-connect.com"
# NOTE: cloudflare_zone_id should be provided securely, e.g., via environment variable TF_VAR_cloudflare_zone_id
# cloudflare_zone_id = "..."