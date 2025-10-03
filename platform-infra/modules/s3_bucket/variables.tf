variable "bucket_name" {
  description = "The name of the S3 bucket. Must be globally unique."
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

variable "versioning_enabled" {
  description = "A boolean that indicates if versioning should be enabled for the S3 bucket."
  type        = bool
  default     = false
}

variable "block_public_access" {
  description = "A boolean that indicates if all public access should be blocked."
  type        = bool
  default     = true
}

variable "server_side_encryption_configuration" {
  description = "Map containing server-side encryption configuration."
  type = object({
    rule = object({
      apply_server_side_encryption_by_default = object({
        sse_algorithm     = string
        kms_master_key_id = optional(string)
      })
    })
  })
  default = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }
}

variable "cors_rules" {
  description = "A list of maps containing CORS rules. See AWS S3 bucket CORS documentation for details."
  type        = any
  default     = []
}

variable "lifecycle_rules" {
  description = "A list of maps containing lifecycle rules. See AWS S3 bucket lifecycle documentation for details."
  type        = any
  default     = []
}

variable "force_destroy" {
  description = "A boolean that indicates all objects should be deleted from the bucket so that the bucket can be destroyed without error. Set to true for ephemeral environments only."
  type        = bool
  default     = false
}

variable "policy" {
  description = "A valid bucket policy JSON document. Useful for allowing access from Cloudflare or other services."
  type        = string
  default     = null
}

variable "tags" {
  description = "A map of tags to apply to the bucket."
  type        = map(string)
  default     = {}
}