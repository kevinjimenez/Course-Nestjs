import { PipeTransform, BadRequestException } from '@nestjs/common';
import {TaskStatusEnum} from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowStatuses = [
    TaskStatusEnum.OPEN,
    TaskStatusEnum.IN_PROGRESS,
    TaskStatusEnum.DONE,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an ivalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowStatuses.indexOf(status);
    return idx !== -1;
  }
}
