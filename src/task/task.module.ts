import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRelations } from './task-relations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskRelations])],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
