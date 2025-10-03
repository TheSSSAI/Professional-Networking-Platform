variable "aws_region" {
  description = "The AWS region where resources will be created."
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

variable "vpc_cidr" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"

  validation {
    condition     = can(cidrnetmask(var.vpc_cidr))
    error_message = "The vpc_cidr value must be a valid CIDR block."
  }
}

variable "availability_zones" {
  description = "A list of availability zones to use for the VPC resources."
  type        = list(string)
  validation {
    condition     = length(var.availability_zones) >= 2
    error_message = "At least two availability zones are required for high availability."
  }
}

variable "public_subnet_cidrs" {
  description = "A list of CIDR blocks for the public subnets."
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "A list of CIDR blocks for the private subnets."
  type        = list(string)
}

variable "database_subnet_cidrs" {
  description = "A list of CIDR blocks for the isolated database subnets."
  type        = list(string)
}

variable "enable_nat_gateway" {
  description = "Flag to enable/disable NAT Gateway for private subnets. Should be true for prod."
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Flag to provision a single NAT Gateway. Set to false for multi-AZ NAT Gateways in production."
  type        = bool
  default     = false
}

variable "enable_dns_hostnames" {
  description = "Enable DNS hostnames in the VPC."
  type        = bool
  default     = true
}

variable "enable_dns_support" {
  description = "Enable DNS support in the VPC."
  type        = bool
  default     = true
}

variable "tags" {
  description = "A map of tags to apply to all resources."
  type        = map(string)
  default     = {}
}