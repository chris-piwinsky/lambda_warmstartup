# Warm Start

Purpose of this project is to use Warm Start up to retrieve a value from lambda cache.  However, for cold start up we want to pull the values from S3, or the originating URL.

Also, want to setup an invalidation of local cache.

I use a data lookup to recreate the lambda_function.zip file so any code change will be picked up when deployed

## Pre-Regs

1. [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) installed on machine
2. AWS account
3. [AWS IAM User](https://repost.aws/knowledge-center/create-access-key)

## Steps to Run

1. Download code
2. in Terminal run:
    - terraform init
    - terraform apply
