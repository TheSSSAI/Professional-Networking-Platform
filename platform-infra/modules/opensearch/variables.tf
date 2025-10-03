variable "domain_name" {
  description = "The name for the OpenSearch domain."
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., 'dev', 'staging', 'prod')."
  type        = string
}

variable "engine_version" {
  description = "The version of OpenSearch to use."
  type        = string
  default     = "OpenSearch_2.11"
}

variable "vpc_id" {
  description = "The ID of the VPC to deploy the OpenSearch domain into."
  type        = string
}

variable "private_subnet_ids" {
  description = "A list of private subnet IDs for the OpenSearch domain VPC options."
  type        = list(string)
}

variable "vpc_security_group_ids" {
  description = "A list of security group IDs to associate with the OpenSearch domain."
  type        = list(string)
}

variable "instance_type" {
  description = "The instance type for the OpenSearch data nodes."
  type        = string
}

variable "instance_count" {
  description = "The number of data nodes in the OpenSearch domain."
  type        = number
}

variable "dedicated_master_enabled" {
  description = "Whether to enable dedicated master nodes."
  type        = bool
  default     = false
}

variable "dedicated_master_type" {
  description = "The instance type for the dedicated master nodes."
  type        = string
  default     = "t3.small.search"
}

variable "dedicated_master_count" {
  description = "The number of dedicated master nodes."
  type        = number
  default     = 3
}

variable "ebs_volume_size" {
  description = "The size in GB for the EBS volume attached to data nodes."
  type        = number
}

variable "ebs_volume_type" {
  description = "The type of EBS volume to use."
  type        = string
  default     = "gp3"
}

variable "encrypt_at_rest_enabled" {
  description = "Whether to enable encryption at rest."
  type        = bool
  default     = true
}

variable "node_to_node_encryption_enabled" {
  description = "Whether to enable node-to-node encryption."
  type        = bool
  default     = true
}

variable "automated_snapshot_start_hour" {
  description = "The hour in UTC to start the daily automated snapshot."
  type        = number
  default     = 0
}

variable "fine_grained_access_control_enabled" {
  description = "Whether to enable fine-grained access control."
  type        = bool
  default     = true
}

variable "master_user_arn" {
  description = "The ARN for the master user of the domain for fine-grained access control."
  type        = string
  default     = null
}

variable "access_policies" {
  description = "IAM policy document specifying the access policies for the domain."
  type        = string
}

variable "tags" {
  description = "A map of tags to apply to all resources."
  type        = map(string)
  default     = {}
}