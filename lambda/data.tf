data "archive_file" "lambda" {
  type        = "zip"
  source_file = "./files/index.js"
  output_path = "lambda_function.zip"
}
