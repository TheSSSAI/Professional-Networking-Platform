# main.tf in modules/cloudflare
# This module is responsible for managing Cloudflare resources, including DNS records,
# CDN configuration, and basic security settings, fulfilling requirements REQ-1-072.

# Data source to get the zone ID for the given domain name.
# This avoids hardcoding the zone ID and allows the module to be reusable.
data "cloudflare_zone" "this" {
  name = var.domain_name
}

# Manages a set of DNS records based on the input variable.
# Using for_each allows for declarative management of an arbitrary number of records.
resource "cloudflare_record" "this" {
  for_each = var.dns_records

  zone_id = data.cloudflare_zone.this.id
  name    = each.value.name
  value   = each.value.value
  type    = each.value.type
  proxied = lookup(each.value, "proxied", false)
  ttl     = lookup(each.value, "ttl", 300) # Default TTL of 5 minutes
}

# CNAME record for serving S3 media content through the Cloudflare CDN.
# This is a specific implementation for REQ-1-072.
resource "cloudflare_record" "media_cdn" {
  count = var.s3_media_bucket_domain != "" ? 1 : 0

  zone_id = data.cloudflare_zone.this.id
  name    = var.media_cdn_subdomain
  value   = var.s3_media_bucket_domain
  type    = "CNAME"
  proxied = true # Enable Cloudflare's CDN and security features
  ttl     = 300
}

# Basic WAF and security header configuration using a Ruleset.
# This provides a foundational layer of security as required by REQ-1-072.
# The rules defined here are a starting point and should be expanded based on security audits.
resource "cloudflare_ruleset" "http_security_headers" {
  zone_id     = data.cloudflare_zone.this.id
  name        = "${var.environment}-security-headers"
  description = "Apply standard security headers to all incoming requests for the ${var.environment} environment."
  kind        = "zone"
  phase       = "http_response_headers_transform"

  rules {
    action = "rewrite"
    action_parameters {
      headers {
        name       = "Content-Security-Policy"
        operation  = "set"
        # A strict CSP is recommended. This is a placeholder and should be refined.
        # It allows self, and images/scripts from the CDN subdomain.
        expression = "'default-src \\'self\\'; script-src \\'self\\' \\'unsafe-inline\\'; style-src \\'self\\' \\'unsafe-inline\\'; img-src \\'self\\' data: https://${var.media_cdn_subdomain}.${var.domain_name}; connect-src \\'self\\' wss://${var.domain_name};'"
      }
    }
    expression  = "true" # Apply to all requests
    description = "Set Content-Security-Policy Header"
    enabled     = true
  }

  rules {
    action = "rewrite"
    action_parameters {
      headers {
        name       = "X-Frame-Options"
        operation  = "set"
        expression = "'SAMEORIGIN'"
      }
    }
    expression  = "true"
    description = "Set X-Frame-Options Header to prevent clickjacking"
    enabled     = true
  }

  rules {
    action = "rewrite"
    action_parameters {
      headers {
        name       = "X-Content-Type-Options"
        operation  = "set"
        expression = "'nosniff'"
      }
    }
    expression  = "true"
    description = "Set X-Content-Type-Options Header to prevent MIME-sniffing"
    enabled     = true
  }

  rules {
    action = "rewrite"
    action_parameters {
      headers {
        name       = "Referrer-Policy"
        operation  = "set"
        expression = "'strict-origin-when-cross-origin'"
      }
    }
    expression  = "true"
    description = "Set Referrer-Policy Header for privacy"
    enabled     = true
  }
}

# Page Rule to configure caching for the S3 media assets CDN.
# This ensures images are cached aggressively at the edge for performance.
resource "cloudflare_page_rule" "media_cdn_caching" {
  count = var.s3_media_bucket_domain != "" ? 1 : 0

  zone_id = data.cloudflare_zone.this.id
  target  = "${var.media_cdn_subdomain}.${var.domain_name}/*"
  status  = "active"

  actions {
    cache_level      = "cache_everything"
    edge_cache_ttl   = 2592000 # Cache for 30 days at the edge
    browser_cache_ttl = 86400 # Cache for 1 day in browser
  }
}