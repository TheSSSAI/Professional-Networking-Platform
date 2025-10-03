# ------------------------------------------------------------------------------
# TERRAFORM BACKEND & PROVIDER CONFIGURATION
# ------------------------------------------------------------------------------

terraform {
  backend "s3" {
    key    = "prod/platform.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = "prod"
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

provider "cloudflare" {
  # The API token is passed as an environment variable (CLOUDFLARE_API_TOKEN) in the CI/CD pipeline.
}

# ------------------------------------------------------------------------------
# DATA SOURCES
# ------------------------------------------------------------------------------

data "aws_availability_zones" "available" {
  state = "available"
}

# ------------------------------------------------------------------------------
# CORE INFRASTRUCTURE MODULES (VPC, IAM, S3)
# ------------------------------------------------------------------------------

module "vpc" {
  source = "../../modules/vpc"

  name               = "${var.project_name}-vpc-prod"
  cidr_block         = var.vpc_cidr_block
  availability_zones = slice(data.aws_availability_zones.available.names, 0, 3) # Production uses 3 AZs for max availability
  project_name       = var.project_name
  environment        = "prod"
}

module "s3_media_bucket" {
  source = "../../modules/s3_bucket"

  bucket_name = "${var.project_name}-media-prod"
  versioning  = true
  public_read = false # Production bucket access must be restricted to Cloudflare only
  tags = {
    Purpose = "User-uploaded media content"
  }
  # Additional configuration for Cloudflare access would be added here
}

module "iam" {
  source = "../../modules/iam"

  project_name = var.project_name
  environment  = "prod"
}

# ------------------------------------------------------------------------------
# EKS CLUSTER MODULE
# ------------------------------------------------------------------------------

module "eks" {
  source = "../../modules/eks"

  cluster_name           = "${var.project_name}-cluster-prod"
  cluster_version        = var.eks_cluster_version
  vpc_id                 = module.vpc.vpc_id
  private_subnet_ids     = module.vpc.private_subnet_ids
  project_name           = var.project_name
  environment            = "prod"
  iam_role_arn_eks_cluster = module.iam.eks_cluster_role_arn

  node_groups = var.eks_node_groups
}

# ------------------------------------------------------------------------------
# DATA STORE MODULES (RDS, ELASTICACHE, OPENSEARCH)
# ------------------------------------------------------------------------------

module "rds" {
  source = "../../modules/rds"

  name                   = "${var.project_name}-db-prod"
  engine_version         = var.rds_engine_version
  instance_class         = var.rds_instance_class
  allocated_storage      = var.rds_allocated_storage
  multi_az               = var.rds_multi_az
  backup_retention_period = var.rds_backup_retention_period
  vpc_id                 = module.vpc.vpc_id
  db_subnet_group_name   = module.vpc.db_subnet_group_name
  vpc_security_group_ids = [module.vpc.db_security_group_id]
  project_name           = var.project_name
  environment            = "prod"

  # Allow connections from the EKS nodes
  source_security_group_id = module.eks.node_security_group_id
}

module "elasticache" {
  source = "../../modules/elasticache"

  name                     = "${var.project_name}-redis-prod"
  node_type                = var.redis_node_type
  num_cache_nodes          = var.redis_num_cache_nodes
  engine_version           = var.redis_engine_version
  parameter_group_name     = "default.redis7" # Production should use a custom PG
  subnet_ids               = module.vpc.private_subnet_ids
  vpc_id                   = module.vpc.vpc_id
  project_name             = var.project_name
  environment              = "prod"

  # Allow connections from the EKS nodes
  source_security_group_id = module.eks.node_security_group_id
}

module "opensearch" {
  source = "../../modules/opensearch"

  domain_name    = "${var.project_name}-search-prod"
  engine_version = var.opensearch_engine_version
  instance_type  = var.opensearch_instance_type
  instance_count = var.opensearch_instance_count
  ebs_volume_size = var.opensearch_ebs_volume_size
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  aws_account_id  = var.aws_account_id
  project_name    = var.project_name
  environment     = "prod"

  # Allow access from EKS nodes
  source_security_group_id = module.eks.node_security_group_id
}


# ------------------------------------------------------------------------------
# EXTERNAL SERVICES MODULES (SES, CLOUDFLARE, MONITORING)
# ------------------------------------------------------------------------------

module "ses" {
  source = "../../modules/ses"

  domain_name = var.ses_domain_name
}

module "cloudflare" {
  source = "../../modules/cloudflare"

  zone_id          = var.cloudflare_zone_id
  domain_name      = var.cloudflare_domain_name
  media_bucket_name = module.s3_media_bucket.bucket_domain_name
  app_load_balancer_dns = "prod-placeholder-alb.us-east-1.elb.amazonaws.com" # This would be an output from an ALB
}

module "monitoring" {
  source = "../../modules/monitoring"
  
  project_name = var.project_name
  environment  = "prod"
}