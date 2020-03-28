import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TaskRepository} from "./task.repository";
import {AuthModule} from "../auth/auth.module";

@Module({

    /*
    no necesariamente se debe cololcar la entidad en
    TypeOrmModule.forFeature, en este caso colocaremos el repositori el cual se va usar
    */


  imports:[
      AuthModule,
      TypeOrmModule.forFeature([
          TaskRepository
      ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
