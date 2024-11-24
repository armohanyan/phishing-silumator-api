import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user/user.schema';

@Injectable()
export class PhishingService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
}
