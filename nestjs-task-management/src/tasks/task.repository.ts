import {EntityRepository, Repository} from "typeorm";
import {TaskEntity} from "./task.entity";
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskStatusEnum} from "./task-status.enum";
import {NotFoundException} from "@nestjs/common";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {

    async getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
        const {status, search} = filterDto
        // queryBuilder
        const query = this.createQueryBuilder('task'); // entity

        if (status) {
            query
                .andWhere('task.status = :status', {status})
        }

        if (search) {
            // like
            query
                .andWhere('task.title LIKE :search OR task.description LIKE :search', {search: `%${search}%`});
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        const {title, description} = createTaskDto;
        const task = new TaskEntity();
        task.title = title;
        task.description = description;
        task.status = TaskStatusEnum.OPEN;
        await task.save();
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
