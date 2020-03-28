import {EntityRepository, Repository} from "typeorm";
import {TaskEntity} from "./task.entity";
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskStatusEnum} from "./task-status.enum";
import {InternalServerErrorException, Logger} from "@nestjs/common";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {UserEntity} from "../auth/user.entity";

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
    private looger = new Logger('TaskRepository');

    async getTasks(
        filterDto: GetTasksFilterDto,
        user: UserEntity,
    ): Promise<TaskEntity[]> {
        const {status, search} = filterDto
        // queryBuilder
        const query = this.createQueryBuilder('task'); // entity
        query.where('task.userI = :userId', {userId: user.id});

        if (status) {
            query
                .andWhere('task.status = :status', {status})
        }

        if (search) {
            // like
            query
                .andWhere('task.title LIKE :search OR task.description LIKE :search', {search: `%${search}%`});
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.looger
                .error(
                    `Failed to get tasks for user ${user.username}, DTO: ${JSON.stringify(filterDto)}`,
                    error.stack
                );
            throw new InternalServerErrorException();
        }

    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: UserEntity): Promise<TaskEntity> {
        const {title, description} = createTaskDto;
        const task = new TaskEntity();
        task.title = title;
        task.description = description;
        task.status = TaskStatusEnum.OPEN;
        task.user = user;
        try {
            await task.save();
        } catch (error) {
            this.looger
                .error(
                    `Failed to create a task for user ${user.username}, Data: ${JSON.stringify(createTaskDto)}`,
                    error.stack
                );
            throw new InternalServerErrorException();
        }


        delete task.user;
        return task;
    }

    // async getTaskById(id: number): Promise<TaskEntity> {
    //     const found = await this.findOne(id);
    //
    //     if (!found) {
    //         throw new NotFoundException(`Task with ID "${id}" not found`);
    //     }
    //
    //     return found;
    // }
    //
    // async deleteTask(id: number): Promise<TaskEntity> {
    //     const found = await this.getTaskById(id);
    //     await this.delete(id);
    //     return found
    // }
}
