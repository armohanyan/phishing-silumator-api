import { IsEmail, IsString } from 'class-validator';

export class CreatePhishingInput {
  @IsEmail()
  email: string;

  @IsString()
  content: string;

  @IsString()
  status: 'pending';
}
