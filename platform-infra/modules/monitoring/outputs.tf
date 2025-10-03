# outputs.tf in modules/monitoring
# Defines the outputs for the monitoring module, providing crucial endpoints
# and identifiers for configuring observability tools in Kubernetes.

output "prometheus_workspace_id" {
  description = "The ID of the AWS Managed Prometheus workspace."
  value       = aws_prometheus_workspace.this.id
}

output "prometheus_workspace_arn" {
  description = "The ARN of the AWS Managed Prometheus workspace."
  value       = aws_prometheus_workspace.this.arn
}

output "prometheus_workspace_endpoint" {
  description = "The endpoint of the AWS Managed Prometheus workspace."
  value       = aws_prometheus_workspace.this.prometheus_endpoint
}

output "prometheus_remote_write_url" {
  description = "The remote write URL for the AMP workspace."
  value       = "${aws_prometheus_workspace.this.prometheus_endpoint}api/v1/remote_write"
}

output "prometheus_query_url" {
  description = "The query URL for the AMP workspace."
  value       = "${aws_prometheus_workspace.this.prometheus_endpoint}api/v1/query"
}

output "prometheus_server_iam_role_arn" {
  description = "The ARN of the IAM role for the Prometheus server service account in EKS."
  value       = aws_iam_role.prometheus_server.arn
}