variable "role_name" {
  description = "The name of the IAM role."
  type        = string
}

variable "role_description" {
  description = "The description of the IAM role."
  type        = string
  default     = null
}

variable "assume_role_policy" {
  description = "The policy that grants an entity permission to assume the role."
  type        = string
}

variable "attached_policy_arns" {
  description = "A list of ARNs for IAM policies to attach to the role."
  type        = list(string)
  default     = []
}

variable "inline_policies" {
  description = "A map of inline policies to attach to the role. The key is the policy name and the value is the policy JSON."
  type        = map(string)
  default     = {}
}

variable "max_session_duration" {
  description = "The maximum session duration (in seconds) that you want to set for the specified role."
  type        = number
  default     = 3600
}

variable "tags" {
  description = "A map of tags to apply to the IAM role."
  type        = map(string)
  default     = {}
}