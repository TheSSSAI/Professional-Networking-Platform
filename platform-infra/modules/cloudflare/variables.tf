variable "zone_id" {
  description = "The Zone ID of the domain in Cloudflare."
  type        = string
}

variable "api_token" {
  description = "The Cloudflare API token. Should be passed as a sensitive environment variable."
  type        = string
  sensitive   = true
}

variable "dns_records" {
  description = "A map of DNS records to create in Cloudflare."
  type = map(object({
    name    = string
    value   = string
    type    = string
    proxied = optional(bool, true)
    ttl     = optional(number, 1) # 1 for auto
  }))
  default = {}
}

variable "cdn_enabled_for_s3_bucket" {
  description = "Flag to enable CDN distribution for the S3 media bucket."
  type        = bool
  default     = false
}

variable "s3_media_bucket_domain_name" {
  description = "The domain name of the S3 media bucket (e.g., my-bucket.s3.amazonaws.com)."
  type        = string
  default     = null
}

variable "media_cdn_hostname" {
  description = "The hostname for the media CDN (e.g., media.example.com)."
  type        = string
  default     = null
}

variable "ssl_mode" {
  description = "Cloudflare SSL/TLS encryption mode for the zone. Recommended: 'full' or 'strict'."
  type        = string
  default     = "full"
  validation {
    condition     = contains(["off", "flexible", "full", "strict"], var.ssl_mode)
    error_message = "Valid SSL modes are 'off', 'flexible', 'full', or 'strict'."
  }
}

variable "always_use_https" {
  description = "Whether to redirect all HTTP requests to HTTPS."
  type        = bool
  default     = true
}