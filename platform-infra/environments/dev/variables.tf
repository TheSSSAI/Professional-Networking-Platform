# ------------------------------------------------------------------------------
# GENERAL VARIABLES
# ------------------------------------------------------------------------------
variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
}

variable "project_name" {
  description = "The name of the project, used for resource naming."
  type        = string
}

variable "aws_account_id" {
  description = "The AWS Account ID where resources are deployed."
  type        = string
}

# ------------------------------------------------------------------------------
# VPC MODULE VARIABLES
# ------------------------------------------------------------------------------
variable "vpc_cidr_block" {
  description = "The CIDR block for the VPC."
  type        = string
}

# ------------------------------------------------------------------------------
# EKS MODULE VARIABLES
# ------------------------------------------------------------------------------
variable "eks_cluster_version" {
  description = "The Kubernetes version for the EKS cluster."
  type        = string
}

variable "eks_node_groups" {
  description = "A map of EKS node group configurations."
  type        = any
}

# ------------------------------------------------------------------------------
# RDS MODULE VARIABLES
# ------------------------------------------------------------------------------
variable "rds_engine_version" {
  description = "The PostgreSQL engine version for the RDS instance."
  type        = string
}

variable "rds_instance_class" {
  description = "The instance class for the RDS database."
  type        = string
}

variable "rds_allocated_storage" {
  description = "The allocated storage for the RDS database in GB."
  type        = number
}

variable "rds_multi_az" {
  description = "Whether to enable Multi-AZ for the RDS database."
  type        = bool
}

variable "rds_backup_retention_period" {
  description = "The number of days to retain backups for."
  type        = number
}

# ------------------------------------------------------------------------------
# ELASTICACHE (REDIS) MODULE VARIABLES
# ------------------------------------------------------------------------------
variable "redis_node_type" {
  description = "The node type for the ElastiCache Redis cluster."
  type        = string
}

variable "redis_num_cache_nodes" {
  description = "The number of nodes in the Redis cluster."
  type        = number
}

variable "redis_engine_version" {
  description = "The Redis engine version."
  type        = string
}

# ------------------------------------------------------------------------------
# OPENSEARCH MODULE VARIABLES
# ------------------------------------------------------------------------------
variable "opensearch_engine_version" {
  description = "The OpenSearch engine version."
  type        = string
}

variable "opensearch_instance_type" {
  description = "The instance type for the OpenSearch data nodes."
  type        = string
}

variable "opensearch_instance_count" {
  description = "The number of data nodes in the OpenSearch cluster."
  type        = number
}

variable "opensearch_ebs_volume_size" {
  description = "The size of the EBS volume for each OpenSearch data node in GB."
  type        = number
}

# ------------------------------------------------------------------------------
# EXTERNAL SERVICES VARIABLES
# ------------------------------------------------------------------------------
variable "ses_domain_name" {
  description = "The domain name to verify with AWS SES for sending emails."
  type        = string
}

variable "cloudflare_zone_id" {
  description = "The Zone ID of the domain in Cloudflare."
  type        = string
}

variable "cloudflare_domain_name" {
  description = "The root domain name managed in Cloudflare."
  type        = string
}