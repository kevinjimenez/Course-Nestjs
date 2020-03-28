import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from './dto/create-task.dto';
import {TaskRepository} from "./task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {TaskEntity} from "./task.entity";
import {TaskStatusEnum} from "./task-status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {UserEntity} from "../auth/user.entity";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {

    }

    getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
        return this.taskRepository.getTasks(filterDto)
    }

    // getTasksWithFilters(filterTask: GetTasksFilterDto): Task[] {
    //   const { status, search } = filterTask;
    //   let tasks = this.getAllTasks();
    //
    //   if (status) {
    //     tasks = tasks.filter(task => task.status === status);
    //   }
    //
    //   if (search) {
    //     tasks = tasks.filter(
    //       tasks =>
    //         tasks.title.includes(search) || tasks.description.includes(search),
    //     );
    //   }
    //
    //   return tasks;
    // }
    //

    // getAllTasks(): Task[] {
    //   return this.tasks;
    // }
    //
    async getTaskById(id: number): Promise<TaskEntity> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: UserEntity): Promise<TaskEntity> {
        return await this.taskRepository.createTask(createTaskDto, user);
    }

    async updateTaskStatus(id: number, status: TaskStatusEnum): Promise<TaskEntity> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }

    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //   const task = this.getTaskById(id);
    //   task.status = status;
    //   return task;
    // }

    async deleteTask(id: number): Promise<void> {
        // return this.taskRepository.deleteTask(id);
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }
}
