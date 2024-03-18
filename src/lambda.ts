// lambda.js
import awsServerlessExpress from 'aws-serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

let cachedServer;

async function bootstrapServer() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  return awsServerlessExpress.createServer(app.getHttpAdapter().getInstance());
}

exports.handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }

  return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE')
    .promise;
};
