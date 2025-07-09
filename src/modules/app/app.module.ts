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
import { GatewayModule } from '../gateway/gateway.module';
import { ChatsModule } from '../chats/chats.module';
import { Chat } from '../chats/models/chat.model';
import { ChatUser } from '../chats/models/chatUser.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('dbHost'),
        port: configService.get('dbPort'),
        username: configService.get('dbUser'),
        password: configService.get('dbPassword'),
        database: configService.get('dbName'),
        synchronize: true,
        //sync: { force: true },
        autoLoadModels: true,
        models: [User, Match, Chat, ChatUser],
      }),
    }),
    UserModule,
    AuthModule,
    TokenModule,
    MatchesModule,
    GatewayModule,
    ChatsModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
