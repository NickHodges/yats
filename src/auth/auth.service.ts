import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne(username);
    console.log('Found one! ', user);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user._id };
    console.log('Payload', payload);
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;

    user = await this.userRepository.findOne({ where: { email: payload.sub } });
    console.log('In VerifyPayload, user: ', user);

    return user;
  }
}