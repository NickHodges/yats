import { Cookies } from '@nestjsplus/cookies';
import { Controller, Get, HttpException, HttpStatus, Body, Request } from '@nestjs/common';
import { sessionStore } from 'src/util/session-store.util';
import { User } from 'src/models/user.model';

@Controller('user')
export class findUserController {
  @Get()
  getUser(@Body() user: User, @Cookies() cookies) {
    const sessionId = cookies['SESSIONID'];
    const theUser = sessionStore.findUserBySessionId(sessionId);

    if (theUser) {
      return theUser;
    } else {
      throw new HttpException('', HttpStatus.NO_CONTENT);
    }
  }
}
