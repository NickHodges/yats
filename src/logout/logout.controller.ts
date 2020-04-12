import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { Cookies, ClearCookies } from '@nestjsplus/cookies';
import { sessionStore } from 'src/util/session-store.util';

@Controller('logout')
export class LogoutController {
  @Post()
  @HttpCode(HttpStatus.OK)
  @ClearCookies('SESSIONID')
  logout(@Cookies() cookies) {
    const sessionId = cookies['SESSIONID'];
    sessionStore.destroySession(sessionId);
  }
}
