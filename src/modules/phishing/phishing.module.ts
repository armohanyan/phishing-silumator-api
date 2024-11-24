import { Module } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { PhishingController } from './phishing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';
import {
  Phishing,
  PhishingSchema,
} from '../../schemas/phishing/phishing.schema';

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([
      { name: Phishing.name, schema: PhishingSchema },
    ]),
  ],
  providers: [PhishingService],
  controllers: [PhishingController],
})
export class PhishingModule {}
