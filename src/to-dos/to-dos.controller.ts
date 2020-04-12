import { Controller, Get, Param, Body, Post, Put, Delete, Query, ParseBoolPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ToDosService } from './to-dos.service';
import { classToPlain } from 'class-transformer';
import { Todo } from '../models/todo.model';
import { ObjectID } from 'typeorm';
import { Cookies } from '@nestjsplus/cookies';
import { sessionStore } from 'src/util/session-store.util';

@Controller('todos')
export class ToDosController {
  constructor(private todosService: ToDosService) {}

  @Get()
  async getAllTodos(@Cookies() cookies) {
    const isSessionValid = sessionIsValid(cookies);

    if (isSessionValid) {
      const todosEntities = await this.todosService.getAllTodos();
      const todos = classToPlain(todosEntities);
      return todos;
    } else {
      throw new HttpException('', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('complete')
  async getTodos(@Query('iscomplete', new ParseBoolPipe()) isComplete, @Cookies() cookies) {
    let todosEntities: Todo[];
    const isSessionValid = sessionIsValid(cookies);

    if (isSessionValid) {
      if (isComplete) {
        todosEntities = await this.todosService.getCompletedTodos();
      } else {
        todosEntities = await this.todosService.getIncompleteTodos();
      }
      const todos = classToPlain(todosEntities);
      return todos;
    } else {
      throw new HttpException('', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get(':id')
  async getTodo(@Param('id') id: ObjectID): Promise<Todo> {
    return this.todosService.getTodo(id);
  }

  @Post()
  async createTodo(@Body() todo: Todo) {
    return this.todosService.createTodo(todo);
  }

  @Put(':id')
  async updTodo(@Param('id') id: ObjectID, @Body() todo: Todo) {
    return this.todosService.updateTodo(id, todo);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: ObjectID) {
    return this.todosService.deleteTodo(id);
  }
}
function sessionIsValid(cookies: any) {
  const sessionId = cookies['SESSIONID'];
  const isSessionValid = sessionStore.isSessionValid(sessionId);
  return isSessionValid;
}
