import { User } from './../models/user.model';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  getAllUsers() {
    return this.userRepository.find({
      isDeleted: false
    });
  }

  async checkEmailForDuplicate(email: string) {
    const theUser: User = await this.userRepository.findOne({ email: email });
    console.log('theUser in checkEmailForDuplicate: ', theUser);
    return !!theUser;
  }

  async createUser(user: User) {
    // console.log('in createUser, user is: ', user);
    if (await this.checkEmailForDuplicate(user.email)) {
      throw new HttpException('That email already exists.', HttpStatus.CONFLICT);
    }

    return this.userRepository.save(user);
  }
}
