# outputs.tf in modules/cloudflare
# Defines the outputs for the Cloudflare module.

output "zone_id" {
  description = "The ID of the Cloudflare zone being managed."
  value       = data.cloudflare_zone.this.id
}

output "zone_name" {
  description = "The name of the Cloudflare zone being managed."
  value       = data.cloudflare_zone.this.name
}

output "media_cdn_hostname" {
  description = "The full hostname for the media CDN."
  value       = var.s3_media_bucket_domain != "" ? cloudflare_record.media_cdn[0].hostname : null
}