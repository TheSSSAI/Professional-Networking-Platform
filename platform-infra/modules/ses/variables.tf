variable "domain_name" {
  description = "The domain name to verify with AWS SES for sending emails."
  type        = string
}

variable "enable_dkim" {
  description = "If true, then a DKIM identity is created for this domain."
  type        = bool
  default     = true
}

variable "mail_from_domain" {
  description = "Subdomain to use for the MAIL FROM domain. Required for SPF alignment."
  type        = string
  default     = null
}

variable "additional_email_identities" {
  description = "A list of additional email addresses to verify for sending."
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "A map of tags to apply to SES resources."
  type        = map(string)
  default     = {}
}