import { User } from './../models/user.model';
import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  getAllUsers() {
    return this.userRepository.find({
      isDeleted: false
    });
  }

  createUser(user: User): Promise<User> {
    const tempUser: User = new User();
    tempUser.email = user.email;
    argon2.hash(user.password).then(passwordDigest => {
      tempUser.password = passwordDigest;
    });
    return this.userRepository.save(tempUser);
  }
}
