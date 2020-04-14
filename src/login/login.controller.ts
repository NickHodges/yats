import { Controller } from '@nestjs/common';
import { Post, Body, HttpException, HttpStatus, Request, Response } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { sessionStore } from 'src/util/session-store.util';
import { randomBytes } from 'src/util/security.util';
import { SetCookies } from '@nestjsplus/cookies';

@Controller('login')
export class LoginController {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  @Post()
  @SetCookies({ httpOnly: true, secure: true })
  async login(@Body() clientUser: User, @Request() req): Promise<User> {
    const serverUser: User = await this.userRepository.findOne({ email: clientUser.email });

    if (!serverUser) {
      throw new HttpException('That is some seriously bad password information .', HttpStatus.FORBIDDEN);
    }

    const sessionId = await this.validateLogin(clientUser, serverUser);
    req._cookies = [{ name: 'SESSIONID', value: sessionId }];
    return serverUser;
  }

  async validateLogin(clientuser: User, serverUser: User): Promise<string> {
    const isPasswordValid = await argon2.verify(serverUser.password, clientuser.password);

    if (!isPasswordValid) {
      throw new HttpException('That is some seriously bad password information.', HttpStatus.NOT_ACCEPTABLE);
    }

    const sessionId = await randomBytes(32).then(bytes => bytes.toString('hex'));
    sessionStore.createSession(sessionId, serverUser);

    return sessionId;
  }
}
