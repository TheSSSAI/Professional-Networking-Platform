# main.tf in modules/monitoring
# This module provisions foundational monitoring infrastructure in AWS,
# specifically an AWS Managed Prometheus (AMP) workspace, as required by REQ-1-083.
# It also sets up the necessary IAM roles for EKS integration.

# Provision an AWS Managed Prometheus workspace.
resource "aws_prometheus_workspace" "this" {
  alias = "${var.project_name}-${var.environment}"

  logging_configuration {
    log_group_arn = aws_cloudwatch_log_group.prometheus.arn
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-prometheus"
  })
}

# CloudWatch Log Group for Prometheus workspace logging.
resource "aws_cloudwatch_log_group" "prometheus" {
  name = "/aws/prometheus/${var.project_name}-${var.environment}"

  retention_in_days = var.log_retention_days

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-prometheus-logs"
  })
}

# --- IAM Role for Service Account (IRSA) for Prometheus Server ---
# This section creates the IAM role that the Prometheus server pod in EKS
# will assume to get permissions to write metrics to the AMP workspace.

data "aws_iam_policy_document" "prometheus_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [var.eks_oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "${replace(var.eks_oidc_provider_arn, "oidc-provider/", "oidc-provider")}:sub"
      values   = ["system:serviceaccount:${var.prometheus_k8s_namespace}:${var.prometheus_k8s_service_account_name}"]
    }
  }
}

resource "aws_iam_role" "prometheus_server" {
  name_prefix        = "${var.project_name}-${var.environment}-prom"
  assume_role_policy = data.aws_iam_policy_document.prometheus_assume_role_policy.json

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-prometheus-server-role"
  })
}

# This IAM policy grants the necessary permissions for remote writing, scraping, and querying AMP.
resource "aws_iam_policy" "prometheus_access" {
  name_prefix = "${var.project_name}-${var.environment}-prom-access"
  description = "IAM policy for services to access the AMP workspace"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "aps:RemoteWrite",
          "aps:QueryMetrics",
          "aps:GetSeries",
          "aps:GetLabels",
          "aps:GetMetricMetadata"
        ]
        Resource = aws_prometheus_workspace.this.arn
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "prometheus_server_access" {
  role       = aws_iam_role.prometheus_server.name
  policy_arn = aws_iam_policy.prometheus_access.arn
}