
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import {TaskStatusEnum} from "../task-status.enum";

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn([TaskStatusEnum.OPEN, TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.DONE])
  status: TaskStatusEnum;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
