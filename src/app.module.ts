import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './modules/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { configApp } from './common/config';
import { AuthModule } from './modules/auth/auth.module';
import { PhishingModule } from './modules/phishing/phishing.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PhishingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configApp],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('app.databaseUrl'),
      }),
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
