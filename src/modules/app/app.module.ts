/*
 * FILE: src/modules/app/app.module.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import configs from '../../configs';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';
import { MatchesModule } from '../matches/matches.module';
import { SocketsModule } from '../sockets/sockets.module';
import { ChatsModule } from '../chats/chats.module';
import { MessagesModule } from '../messages/messages.module';
import { HobbiesModule } from '../hobbies/hobbies.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'static'),
      serveRoot: '/static',
      serveStaticOptions: { index: false },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('db.host'),
        port: configService.get('db.port'),
        username: configService.get('db.user'),
        password: configService.get('db.password'),
        database: configService.get('db.name'),
        synchronize: true, //after development, use migrations instead of sync / on dev - true to auto create tables based on models, on prod - false to avoid data loss
        // sync: { force: true }, //force: true - drop tables and recreate them on every app restart (use only for development)
        autoLoadModels: true,
        retry: {
          match: [
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /Connection timed out/
          ],
          max: 5, 
          backoffBase: 2000, 
          backoffExponent: 1.5, 
        },
      }),
    }),
    UserModule,
    AuthModule,
    TokenModule,
    MatchesModule,
    SocketsModule,
    ChatsModule,
    MessagesModule,
    HobbiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// NestJS class implementing AppModule.
export class AppModule {}
