provider "aws" {
  region = "us-east-1"
}

resource "aws_lambda_function" "postech-auth-app" {
  function_name = "postech-auth-app"
  role          = "arn:aws:iam::058264149904:role/LabRole"  # Substitua pelo ARN da sua função IAM
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  filename      = "./.serverless/main.zip"  # Substitua pelo caminho do seu arquivo ZIP
}

# Recurso para definir a permissão da função Lambda para acessar outros serviços, se necessário
resource "aws_lambda_permission" "postech-auth-app_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.postech-auth-app.function_name
  principal     = "apigateway.amazonaws.com"
}