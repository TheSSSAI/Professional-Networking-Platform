# outputs.tf in modules/opensearch
# Defines the outputs exposed by the OpenSearch module.

output "domain_id" {
  description = "The ID of the OpenSearch domain."
  value       = aws_opensearch_domain.this.id
}

output "domain_arn" {
  description = "The ARN of the OpenSearch domain."
  value       = aws_opensearch_domain.this.arn
}

output "domain_endpoint" {
  description = "The endpoint of the OpenSearch domain."
  value       = aws_opensearch_domain.this.endpoint
}

output "kibana_endpoint" {
  description = "The endpoint for the OpenSearch Dashboards (Kibana)."
  value       = aws_opensearch_domain.this.kibana_endpoint
}