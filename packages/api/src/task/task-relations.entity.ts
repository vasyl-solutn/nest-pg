// task-relations.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class TaskRelations {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.upwardsTasks)
  upwardsTask: Task;

  @ManyToOne(() => Task, (task) => task.downwardsTasks)
  downwardsTask: Task;
}
