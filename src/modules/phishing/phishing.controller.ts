import { Controller, Param, Post } from '@nestjs/common';
import { PhishingService } from './phishing.service';

@Controller({
  path: 'phishing',
  version: '1',
})
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}

  @Post('/send')
  getAccount(@Param('id') id: string) {
    // todo
  }
}
