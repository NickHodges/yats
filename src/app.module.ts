import { Module, ValidationPipe, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
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
import { LoginController } from './login/login.controller';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './auth/auth.constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ErrorMiddleware } from './middleware/error.middleware';

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
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15s' }
    })
  ],
  controllers: [AppController, ToDosController, UsersController, LoginController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataInterceptor
    },
    AppService,
    AuthService,
    ToDosService,
    {
      provide: APP_PIPE,
      useClass: DataPipe
    },
    UserService,
    JwtStrategy
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer.apply(ErrorMiddleware).forRoutes('');
  }
}
