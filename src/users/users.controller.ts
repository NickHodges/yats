import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from 'src/models/user.model';
import { classToPlain } from 'class-transformer';
import * as argon2 from 'argon2';
import { validatePassword } from 'src/util/password-validator';

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
  async createUser(@Body() user: User): Promise<User> {
    const theErrors = validatePassword(user.password);

    if (theErrors.length > 0) {
      throw new HttpException(theErrors, HttpStatus.NOT_ACCEPTABLE);
    } else {
      return argon2
        .hash(user.password)
        .then(passwordDigest => {
          user.password = passwordDigest;
        })
        .then(() => {
          return this.userService.createUser(user);
        });
    }
  }
}
