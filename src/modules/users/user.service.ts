import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user/user.schema';
import { UserPayload } from '../../schemas/user/user.payload';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAccount(id: string): Promise<UserPayload> {
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (!user)
      throw new NotFoundException(`User with email id:${id} not found `);

    return user;
  }
}
