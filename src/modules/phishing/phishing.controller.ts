import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SendPhishingDto } from './dto/send-phishing.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { PhishingDto } from './dto/output.phishing.dto';

@ApiTags('Phishing')
@Controller('phishing')
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}

  /**
   * Sends a phishing email to a specified address.
   * @param sendPhishingDto Contains the email address to send the phishing email to.
   */
  @Post('send')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send a phishing email to a specified address' })
  @HttpCode(200)
  async sendEmailToTarget(
    @Body() sendPhishingDto: SendPhishingDto,
  ): Promise<PhishingDto> {
    const response = await this.phishingService.sendEmailToTarget(
      sendPhishingDto.email,
    );

    return new PhishingDto(response);
  }

  /**
   * Marks a phishing email attempt as clicked.
   * @param email Email address associated with the phishing attempt.
   */
  @Get('on-trigger')
  @ApiOperation({ summary: 'Mark a phishing attempt as clicked' })
  @ApiQuery({
    name: 'email',
    type: String,
    description: 'Email address to mark as clicked',
  })
  async markClick(
    @Query('email') email: string,
  ): Promise<{ success: boolean }> {
    await this.phishingService.markAttemptAsClicked(email);

    return { success: true };
  }

  /**
   * Retrieves all phishing attempts.
   */
  @Get('attempts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all phishing attempts' })
  async getAllAttempts(): Promise<PhishingDto[]> {
    const attempts = await this.phishingService.getAllAttempts();

    return attempts.map((attempt) => new PhishingDto(attempt));
  }
}
