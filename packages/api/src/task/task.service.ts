import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskRelations } from './task-relations.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskRelations)
    private taskRelationsRepository: Repository<TaskRelations>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  findOne(id: string): Promise<Task> {
    return this.taskRepository.findOneBy({ id: Number(id) });
  }

  async create(task: Task): Promise<Task> {
    return this.taskRepository.save(task);
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    const existingTask = await this.taskRepository.findOneBy({
      id: Number(id),
    });
    if (!existingTask) {
      throw new Error('Task not found');
    }
    // Update and save the task
    this.taskRepository.merge(existingTask, task);
    return this.taskRepository.save(existingTask);
  }

  async remove(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
