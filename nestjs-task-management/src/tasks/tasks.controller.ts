import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    Query,
    UsePipes,
    ValidationPipe, ParseIntPipe,
} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {TaskStatusValidationPipe} from './pipes/task-status-validation.pipe';
import {TaskEntity} from "./task.entity";
import {TaskStatusEnum} from "./task-status.enum";

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {
    }

    //
    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto) {
        return this.tasksService.getTasks(filterDto);
    }

    @Get(':id') // /:id o :i  d
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe) // ValidationPipe -> toma los datos de http y los valida con el dto que se ta tipando (validacion por default)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        return this.tasksService.createTask(createTaskDto);
    }

    //
    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number): void {
        this.tasksService.deleteTask(id);
    }

    //
    @Patch('/:id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatusEnum,
    ): Promise<TaskEntity> {
        return this.tasksService.updateTaskStatus(id, status);
    }
}
