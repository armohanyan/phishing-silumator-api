import { Controller, Param, Post } from '@nestjs/common';
import { PhishingService } from './phishing.service';

@Controller('phishing')
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}
}
