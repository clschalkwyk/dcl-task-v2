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
        //limit status available to update
        if (newStatus === 1 || newStatus === 0) {
          currentTask.status = newStatus;

          console.log(`setTaskStatus updated current task ${JSON.stringify(currentTask)}`);
          return Promise.resolve(currentTask.save());
        }
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
      if (currentTask && currentTask.owner === user.token) {
        currentTask.status = updateBody.status;
        currentTask.title = updateBody.title;
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

  async listTasks(user: JwtUserTdo, query: object): Promise<Task[]> {
    console.log(`TasksService - listTasks : ${user.token}`);

    try {
      let lookup = {
        owner: user.token
      };

      if ('status' in query) {
        lookup['status'] = query['status'];
      }

      const found: TaskDocument[] = await this.taskModel.find(lookup);
      return Promise.resolve(found);

    } catch (e) {
      console.error(`TasksService - getTask : Error setting status`, e);
      throw new StatusUpdateException();
    }

    // if not returned, throw exception
    throw new UnauthorizedException();
  }


}
