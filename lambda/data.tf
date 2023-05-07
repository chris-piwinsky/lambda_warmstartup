data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "./files"
  output_path = "lambda_function.zip"
}
