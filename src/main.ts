import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WebSocketAuthAdapter } from './modules/sockets/socketAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const webSocketAuthAdapter = new WebSocketAuthAdapter(app);
  app.useWebSocketAdapter(webSocketAuthAdapter);

  // swagger
  const docConfig = new DocumentBuilder()
    .setTitle('Dating App API')
    .setDescription('API for Dating App (pet project of ATOM9IX9 github user)')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
}

bootstrap();
