import {Model} from 'mongoose';
import {Injectable} from "@nestjs/common";
import {InjectModel} from '@nestjs/mongoose';
import {Task, TaskDocument} from './schema/task.schema';
import {CreateTaskDto} from './dto/createTask.dto';
import {JwtUserTdo} from './dto/user.tdo';
import {StatusUpdateException} from "./exceptions/statusUpdate.exception";
import {UnauthorizedException} from "./exceptions/unauthorized.exception";

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {
  }

  async createTask(createTask: CreateTaskDto, user: JwtUserTdo): Promise<Task> {
    console.log('TasksService - createTask : Creating new task for ', user.token);
    createTask.owner = user.token;
    const newTask: TaskDocument = new this.taskModel(createTask);

    return Promise.resolve(newTask.save());
  }

  async setTaskStatus(taskId: string, newStatus: number, user: JwtUserTdo): Promise<Task> {
    console.log(`TasksService - setTaskStatus : status update on ${taskId} to ${newStatus} ${user.token}`);

    try {
      const currentTask: TaskDocument = await this.taskModel.findOne({_id: taskId});
      console.log(`setTaskStatus ->> found task ${JSON.stringify(currentTask)}`);
      if (currentTask && currentTask.owner === user.token) {
        currentTask.status = newStatus;

        console.log(`setTaskStatus updated current task ${JSON.stringify(currentTask)}`);
        return Promise.resolve(currentTask.save());
      }
    } catch (e) {
      console.error(`TasksService - setTaskStatus : Error setting status`, e);
      throw new StatusUpdateException();
    }

    // if not returned, throw exception
    throw new UnauthorizedException();
  }

  async updateTask(taskId: string, updateBody: Task, user: JwtUserTdo): Promise<Task> {
    console.log(`TasksService - updateTask : update task ${taskId} user: ${user.token}`);

    try {
      const currentTask: TaskDocument = await this.taskModel.findOne({_id: taskId});
      console.log(`TasksService - updateTask : before auth check`);
      if (currentTask && currentTask.owner === user.token) {
        console.log(`TasksService - updateTask : can update`);
        currentTask.status = updateBody.status;
        currentTask.title = updateBody.title;
        console.log(`TasksService - updateTask : returning`);
        return Promise.resolve(currentTask.save());
      }
    } catch (e) {
      console.error(`TasksService - updateTask : Error setting status`, e);
      throw new StatusUpdateException();
    }
    console.log(`TasksService - updateTask : unauthorized`);
    // if not returned, throw exception
    throw new UnauthorizedException();
  }

  async getTask(taskId: string, user: JwtUserTdo): Promise<Task> {
    console.log(`TasksService - getTask : ${taskId}  ${user.token}`);

    try {
      const currentTask: TaskDocument = await this.taskModel.findOne({_id: taskId});
      if (currentTask && currentTask.owner === user.token) {
        return Promise.resolve(currentTask);
      }
    } catch (e) {
      console.error(`TasksService - getTask : Error setting status`, e);
      throw new StatusUpdateException();
    }
    // if not returned, throw exception
    throw new UnauthorizedException();
  }




}
