# outputs.tf in modules/iam
# This file defines the outputs of the IAM module, exposing the ARN and name
# of the created IAM role for use in other parts of the infrastructure.

output "iam_role_arn" {
  description = "The Amazon Resource Name (ARN) of the IAM role."
  value       = var.create_role ? aws_iam_role.this[0].arn : null
}

output "iam_role_name" {
  description = "The name of the IAM role."
  value       = var.create_role ? aws_iam_role.this[0].name : null
}

output "iam_role_unique_id" {
  description = "The unique ID of the IAM role."
  value       = var.create_role ? aws_iam_role.this[0].unique_id : null
}