# outputs.tf in modules/elasticache
# Defines the outputs exposed by the ElastiCache module.

output "replication_group_id" {
  description = "The ID of the ElastiCache replication group."
  value       = aws_elasticache_replication_group.this.id
}

output "primary_endpoint_address" {
  description = "The endpoint address of the primary node in the Redis replication group."
  value       = aws_elasticache_replication_group.this.primary_endpoint_address
}

output "member_clusters" {
  description = "List of cluster members."
  value       = aws_elasticache_replication_group.this.member_clusters
}

output "security_group_id" {
  description = "The ID of the security group for the ElastiCache cluster."
  value       = aws_security_group.this.id
}