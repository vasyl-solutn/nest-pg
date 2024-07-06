import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TaskRelations } from './task-relations.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  isCompleted: boolean;

  @OneToMany(() => TaskRelations, (taskRelation) => taskRelation.downwardsTask)
  downwardsTasks: TaskRelations[];

  @OneToMany(() => TaskRelations, (taskRelation) => taskRelation.upwardsTask)
  upwardsTasks: TaskRelations[];
}
