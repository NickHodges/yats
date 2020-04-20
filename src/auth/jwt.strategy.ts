import { AuthService } from 'src/auth/auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from 'src/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretkey',
      ignoreExpiration: false
    });
  }

  validate(payload: JwtPayload): Promise<User> {
    console.log('In validate, payload: ' + JSON.stringify(payload));
    return this.authService.verifyPayload(payload);
  }
}
