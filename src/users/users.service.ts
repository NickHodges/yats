import { User } from './../models/user.model';
import { Injectable } from '@nestjs/common';

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

  createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
