# main.tf in modules/opensearch
# Defines the AWS OpenSearch domain.
# REQ-1-069: A managed AWS OpenSearch service shall be used as the dedicated search engine for the platform.
# REQ-1-031: The user search functionality must be implemented using a dedicated search engine, specifically a managed OpenSearch service.

locals {
  domain_name = "${var.project_name}-${var.environment}-search"
  tags        = var.tags
}

resource "aws_security_group" "this" {
  name        = "${local.domain_name}-sg"
  description = "Security group for the OpenSearch domain"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow OpenSearch traffic from the application"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [var.app_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    local.tags,
    {
      "Name" = "${local.domain_name}-sg"
    }
  )
}

resource "aws_opensearch_domain" "this" {
  domain_name    = local.domain_name
  engine_version = var.engine_version

  cluster_config {
    instance_type          = var.instance_type
    instance_count         = var.instance_count
    dedicated_master_enabled = var.dedicated_master_enabled
    dedicated_master_type  = var.dedicated_master_enabled ? var.dedicated_master_type : null
    dedicated_master_count = var.dedicated_master_enabled ? var.dedicated_master_count : null
    zone_awareness_enabled = true
    zone_awareness_config {
      availability_zone_count = var.availability_zone_count
    }
  }

  vpc_options {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [aws_security_group.this.id]
  }

  ebs_options {
    ebs_enabled = true
    volume_size = var.ebs_volume_size
    volume_type = "gp3"
  }

  encrypt_at_rest {
    enabled    = true
    kms_key_id = var.kms_key_id
  }

  node_to_node_encryption {
    enabled = true
  }

  domain_endpoint_options {
    enforce_https = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
  }

  advanced_options = {
    "rest.action.multi.allow_explicit_index" = "true"
  }

  access_policies = data.aws_iam_policy_document.access_policy.json

  tags = merge(
    local.tags,
    {
      "Name" = local.domain_name
    }
  )

  # Wait for the IAM role to be created before creating the domain that references it
  depends_on = [var.iam_dependency]
}

data "aws_iam_policy_document" "access_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "es:ESHttp*",
    ]

    resources = [
      "arn:aws:es:${var.aws_region}:${var.aws_account_id}:domain/${local.domain_name}/*"
    ]

    # Restrict access to specific IAM roles (e.g., the EKS node role)
    condition {
      test     = "ArnEquals"
      variable = "aws:PrincipalArn"
      values   = var.opensearch_access_role_arns
    }
  }
}