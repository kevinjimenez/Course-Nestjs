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
    ValidationPipe, ParseIntPipe, UseGuards, Logger,
} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {TaskStatusValidationPipe} from './pipes/task-status-validation.pipe';
import {TaskEntity} from "./task.entity";
import {TaskStatusEnum} from "./task-status.enum";
import {AuthGuard} from "@nestjs/passport";
import {UserEntity} from "../auth/user.entity";
import {GetUser} from "../auth/get-user.decorator";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private looger = new Logger('TasksController');

    constructor(private tasksService: TasksService) {
    }

    //
    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: UserEntity
    ) {
        this.looger.verbose(`User "${user.username}" retrieving all task. Filter: ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get(':id') // /:id o :i  d
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity,
    ): Promise<TaskEntity> {
        return this.tasksService.getTaskById(id, user);
    }

    /*
    si no se manda el jwtoken no obtiene el usuario
    * */
    @Post()
    @UsePipes(ValidationPipe) // ValidationPipe -> toma los datos de http y los valida con el dto que se ta tipando (validacion por default)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: UserEntity
    ): Promise<TaskEntity> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    //
    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity
    ): void {
        this.tasksService.deleteTask(id, user);
    }

    //
    @Patch('/:id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatusEnum,
        @GetUser() user: UserEntity,
    ): Promise<TaskEntity> {
        return this.tasksService
            .updateTaskStatus(
                id,
                status,
                user);
    }
}

// Logger
/*
Log -> proposito general
warning -> issues
error -> error
debug -> inusual informacion
verboose -> mas informacion

 */
