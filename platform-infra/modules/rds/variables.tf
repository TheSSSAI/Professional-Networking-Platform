variable "db_name" {
  description = "The name of the database to create when the DB instance is created."
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., 'dev', 'staging', 'prod')."
  type        = string
}

variable "project_name" {
  description = "The name of the project, used for resource naming and tagging."
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC where the RDS instance will be deployed."
  type        = string
}

variable "database_subnet_ids" {
  description = "A list of subnet IDs in the database subnet group for the RDS instance."
  type        = list(string)
}

variable "vpc_security_group_ids" {
  description = "The security group IDs to associate with the RDS instance."
  type        = list(string)
}

variable "engine" {
  description = "The database engine to use."
  type        = string
  default     = "postgres"
}

variable "engine_version" {
  description = "The database engine version."
  type        = string
  default     = "15.5"
}

variable "instance_class" {
  description = "The instance class for the RDS instance."
  type        = string
}

variable "allocated_storage" {
  description = "The allocated storage in gigabytes."
  type        = number
}

variable "max_allocated_storage" {
  description = "The maximum storage to autoscale to in gigabytes."
  type        = number
}

variable "storage_type" {
  description = "The storage type for the RDS instance."
  type        = string
  default     = "gp3"
}

variable "multi_az" {
  description = "Specifies if the RDS instance is multi-AZ. Required for prod environments per REQ-1-085."
  type        = bool
  default     = false
}

variable "username" {
  description = "The master username for the database."
  type        = string
  default     = "platformadmin"
}

variable "manage_master_user_password" {
  description = "Set to true to allow Terraform to manage the master user password in Secrets Manager."
  type        = bool
  default     = true
}

variable "password_secret_kms_key_id" {
  description = "The KMS key ARN to encrypt the password secret in Secrets Manager. If null, uses the default KMS key."
  type        = string
  default     = null
}

variable "backup_retention_period" {
  description = "The days to retain backups for. Must be > 0 to enable backups and Point-In-Time-Recovery (PITR). Set to 30 for prod per REQ-1-082."
  type        = number
  default     = 7
}

variable "backup_window" {
  description = "The daily time range (in UTC) during which automated backups are created."
  type        = string
  default     = "04:00-06:00"
}

variable "maintenance_window" {
  description = "The weekly time range (in UTC) during which system maintenance can occur."
  type        = string
  default     = "sun:07:00-sun:09:00"
}

variable "deletion_protection" {
  description = "The database can't be deleted when this value is set to true. Highly recommended for prod."
  type        = bool
  default     = false
}

variable "copy_tags_to_snapshot" {
  description = "Copy all tags to snapshots."
  type        = bool
  default     = true
}

variable "performance_insights_enabled" {
  description = "Specifies whether Performance Insights are enabled."
  type        = bool
  default     = true
}

variable "storage_encrypted" {
  description = "Specifies whether the DB instance is encrypted."
  type        = bool
  default     = true
}

variable "final_snapshot_identifier" {
  description = "The name of your final DB snapshot when this DB instance is deleted. If not specified, no final snapshot will be made."
  type        = string
  default     = null
}

variable "tags" {
  description = "A map of tags to apply to all resources."
  type        = map(string)
  default     = {}
}