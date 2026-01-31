import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { SquadsModule } from './squads/squads.module';
import { MarinesModule } from './marines/marines.module';
import { BattlesModule } from './battles/battles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    UsersModule,
    SquadsModule,
    MarinesModule,
    BattlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
