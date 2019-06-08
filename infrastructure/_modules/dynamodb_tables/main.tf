variable "environment" {}

variable "capacity" {
  description = "read and write capacity for table"
}

resource "aws_dynamodb_table" "words" {
  name           = "passplum_words_${var.environment}"
  read_capacity  = "${var.capacity}"
  write_capacity = "${var.capacity}"
  hash_key       = "word"

  attribute {
    name = "word"
    type = "S"
  }

  tags = {
    Terraform   = true
    Environment = "${var.environment}"
  }
}

resource "aws_dynamodb_table" "used_hashes" {
  name           = "passplum_used_hashes_${var.environment}"
  read_capacity  = "${var.capacity}"
  write_capacity = "${var.capacity}"
  hash_key       = "phrase_hash"

  attribute {
    name = "phrase_hash"
    type = "S"
  }

  tags = {
    Terraform   = true
    Environment = "${var.environment}"
  }
}

resource "aws_dynamodb_table" "vocab" {
  name           = "passplum_vocab_${var.environment}"
  read_capacity  = "${var.capacity}"
  write_capacity = "${var.capacity}"
  hash_key       = "vocab_id"

  attribute {
    name = "vocab_id"
    type = "S"
  }

  tags = {
    Terraform   = true
    Environment = "${var.environment}"
  }
}
