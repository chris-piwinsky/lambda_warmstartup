module "dynamo" {
  source = "./dynamo"
}

module "warm_start_lambda" {
  source = "./lambda"
}