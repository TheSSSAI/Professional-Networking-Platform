variable "cluster_name" {
  description = "The name of the EKS cluster."
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., 'dev', 'staging', 'prod')."
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC where the EKS cluster and its nodes will be deployed."
  type        = string
}

variable "private_subnet_ids" {
  description = "A list of private subnet IDs where the EKS worker nodes will be deployed."
  type        = list(string)
}

variable "cluster_version" {
  description = "The Kubernetes version for the EKS cluster."
  type        = string
  default     = "1.28"
}

variable "cluster_endpoint_private_access" {
  description = "Indicates whether or not the Amazon EKS private API server endpoint is enabled."
  type        = bool
  default     = true
}

variable "cluster_endpoint_public_access" {
  description = "Indicates whether or not the Amazon EKS public API server endpoint is enabled."
  type        = bool
  default     = true
}

variable "public_access_cidrs" {
  description = "List of CIDR blocks to allow access to the public EKS endpoint. Use with caution."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "managed_node_groups" {
  description = "A map of managed node group configurations for the EKS cluster."
  type = map(object({
    instance_types = list(string)
    min_size       = number
    max_size       = number
    desired_size   = number
    disk_size      = number
    ami_type       = optional(string, "AL2_x86_64")
    capacity_type  = optional(string, "ON_DEMAND")
    labels         = optional(map(string), {})
    taints = optional(list(object({
      key    = string
      value  = string
      effect = string
    })), [])
  }))
  default = {}
}

variable "cluster_enabled_log_types" {
  description = "A list of cluster control plane log types to enable. E.g., 'api', 'audit', 'authenticator', 'controllerManager', 'scheduler'."
  type        = list(string)
  default     = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

variable "tags" {
  description = "A map of tags to apply to all EKS-related resources."
  type        = map(string)
  default     = {}
}