# main.tf in modules/rds
# Defines the AWS RDS PostgreSQL instance, security groups, and secret management.
# REQ-1-068: The primary database for storing relational data shall be PostgreSQL, hosted on the AWS Relational Database Service (RDS).
# REQ-1-085: High availability... configuring the AWS RDS database in a Multi-AZ deployment.
# REQ-1-079: ...daily full snapshots and continuous transaction log archiving to enable Point-In-Time Recovery (PITR).
# REQ-1-082: ...retention period of 30 days.
# REQ-1-080: ...backups must be configured to be copied to a secure S3 bucket in a secondary AWS region for disaster recovery purposes.

locals {
  db_name = "${var.project_name}-${var.environment}-db"
  tags    = var.tags
}

################################################################################
# Networking
################################################################################

resource "aws_db_subnet_group" "this" {
  name       = "${local.db_name}-sng"
  subnet_ids = var.private_subnet_ids

  tags = merge(
    local.tags,
    {
      "Name" = "${local.db_name}-sng"
    }
  )
}

resource "aws_security_group" "this" {
  name        = "${local.db_name}-sg"
  description = "Security group for the RDS PostgreSQL instance"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow PostgreSQL traffic from the application"
    from_port       = 5432
    to_port         = 5432
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
      "Name" = "${local.db_name}-sg"
    }
  )
}

################################################################################
# Password Management (AWS Secrets Manager)
################################################################################

resource "random_password" "master_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "this" {
  name = "${local.db_name}-master-password"
  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "this" {
  secret_id     = aws_secretsmanager_secret.this.id
  secret_string = random_password.master_password.result
}

################################################################################
# RDS Instance
################################################################################

resource "aws_db_instance" "this" {
  identifier = local.db_name

  # Engine
  engine               = "postgres"
  engine_version       = var.db_engine_version
  instance_class       = var.db_instance_class
  allocated_storage    = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage

  # Credentials
  db_name   = var.db_name
  username  = var.db_username
  password  = random_password.master_password.result
  port      = 5432

  # Networking
  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.this.id]
  publicly_accessible    = false

  # High Availability (REQ-1-085)
  multi_az = var.multi_az_deployment

  # Backup and DR (REQ-1-079, REQ-1-080, REQ-1-082)
  backup_retention_period = var.backup_retention_days # Enables PITR, set to >= 30
  copy_tags_to_snapshot   = true
  delete_automated_backups = var.environment != "prod" # Keep backups for prod even if DB is deleted
  final_snapshot_identifier = var.environment == "prod" ? "${local.db_name}-final-snapshot" : null
  skip_final_snapshot     = var.environment != "prod"

  # Encryption
  storage_encrypted = true
  kms_key_id        = var.db_kms_key_id

  # Maintenance & Monitoring
  auto_minor_version_upgrade = true
  apply_immediately          = var.db_apply_immediately
  maintenance_window         = "sat:03:00-sat:04:00"
  backup_window              = "01:00-02:00"
  monitoring_interval        = 60
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  # Deletion Protection
  deletion_protection = var.environment == "prod"

  tags = merge(
    local.tags,
    {
      "Name" = local.db_name
    }
  )

  lifecycle {
    # The master password is managed by Secrets Manager.
    # Ignore changes to the password attribute to prevent Terraform from
    # overwriting manual password rotations in the console/API.
    ignore_changes = [password]
  }
}

# REQ-1-080: ...backups must be configured to be copied to a secondary AWS region for disaster recovery purposes.
# This can be configured in the AWS Backup service, or for simpler cases,
# a resource like `aws_db_instance_automated_backups_replication` can be used.
# Here we add the resource to demonstrate the capability.

resource "aws_db_instance_automated_backups_replication" "this" {
  count = var.enable_cross_region_backups ? 1 : 0

  source_db_instance_arn = aws_db_instance.this.arn
  kms_key_id             = var.dr_backup_kms_key_id # KMS key in the destination region
  # pre_signed_url - can be used if copying to a region that is not enabled by default
  # retention_period - can be set to override the source retention period
}