import { Injectable } from '@nestjs/common';
import { Todo } from 'src/models/todo.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectID } from 'typeorm/browser';

@Injectable()
export class ToDosService {
  constructor(@InjectRepository(Todo) private todosRepository: Repository<Todo>) {}

  async getAllTodos(): Promise<Todo[]> {
    return this.todosRepository.find({
      isDeleted: false
    });
  }

  async getCompletedTodos(): Promise<Todo[]> {
    return this.todosRepository.find({
      complete: true,
      isDeleted: false
    });
  }

  async getIncompleteTodos(): Promise<Todo[]> {
    return this.todosRepository.find({
      complete: false,
      isDeleted: false
    });
  }

  async getTodo(id: ObjectID): Promise<Todo | undefined> {
    return this.todosRepository.findOne(id);
  }

  async createTodo(todo: Todo): Promise<Todo> {
    return this.todosRepository.save(todo);
  }

  async updateTodo(id: ObjectID, todo: Todo) {
    const current = await this.getTodo(id);
    if (!current) {
      return null;
    }
    todo._id = current._id;
    todo.createdAt = current.createdAt;
    todo.createdBy = current.createdBy;
    return this.todosRepository.save(todo);
  }

  async deleteTodo(id: ObjectID) {
    const current = await this.getTodo(id);
    if (!current) {
      return null;
    }
    current.isDeleted = true;
    return this.updateTodo(id, current);
  }
}
