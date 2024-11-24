import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  getAccount(@Param('id') id: string) {
    return this.userService.getAccount(id);
  }
}
