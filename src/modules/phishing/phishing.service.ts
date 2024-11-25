import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Phishing } from '../../schemas/phishing/phishing.schema';
import * as process from 'node:process';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PhishingService {
  constructor(
    @InjectModel(Phishing.name)
    private readonly phishingSchema: Model<Phishing>,
    private readonly mailService: MailService,
  ) {}

  /**
   * Sends a phishing email to the specified address and saves the attempt.
   * @param email The recipient's email address.
   * @throws BadRequestException if a phishing email has already been sent to the address.
   */
  async sendEmailToTarget(email: string): Promise<Phishing> {
    const alreadyAttempted = await this.phishingSchema
      .findOne({ email })
      .exec();

    if (alreadyAttempted) {
      throw new BadRequestException(
        'Phishing email already sent to this address.',
      );
    }

    const url = `${process.env.APP_URL}/phishing/on-trigger?email=${email}`;
    const content = `<p>This is a simulated phishing attempt. Click <a href="${url}">here</a> to check the result.</p>`;

    await this.mailService.sendPhishingEmail(email, content);

    const newPhishingAttempt = new this.phishingSchema({
      email,
      status: 'pending',
      content,
    });

    await newPhishingAttempt.save();

    return newPhishingAttempt;
  }

  /**
   * Marks a pending phishing attempt as clicked for the specified email address.
   * @param email The email address associated with the phishing attempt.
   * @throws BadRequestException if no pending phishing attempt is found.
   */
  async markAttemptAsClicked(email: string): Promise<void> {
    if (!email) {
      throw new BadRequestException('Email parameter is required.');
    }

    const attempt = await this.phishingSchema.findOne({
      email,
      status: 'pending',
    });

    if (!attempt) {
      throw new BadRequestException(
        'No pending phishing attempt found for this email address.',
      );
    }

    attempt.status = 'clicked';
    await attempt.save();
  }

  /**
   * Retrieves all phishing attempts.
   * @returns An array of all phishing attempts.
   */
  async getAllAttempts(): Promise<Phishing[]> {
    return this.phishingSchema.find().exec();
  }
}
