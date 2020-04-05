import { Controller, Get, Param, Body, Post, Put, Delete, Query } from '@nestjs/common';
import { ToDosService } from './to-dos.service';
import { classToPlain } from 'class-transformer';
import { Todo } from '../models/todo.model';
import { ObjectID } from 'typeorm';
import { ApiQuery } from '@nestjs/swagger';

@Controller('todos')
export class ToDosController {
  constructor(private todosService: ToDosService) {}

  @Get()
  async getAllTodos() {
    const todosEntities = await this.todosService.getAllTodos();
    const todos = classToPlain(todosEntities);
    return todos;
  }

  @Get('complete')
  async getTodos(@Query('iscomplete') isComplete: string) {
    if (isComplete === 'true') {
      const todosEntities = await this.todosService.getCompletedTodos();
      const todos = classToPlain(todosEntities);
      return todos;
    } else {
      const todosEntities = await this.todosService.getIncompleteTodos();
      const todos = classToPlain(todosEntities);
      return todos;
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
