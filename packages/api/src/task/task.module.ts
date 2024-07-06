import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRelations } from './task-relations.entity';
import { TaskRelationService } from './task-relation.service';
import { TaskRelationController } from './task-relation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskRelations])],
  providers: [TaskService, TaskRelationService],
  controllers: [TaskController, TaskRelationController],
})
export class TaskModule {}
