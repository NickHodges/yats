import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from 'src/models/user.model';


@Controller('users')
export class UsersController {

constructor(private usersService: UserService){}

@Post()
async createUser(@Body() user: User) {
  return this.usersService.createUser(user);
}


}
