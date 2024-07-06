import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TaskRelationService } from './task-relation.service';
import { Task } from './task.entity';

@Controller('task-relations')
export class TaskRelationController {
  constructor(private readonly taskRelationService: TaskRelationService) {}

  @Get(':taskId/related')
  async getRelatedTasks(
    @Param('taskId') taskId: number,
  ): Promise<{ upwards: Task[]; downwards: Task[] }> {
    return this.taskRelationService.getRelatedTasks(taskId);
  }

  @Post(':taskId/relate/:relatedTaskId')
  async relateTasks(
    @Param('taskId') taskId: number,
    @Param('relatedTaskId') relatedTaskId: number,
  ): Promise<void> {
    return this.taskRelationService.relateTasks(taskId, relatedTaskId);
  }

  @Delete(':taskId/unrelate/:relatedTaskId')
  async unrelateTasks(
    @Param('taskId') taskId: number,
    @Param('relatedTaskId') relatedTaskId: number,
  ): Promise<void> {
    return this.taskRelationService.unrelateTasks(taskId, relatedTaskId);
  }
}
