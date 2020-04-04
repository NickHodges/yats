import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToDosService } from './to-dos/to-dos.service';
import { ToDosController } from './to-dos/to-dos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './models/todo.model';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DataInterceptor } from './util/data.interceptor';
import { DataPipe } from './util/data.pipe';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'TodoDB',
      entities: [__dirname + '/**/*.model{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Todo]),
  ],
  controllers: [AppController, ToDosController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataInterceptor,
    },
    AppService,
    ToDosService,
    {
      provide: APP_PIPE,
      useClass: DataPipe,
    },
  ],
})
export class AppModule {}
