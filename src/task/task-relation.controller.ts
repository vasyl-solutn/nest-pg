import { Controller, Delete, Param, Post } from '@nestjs/common';
import { TaskRelationService } from './task-relation.service';

@Controller('tasks')
export class TaskRelationController {
  constructor(private readonly taskRelationService: TaskRelationService) {}

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
