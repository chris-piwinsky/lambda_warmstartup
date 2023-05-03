resource "aws_lambda_layer_version" "lambda_layer" {
  filename   = "lambda_layer.zip"
  layer_name = "axios_layer"

  compatible_runtimes = ["nodejs16.x"]
}