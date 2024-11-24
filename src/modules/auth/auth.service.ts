import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
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
    @InjectModel(User.name)
    private readonly userSchema: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user after validating the email and hashing the password.
   * @param signUpDto The sign-up data including email, password, and full name.
   * @returns A success message and status.
   * @throws ConflictException if a user already exists with the same email.
   */
  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ message: string; status: number }> {
    const { email, password, fullName } = signUpDto;

    const existingUser = await this.userSchema.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
      );
    } catch {
      throw new InternalServerErrorException('Error hashing password');
    }

    const newUser = new this.userSchema({
      email,
      password: hashedPassword,
      fullName,
    });

    try {
      await newUser.save();
    } catch {
      throw new InternalServerErrorException('Error saving user');
    }

    return { status: 201, message: 'User registered successfully' };
  }

  /**
   * Signs in a user after validating credentials and issuing a JWT token.
   * @param email User's email.
   * @param password User's password.
   * @returns The generated JWT token and user data.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; data: UserDto }> {
    const user = await this.userSchema.findOne({ email }).exec();
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
