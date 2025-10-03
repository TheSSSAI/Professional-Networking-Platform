# outputs.tf in modules/ses
# Defines the outputs for the SES module. These outputs are crucial for
# configuring the DNS records required for domain verification and DKIM.

output "domain_identity_arn" {
  description = "The ARN of the SES domain identity."
  value       = aws_ses_domain_identity.this.arn
}

output "domain_verification_record_name" {
  description = "The name of the DNS TXT record required to verify the domain."
  value       = "_amazonses.${aws_ses_domain_identity.this.domain}"
}

output "domain_verification_record_value" {
  description = "The value of the DNS TXT record required to verify the domain."
  value       = aws_ses_domain_identity.this.verification_token
}

output "dkim_dns_records" {
  description = "A map of the CNAME records required for DKIM verification. The map key is the record name and the value is the record value."
  value = {
    for token in aws_ses_domain_dkim.this.dkim_tokens :
    "${token}._domainkey.${aws_ses_domain_identity.this.domain}" => "${token}.dkim.amazonses.com"
  }
}