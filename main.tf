provider "aws" {
  region = "us-east-1"
}

# Criar o bucket S3
resource "aws_s3_bucket" "postech-auth-zip" {
  bucket = "postech-auth-zip" 

  # Configurações adicionais, se necessário
  acl    = "private"  # Define as permissões de acesso do bucket. Por padrão, é "private".
}

# Criar e fazer upload de um arquivo para o bucket S3
resource "aws_s3_bucket_object" "zip" {
  bucket = aws_s3_bucket.postech-auth-zip.id  
  key    = "main.zip"  # Nome do arquivo dentro do bucket
  source = "./.serverless/main.zip"    # Substitua pelo caminho local do seu arquivo

  # Configurações adicionais, se necessário
  acl    = "private"  # Define as permissões de acesso do objeto. Por padrão, é "private".
}

resource "aws_lambda_function" "postech-auth-app" {
  function_name    = "postech-auth-app"
  role             = "arn:aws:iam::058264149904:role/LabRole"  # Substitua pelo ARN da sua função IAM
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  
  # Use a propriedade `s3_bucket` e `s3_key` para fazer referência ao arquivo ZIP no S3
  s3_bucket        = aws_s3_bucket.postech-auth-zip.bucket
  s3_key           = aws_s3_bucket_object.zip.key
  
}

# Recurso para definir a permissão da função Lambda para acessar outros serviços, se necessário
resource "aws_lambda_permission" "postech-auth-app_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.postech-auth-app.function_name
  principal     = "apigateway.amazonaws.com"
}