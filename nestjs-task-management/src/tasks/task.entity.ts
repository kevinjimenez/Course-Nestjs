import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {TaskStatusEnum} from "./task-status.enum";

@Entity()
export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatusEnum;

}
