import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToDosService } from './to-dos/to-dos.service';
import { ToDosController } from './to-dos/to-dos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './models/todo.model';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DataInterceptor } from './util/data.interceptor';
import { DataPipe } from './util/data.pipe';
import { UserService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { User } from './models/user.model';
import { findUserController } from './user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'TodoDB',
      entities: [__dirname + '/**/*.model{.ts,.js}'],
      synchronize: true
    }),
    TypeOrmModule.forFeature([Todo]),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AppController, ToDosController, UsersController, findUserController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataInterceptor
    },
    AppService,
    ToDosService,
    {
      provide: APP_PIPE,
      useClass: DataPipe
    },
    UserService
  ]
})
export class AppModule {}
