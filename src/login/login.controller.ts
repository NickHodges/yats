import { Controller, UseGuards } from '@nestjs/common';
import { Post, Body, HttpException, HttpStatus, Request } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { AuthService } from 'src/auth/auth.service';

@Controller('login')
export class LoginController {
  private badInfo: string = 'Dude, your login information is completely unacceptable.';

  constructor(@InjectRepository(User) private userRepository: Repository<User>, private authService: AuthService) {}

  @Post()
  async login(@Body() clientUser: User, @Request() req) {
    console.log('clientUser.email: ', clientUser.email);
    const serverUser: User = await this.userRepository.findOne({ email: clientUser.email });
    
    if (!serverUser) {
      throw new HttpException(this.badInfo, HttpStatus.FORBIDDEN);
    }
    const theUser: Promise<User> = this.validateLogin(clientUser, serverUser);
    return this.authService.login(await theUser);
  }

  async validateLogin(clientuser: User, serverUser: User): Promise<User> {
    const isPasswordValid = await argon2.verify(serverUser.password, clientuser.password);

    if (isPasswordValid) {
      return serverUser;
    } else {
      throw new HttpException(this.badInfo, HttpStatus.NOT_ACCEPTABLE);
    }
  }
}
