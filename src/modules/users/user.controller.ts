import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserPayload } from '../../schemas/user/user.payload';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieves a user account by its ID.
   * @param id The ID of the user to retrieve.
   * @returns The user account details in `UserPayload` format.
   * @throws NotFoundException if the user does not exist.
   */
  @Get('/:id')
  async getAccount(@Param('id') id: string): Promise<UserPayload> {
    return this.userService.getAccount(id);
  }
}
