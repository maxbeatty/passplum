terraform {
  backend "s3" {
    bucket  = "passplum-tf"
    key     = "prod/web.tf"
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

  environment = "production"
  capacity    = 5
}

resource "aws_iam_user" "web" {
  name = "passplum_web"
}

data "aws_iam_policy_document" "web" {
  statement {
    effect = "Allow"

    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
    ]

    resources = ["*"]
  }
}

resource "aws_iam_user_policy" "web" {
  name   = "web"
  user   = "${aws_iam_user.web.name}"
  policy = "${data.aws_iam_policy_document.web.json}"
}

resource "aws_iam_access_key" "web" {
  user    = "${aws_iam_user.web.name}"
  pgp_key = "keybase:maxbeatty"
}

output "key" {
  value = "${aws_iam_access_key.web.id}"
}

output "secret" {
  value = "${aws_iam_access_key.web.encrypted_secret}"
}
