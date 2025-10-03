# main.tf in modules/eks
# Defines the AWS EKS cluster, node groups, and associated resources.
# REQ-1-077: The deployed Docker containers shall be managed and orchestrated in production using the AWS Elastic Kubernetes Service (EKS).
# REQ-1-085: The architecture must eliminate single points of failure... running at least two instances of each microservice across different availability zones.
# REQ-1-052: The system architecture must be designed to be stateless and horizontally scalable.

locals {
  cluster_name = var.cluster_name
  tags         = var.tags
}

################################################################################
# EKS Cluster
################################################################################

resource "aws_eks_cluster" "this" {
  name     = local.cluster_name
  role_arn = var.eks_cluster_role_arn
  version  = var.cluster_version

  vpc_config {
    subnet_ids              = var.private_subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = var.enable_public_endpoint
    public_access_cidrs     = var.public_access_cidrs
  }

  kubernetes_network_config {
    service_ipv4_cidr = var.cluster_service_ipv4_cidr
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  tags = merge(
    local.tags,
    {
      "Name" = local.cluster_name
    }
  )

  depends_on = [
    var.iam_dependency
  ]
}

################################################################################
# EKS OpenID Connect (OIDC) Provider for IRSA
################################################################################

data "tls_certificate" "this" {
  url = aws_eks_cluster.this.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "this" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.this.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.this.identity[0].oidc[0].issuer

  tags = merge(
    local.tags,
    {
      "Name" = "${local.cluster_name}-oidc-provider"
    }
  )
}

################################################################################
# EKS Node Groups
################################################################################

resource "aws_eks_node_group" "this" {
  for_each = var.node_groups

  cluster_name    = aws_eks_cluster.this.name
  node_group_name = each.key
  node_role_arn   = var.eks_node_group_role_arn
  subnet_ids      = var.private_subnet_ids # Spanning multiple AZs for HA (REQ-1-085)

  ami_type       = each.value.ami_type
  capacity_type  = each.value.capacity_type
  disk_size      = each.value.disk_size
  instance_types = each.value.instance_types

  scaling_config {
    desired_size = each.value.desired_size
    max_size     = each.value.max_size
    min_size     = each.value.min_size
  }

  update_config {
    max_unavailable = 1
  }

  labels = merge(
    {
      "nodegroup-name" = each.key
    },
    each.value.labels
  )

  tags = merge(
    local.tags,
    {
      "Name"                               = "${local.cluster_name}-${each.key}-node"
      "k8s.io/cluster-autoscaler/enabled"  = "true"
      "k8s.io/cluster-autoscaler/${local.cluster_name}" = "owned"
    }
  )

  depends_on = [
    aws_iam_role_policy_attachment.amazon_eks_worker_node_policy,
    aws_iam_role_policy_attachment.amazon_eks_cni_policy,
    aws_iam_role_policy_attachment.amazon_ec2_container_registry_read_only,
    var.iam_dependency
  ]
}

# These are defined in the IAM module but the attachments are managed here to ensure
# the node role is fully configured before node groups are created.
resource "aws_iam_role_policy_attachment" "amazon_eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = var.eks_node_group_role_name
}

resource "aws_iam_role_policy_attachment" "amazon_eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = var.eks_node_group_role_name
}

resource "aws_iam_role_policy_attachment" "amazon_ec2_container_registry_read_only" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = var.eks_node_group_role_name
}


################################################################################
# EKS Add-ons
################################################################################

resource "aws_eks_addon" "coredns" {
  cluster_name = aws_eks_cluster.this.name
  addon_name   = "coredns"
  addon_version = var.coredns_addon_version
  resolve_conflicts = "OVERWRITE"
  tags = merge(
    local.tags,
    {
      "Name" = "${local.cluster_name}-coredns"
    }
  )
}

resource "aws_eks_addon" "kube_proxy" {
  cluster_name = aws_eks_cluster.this.name
  addon_name   = "kube-proxy"
  addon_version = var.kube_proxy_addon_version
  resolve_conflicts = "OVERWRITE"
  tags = merge(
    local.tags,
    {
      "Name" = "${local.cluster_name}-kube-proxy"
    }
  )
}

resource "aws_eks_addon" "vpc_cni" {
  cluster_name = aws_eks_cluster.this.name
  addon_name   = "vpc-cni"
  addon_version = var.vpc_cni_addon_version
  resolve_conflicts = "OVERWRITE"
  tags = merge(
    local.tags,
    {
      "Name" = "${local.cluster_name}-vpc-cni"
    }
  )
}

################################################################################
# Cluster Security Group
################################################################################

resource "aws_security_group" "cluster_sg" {
  name        = "${local.cluster_name}-cluster-sg"
  description = "Security group for the EKS cluster control plane"
  vpc_id      = var.vpc_id

  tags = merge(
    local.tags,
    {
      "Name" = "${local.cluster_name}-cluster-sg"
    }
  )
}