import {HttpException, HttpStatus} from "@nestjs/common";

export class StatusUpdateException extends HttpException{
  constructor() {
    super('Status Update Failed', HttpStatus.BAD_REQUEST);
  }
}
