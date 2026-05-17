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
        synchronize: process.env.NODE_ENV !== 'production',
        // sync: { force: true },
        autoLoadModels: true,
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
export class AppModule {}
