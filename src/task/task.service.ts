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

  async relateTasks(taskId: number, relatedTaskId: number): Promise<void> {
    const task = await this.taskRepository.findOneBy({ id: taskId });
    const relatedTask = await this.taskRepository.findOneBy({
      id: relatedTaskId,
    });

    if (!task || !relatedTask) {
      throw new NotFoundException('One or both tasks not found');
    }

    const taskRelation = new TaskRelations();
    taskRelation.upwardsTask = task; // Assuming this is the direction you want
    taskRelation.downwardsTask = relatedTask; // Adjust according to your logic

    await this.taskRelationsRepository.save(taskRelation);
  }

  async unrelateTasks(taskId: number, relatedTaskId: number): Promise<void> {
    // TODO: refactor by instantiate this object more elegant of form the condition better
    const upwardsTask = new Task();
    upwardsTask.id = taskId;

    const downwardsTask = new Task();
    downwardsTask.id = relatedTaskId;

    // TODO: does it work?
    const relation = await this.taskRelationsRepository.findOne({
      where: [
        { upwardsTask, downwardsTask },
        // { upwardsTask: relatedTaskId, downwardsTask: taskId } // Assuming bidirectional removal
      ],
    });

    if (!relation) {
      throw new NotFoundException(
        'The relationship between the specified tasks does not exist.',
      );
    }

    await this.taskRelationsRepository.remove(relation);
  }
}
