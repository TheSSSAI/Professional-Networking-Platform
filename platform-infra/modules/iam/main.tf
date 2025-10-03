# main.tf in modules/iam
# This module provides a reusable component for creating IAM roles and attaching policies.
# It is designed to be flexible, supporting various use cases like creating roles for
# EKS Service Accounts (IRSA) with OIDC trust policies, or standard EC2 instance roles.

resource "aws_iam_role" "this" {
  count = var.create_role ? 1 : 0

  name               = var.role_name
  path               = var.role_path
  assume_role_policy = var.role_policy_document

  tags = merge(
    var.common_tags,
    {
      Name = var.role_name
    }
  )
}

resource "aws_iam_policy" "this" {
  for_each = var.create_policy ? var.inline_policies : {}

  name        = "${var.role_name}-${each.key}"
  path        = var.role_path
  description = "Inline policy for ${var.role_name}: ${each.key}"
  policy      = each.value
}

resource "aws_iam_role_policy_attachment" "custom_inline" {
  for_each = var.create_policy ? var.inline_policies : {}

  role       = aws_iam_role.this[0].name
  policy_arn = aws_iam_policy.this[each.key].arn

  depends_on = [aws_iam_role.this]
}

resource "aws_iam_role_policy_attachment" "managed" {
  for_each = toset(var.managed_policy_arns)

  role       = aws_iam_role.this[0].name
  policy_arn = each.value

  depends_on = [aws_iam_role.this]
}