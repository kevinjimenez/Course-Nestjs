import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {TaskStatusEnum} from "./task-status.enum";
import {UserEntity} from "../auth/user.entity";

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

    @ManyToOne(
        type => UserEntity,
        user => user.task,
        {eager: false}
    )
    user: UserEntity;

}
