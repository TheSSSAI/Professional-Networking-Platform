# main.tf in modules/elasticache
# Defines the AWS ElastiCache for Redis cluster.
# REQ-1-070: A managed Redis service, hosted on AWS ElastiCache, shall be implemented as a general-purpose caching layer.

locals {
  cluster_name = "${var.project_name}-${var.environment}-redis"
  tags         = var.tags
}

################################################################################
# Networking
################################################################################

resource "aws_elasticache_subnet_group" "this" {
  name       = "${local.cluster_name}-sng"
  subnet_ids = var.private_subnet_ids

  tags = merge(
    local.tags,
    {
      "Name" = "${local.cluster_name}-sng"
    }
  )
}

resource "aws_security_group" "this" {
  name        = "${local.cluster_name}-sg"
  description = "Security group for the ElastiCache Redis cluster"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow Redis traffic from the application"
    from_port       = 6379
    to_port         = 6379
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
      "Name" = "${local.cluster_name}-sg"
    }
  )
}

################################################################################
# ElastiCache Parameter Group
################################################################################

resource "aws_elasticache_parameter_group" "this" {
  name   = "${local.cluster_name}-pg"
  family = "redis${var.redis_version}"

  parameter {
    name  = "cluster-enabled"
    value = "yes"
  }
}

################################################################################
# ElastiCache Replication Group (Redis Cluster)
################################################################################

resource "aws_elasticache_replication_group" "this" {
  replication_group_id          = local.cluster_name
  description                   = "Redis cluster for the platform"
  node_type                     = var.node_type
  port                          = 6379
  engine                        = "redis"
  engine_version                = var.redis_version
  parameter_group_name          = aws_elasticache_parameter_group.this.name
  subnet_group_name             = aws_elasticache_subnet_group.this.name
  security_group_ids            = [aws_security_group.this.id]

  # High Availability (REQ-1-085 implied)
  automatic_failover_enabled    = var.enable_automatic_failover
  multi_az_enabled              = var.enable_automatic_failover

  # Clustering
  num_node_groups               = var.num_node_groups
  replicas_per_node_group       = var.replicas_per_node_group

  # Encryption
  transit_encryption_enabled    = true
  at_rest_encryption_enabled    = true
  kms_key_id                    = var.kms_key_id

  # Maintenance & Backup
  maintenance_window            = "sun:04:00-sun:05:00"
  snapshot_window               = "03:00-04:00"
  snapshot_retention_limit      = var.snapshot_retention_limit
  auto_minor_version_upgrade    = true
  apply_immediately             = var.apply_immediately

  tags = merge(
    local.tags,
    {
      "Name" = local.cluster_name
    }
  )
}