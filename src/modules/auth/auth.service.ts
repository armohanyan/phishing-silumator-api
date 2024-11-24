import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../../common/config/app.config';
import { UserDto } from '../users/dto/output.user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ message: string; status: number }> {
    const { email, password, fullName } = signUpDto;

    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
    );

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      fullName,
    });

    await newUser.save();

    return { status: 201, message: 'User registered successfully' };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; data: UserDto }> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPass = await bcrypt.compare(password, user.password);

    if (!isValidPass) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: IJwtPayload = { email: user.email, id: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      data: new UserDto(user),
    };
  }
}
