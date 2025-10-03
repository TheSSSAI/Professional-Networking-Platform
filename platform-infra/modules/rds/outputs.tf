# outputs.tf in modules/rds
# Defines the outputs exposed by the RDS module.

output "db_instance_address" {
  description = "The address of the RDS instance."
  value       = aws_db_instance.this.address
}

output "db_instance_endpoint" {
  description = "The connection endpoint for the RDS instance."
  value       = aws_db_instance.this.endpoint
}

output "db_instance_port" {
  description = "The port on which the DB accepts connections."
  value       = aws_db_instance.this.port
}

output "db_name" {
  description = "The name of the database."
  value       = aws_db_instance.this.db_name
}

output "db_username" {
  description = "The master username for the database."
  value       = aws_db_instance.this.username
}

output "db_password_secret_arn" {
  description = "The ARN of the AWS Secrets Manager secret storing the master password."
  value       = aws_secretsmanager_secret.this.arn
}

output "db_security_group_id" {
  description = "The ID of the security group for the RDS instance."
  value       = aws_security_group.this.id
}

output "db_instance_arn" {
  description = "The ARN of the RDS instance."
  value       = aws_db_instance.this.arn
}