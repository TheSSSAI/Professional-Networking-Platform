variable "project_name" {
  description = "The name of the project."
  type        = string
}

variable "environment" {
  description = "The deployment environment."
  type        = string
}

variable "enable_prometheus" {
  description = "Flag to enable AWS Managed Service for Prometheus (AMP)."
  type        = bool
  default     = false
}

variable "prometheus_workspace_alias" {
  description = "Alias for the AMP workspace."
  type        = string
  default     = null
}

variable "enable_grafana" {
  description = "Flag to enable AWS Managed Grafana."
  type        = bool
  default     = false
}

variable "grafana_workspace_name" {
  description = "The name for the Grafana workspace."
  type        = string
  default     = null
}

variable "grafana_account_access_type" {
  description = "The type of account access for the Grafana workspace. Valid values: CURRENT_ACCOUNT, ORGANIZATION."
  type        = string
  default     = "CURRENT_ACCOUNT"
}

variable "grafana_authentication_providers" {
  description = "The authentication providers for the Grafana workspace. Valid values: AWS_SSO, SAML."
  type        = list(string)
  default     = ["AWS_SSO"]
}

variable "grafana_permission_type" {
  description = "The permission type of the Grafana workspace. Valid values: CUSTOMER_MANAGED, SERVICE_MANAGED."
  type        = string
  default     = "SERVICE_MANAGED"
}

variable "tags" {
  description = "A map of tags to apply to monitoring resources."
  type        = map(string)
  default     = {}
}