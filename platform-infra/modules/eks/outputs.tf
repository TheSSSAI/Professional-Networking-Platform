# outputs.tf in modules/eks
# Defines the outputs exposed by the EKS module.

output "cluster_name" {
  description = "The name of the EKS cluster."
  value       = aws_eks_cluster.this.name
}

output "cluster_endpoint" {
  description = "The endpoint for the EKS cluster's Kubernetes API server."
  value       = aws_eks_cluster.this.endpoint
}

output "cluster_ca_certificate" {
  description = "The base64 encoded certificate data required to communicate with the cluster."
  value       = aws_eks_cluster.this.certificate_authority[0].data
  sensitive   = true
}

output "cluster_oidc_issuer_url" {
  description = "The OIDC issuer URL for the EKS cluster, used for configuring IAM Roles for Service Accounts (IRSA)."
  value       = aws_eks_cluster.this.identity[0].oidc[0].issuer
}

output "cluster_security_group_id" {
  description = "The ID of the EKS cluster security group."
  value       = aws_eks_cluster.this.vpc_config[0].cluster_security_group_id
}

output "node_group_arns" {
  description = "ARNs of the EKS node groups."
  value       = [for group in aws_eks_node_group.this : group.arn]
}

output "node_group_iam_role_arn" {
  description = "IAM Role ARN of the EKS node groups."
  value       = var.eks_node_group_role_arn
}