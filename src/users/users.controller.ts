
import { Controller, Post, Body, HttpException, HttpStatus, Request, Get } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from 'src/models/user.model';
import * as argon2 from 'argon2';
import { validatePassword } from 'src/util/password-validator';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() user: User, @Request() req): Promise<User> {
    const theErrors = validatePassword(user.password);

    if (theErrors.length > 0) {
      throw new HttpException(theErrors, HttpStatus.NOT_ACCEPTABLE);
    }
    return await argon2
      .hash(user.password)
      .then(passwordDigest => {
        user.password = passwordDigest;
      })
      .then(() => {
        return this.userService.createUser(user);
      });
  }
}
