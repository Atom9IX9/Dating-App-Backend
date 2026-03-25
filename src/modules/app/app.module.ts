import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import configs from '../../configs';
import { User } from '../users/models/user.model';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';
import { MatchesModule } from '../matches/matches.module';
import { Match } from '../matches/models/match.model';
import { SocketsModule } from '../sockets/sockets.module';
import { ChatsModule } from '../chats/chats.module';
import { Chat } from '../chats/models/chat.model';
import { ChatUser } from '../chats/models/chatUser.model';
import { JwtModule } from '@nestjs/jwt';
import { MessagesModule } from '../messages/messages.module';
import { Message } from '../messages/models/message.model';
import { UserActivity } from '../usersActivity/models/userActivity.model';
import { Auth } from '../auth/model/auth.model';
import { RefreshToken } from '../auth/model/refreshToken.model';

@Module({
  imports: [
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
        models: [
          User,
          Match,
          Chat,
          ChatUser,
          Message,
          UserActivity,
          Auth,
          RefreshToken,
        ],
      }),
    }),
    UserModule,
    AuthModule,
    TokenModule,
    MatchesModule,
    SocketsModule,
    ChatsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
