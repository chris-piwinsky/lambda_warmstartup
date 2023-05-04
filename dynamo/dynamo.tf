resource "aws_dynamodb_table" "example" {
  name         = "cache-table"
  billing_mode = "PROVISIONED"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "N"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}
