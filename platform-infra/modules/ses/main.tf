# main.tf in modules/ses
# This module provisions and configures AWS Simple Email Service (SES)
# for sending transactional emails, as required by REQ-1-073.

# Create an SES domain identity. This starts the process of verifying
# that we own the domain and are authorized to send emails from it.
resource "aws_ses_domain_identity" "this" {
  domain = var.domain_name

  tags = var.tags
}

# Generate DKIM (DomainKeys Identified Mail) tokens. DKIM is an email
# authentication method that helps prevent email spoofing.
# AWS will provide CNAME records that we need to add to our DNS provider.
resource "aws_ses_domain_dkim" "this" {
  domain = aws_ses_domain_identity.this.domain
}

# Verify the SES domain identity by creating a DNS record.
# The value for this record is provided by the aws_ses_domain_identity resource.
# This resource is a placeholder to show what needs to be created in DNS.
# The actual creation is handled by the Cloudflare module using this module's output.
resource "null_resource" "domain_verification_dns_record_placeholder" {
  triggers = {
    # This trigger ensures that if the verification token changes, it's known.
    verification_token = aws_ses_domain_identity.this.verification_token
  }

  provisioner "local-exec" {
    when    = create
    command = "echo 'SES Domain Verification: Create a TXT record for ${aws_ses_domain_identity.this.domain} with value ${aws_ses_domain_identity.this.verification_token}'"
  }
}

# Placeholder for DKIM DNS records. Similar to the domain verification,
# these need to be created in the DNS provider. This module outputs the necessary values.
resource "null_resource" "dkim_dns_records_placeholder" {
  triggers = {
    # This trigger ensures that if DKIM tokens change, it's known.
    dkim_tokens = join(",", aws_ses_domain_dkim.this.dkim_tokens)
  }

  provisioner "local-exec" {
    when = create
    # Loop through the tokens to show the CNAME records needed
    command = <<EOT
      echo 'SES DKIM Verification: Create the following CNAME records:'
      %{~ for token in split(",", self.triggers.dkim_tokens) ~}
      echo '  Name: ${token}._domainkey.${aws_ses_domain_identity.this.domain} -> Value: ${token}.dkim.amazonses.com'
      %{~ endfor ~}
    EOT
  }
}

# If a specific "from" address is provided, create an email identity for it.
# This can be useful for setting up configuration sets or specific sending rules.
resource "aws_ses_email_identity" "from_address" {
  count = var.from_address != "" ? 1 : 0

  email = var.from_address

  tags = var.tags
}