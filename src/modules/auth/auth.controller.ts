import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../users/dto/output.user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user.
   * @param signUpDto Data required to create a new user account.
   */
  @Post('/sign-up')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ message: string; status: number }> {
    return await this.authService.signUp(signUpDto);
  }

  /**
   * Authenticates a user and returns a token.
   * @param signInDto Data required to authenticate the user.
   */
  @Post('/sign-in')
  @ApiOperation({ summary: 'Authenticate user and return a token' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(200)
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ access_token: string; data: UserDto }> {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }
}
