import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from 'src/models/user.model';
import { classToPlain } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    const userEntities = await this.userService.getAllUsers();
    const users = classToPlain(userEntities);
    return users;
  }

  @Post()
  async createUser(@Body() user: User) {
    return this.userService.createUser(user);
  }
}
