# main.tf in modules/vpc
# This module is responsible for provisioning the foundational networking infrastructure.
# It creates a VPC, public and private subnets across multiple availability zones,
# an Internet Gateway for public traffic, and NAT Gateways for outbound traffic
# from private subnets, ensuring high availability and security.

resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(
    var.common_tags,
    {
      Name = "${var.project_name}-${var.environment}-vpc"
    }
  )
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    var.common_tags,
    {
      Name = "${var.project_name}-${var.environment}-igw"
    }
  )
}

resource "aws_subnet" "public" {
  for_each = toset(slice(var.availability_zones, 0, var.max_availability_zones))

  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, index(var.availability_zones, each.value))
  availability_zone       = each.value
  map_public_ip_on_launch = true

  tags = merge(
    var.common_tags,
    {
      Name                                = "${var.project_name}-${var.environment}-public-subnet-${each.value}"
      "kubernetes.io/role/elb"            = "1"
      "kubernetes.io/cluster/${var.project_name}-${var.environment}" = "shared"
    }
  )
}

resource "aws_eip" "nat" {
  for_each = toset(slice(var.availability_zones, 0, var.max_availability_zones))

  domain = "vpc"

  tags = merge(
    var.common_tags,
    {
      Name = "${var.project_name}-${var.environment}-nat-eip-${each.value}"
    }
  )
  depends_on = [aws_internet_gateway.main]
}

resource "aws_nat_gateway" "main" {
  for_each = toset(slice(var.availability_zones, 0, var.max_availability_zones))

  allocation_id = aws_eip.nat[each.value].id
  subnet_id     = aws_subnet.public[each.value].id

  tags = merge(
    var.common_tags,
    {
      Name = "${var.project_name}-${var.environment}-nat-gw-${each.value}"
    }
  )
  depends_on = [aws_internet_gateway.main]
}

resource "aws_subnet" "private" {
  for_each = toset(slice(var.availability_zones, 0, var.max_availability_zones))

  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, index(var.availability_zones, each.value) + var.max_availability_zones)
  availability_zone       = each.value
  map_public_ip_on_launch = false

  tags = merge(
    var.common_tags,
    {
      Name                                = "${var.project_name}-${var.environment}-private-subnet-${each.value}"
      "kubernetes.io/role/internal-elb"   = "1"
      "kubernetes.io/cluster/${var.project_name}-${var.environment}" = "shared"
    }
  )
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(
    var.common_tags,
    {
      Name = "${var.project_name}-${var.environment}-public-rt"
    }
  )
}

resource "aws_route_table_association" "public" {
  for_each = aws_subnet.public

  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  for_each = toset(slice(var.availability_zones, 0, var.max_availability_zones))

  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[each.value].id
  }

  tags = merge(
    var.common_tags,
    {
      Name = "${var.project_name}-${var.environment}-private-rt-${each.value}"
    }
  )
}

resource "aws_route_table_association" "private" {
  for_each = aws_subnet.private

  subnet_id      = each.value.id
  route_table_id = aws_route_table.private[each.value.availability_zone].id
}

# Default security group to allow all outbound traffic
resource "aws_security_group" "default" {
  name        = "${var.project_name}-${var.environment}-default-sg"
  description = "Default security group to allow all outbound traffic"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.common_tags,
    {
      Name = "${var.project_name}-${var.environment}-default-sg"
    }
  )
}