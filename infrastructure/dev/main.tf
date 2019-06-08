terraform {
  backend "s3" {
    bucket  = "passplum-tf"
    key     = "dev/web.tf"
    profile = "passplum"
    region  = "us-west-1"
  }
}

provider "aws" {
  profile = "passplum"
  region  = "us-west-1"
  version = "~> 2.7"
}

module "dynamodb_tables" {
  source = "../_modules/dynamodb_tables"

  environment = "development"
  capacity    = 1
}
