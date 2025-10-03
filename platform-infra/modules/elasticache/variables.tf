variable "cluster_id" {
  description = "The ID of the ElastiCache cluster."
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., 'dev', 'staging', 'prod')."
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC where the ElastiCache cluster will be deployed."
  type        = string
}

variable "private_subnet_ids" {
  description = "A list of private subnet IDs for the ElastiCache subnet group."
  type        = list(string)
}

variable "allowed_security_group_ids" {
  description = "A list of security group IDs that are allowed to access the ElastiCache cluster."
  type        = list(string)
}

variable "engine" {
  description = "The cache engine to use, e.g., 'redis'."
  type        = string
  default     = "redis"
}

variable "engine_version" {
  description = "The version of the cache engine."
  type        = string
  default     = "7.0"
}

variable "node_type" {
  description = "The compute and memory capacity of the nodes in the cluster."
  type        = string
}

variable "num_cache_nodes" {
  description = "The number of cache nodes that the cache cluster should have."
  type        = number
}

variable "parameter_group_name" {
  description = "The name of the parameter group to associate with this cache cluster."
  type        = string
  default     = "default.redis7"
}

variable "port" {
  description = "The port number on which each of the cache nodes will accept connections."
  type        = number
  default     = 6379
}

variable "maintenance_window" {
  description = "The weekly time range (in UTC) during which system maintenance can occur."
  type        = string
  default     = "sun:06:00-sun:07:00"
}

variable "snapshot_retention_limit" {
  description = "The number of days for which ElastiCache will retain automatic snapshots before deleting them."
  type        = number
  default     = 7
}

variable "snapshot_window" {
  description = "The daily time range (in UTC) during which ElastiCache will begin taking a daily snapshot of your cluster."
  type        = string
  default     = "03:00-04:00"
}

variable "apply_immediately" {
  description = "Specifies whether any modifications are applied immediately, or during the next maintenance window."
  type        = bool
  default     = false
}

variable "at_rest_encryption_enabled" {
  description = "Whether to enable encryption at rest."
  type        = bool
  default     = true
}

variable "transit_encryption_enabled" {
  description = "Whether to enable encryption in transit."
  type        = bool
  default     = true
}

variable "auth_token" {
  description = "The password used to access a password-protected server. This should be managed via Secrets Manager and passed in as a sensitive variable."
  type        = string
  sensitive   = true
  default     = null
}

variable "tags" {
  description = "A map of tags to apply to all resources."
  type        = map(string)
  default     = {}
}