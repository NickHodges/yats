import { Controller, Get, Param, Body, Post, Put, Delete, Query, ParseBoolPipe, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ToDosService } from './to-dos.service';
import { classToPlain } from 'class-transformer';
import { Todo } from '../models/todo.model';
import { ObjectID } from 'typeorm';
import { Cookies } from '@nestjsplus/cookies';

@Controller('todos')
export class ToDosController {
  constructor(private todosService: ToDosService) {}

  @Get()
  async getAllTodos(@Cookies() cookies) {
    const todosEntities = await this.todosService.getAllTodos();
    const todos = classToPlain(todosEntities);
    return todos;
  }

  @Get('complete')
  async getTodos(@Query('iscomplete', new ParseBoolPipe()) isComplete, @Cookies() cookies) {
    let todosEntities: Todo[];

    if (isComplete) {
      todosEntities = await this.todosService.getCompletedTodos();
    } else {
      todosEntities = await this.todosService.getIncompleteTodos();
    }
    const todos = classToPlain(todosEntities);
    return todos;
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
