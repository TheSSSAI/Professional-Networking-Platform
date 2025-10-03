# outputs.tf in modules/vpc
# This file defines the outputs of the VPC module. These outputs are the public
# contract of the module, exposing necessary resource IDs and attributes for
# other modules (like EKS, RDS) to consume.

output "vpc_id" {
  description = "The ID of the VPC."
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC."
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "List of IDs of public subnets."
  value       = [for s in aws_subnet.public : s.id]
}

output "private_subnet_ids" {
  description = "List of IDs of private subnets."
  value       = [for s in aws_subnet.private : s.id]
}

output "availability_zones" {
  description = "List of availability zones used for the subnets."
  value       = slice(var.availability_zones, 0, var.max_availability_zones)
}

output "nat_gateway_public_ips" {
  description = "List of public Elastic IP addresses for the NAT gateways."
  value       = [for eip in aws_eip.nat : eip.public_ip]
}

output "default_security_group_id" {
  description = "The ID of the default security group."
  value       = aws_security_group.default.id
}