import {Body, Controller, Post, UseGuards, Req, Res, HttpStatus, Patch, Param, Put, Delete, Get} from '@nestjs/common';
import {JwtAuthGuard} from "@clsdcltask/dclauth/build/jwt/jwt-auth.guard";
import {TasksService} from './modules/tasks/tasks.service';
import {StatusUpdateException} from "./modules/tasks/exceptions/statusUpdate.exception";

@Controller('/api/tasks')
export class AppController {
  constructor(
    private readonly taskService: TasksService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async postTask(@Body() body, @Req() req, @Res() res): Promise<string> {
    console.log(`AppController - postTask : USER : `, req.user);
    const newTask = await this.taskService.createTask(body, req.user);
    console.log(`AppController - postTask : new task created : ${JSON.stringify(newTask)}`);

    return res.status(HttpStatus.ACCEPTED).json(newTask);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/status/:taskId')
  async patchTask(@Body() body, @Req() req, @Res() res, @Param('taskId') taskId: string): Promise<string> {
    console.log(`AppController - patchTask : USER : `, req.user);
    try {
      console.log(`AppController - patchTask : BODY : ${JSON.stringify(body)}`);
      const {status} = body;
      const updatedTask = await this.taskService.setTaskStatus(taskId, status, req.user);

      console.log(`AppController - patchTask Status : ${JSON.stringify(updatedTask)}`);
      return res.status(HttpStatus.NO_CONTENT).json({});
    } catch (e) {
      throw new StatusUpdateException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:taskId')
  async putTask(@Body() body, @Req() req, @Res() res, @Param('taskId') taskId: string): Promise<string> {
    console.log(`AppController - putTask : USER : `, req.user);
    console.log(`AppController - putTask : taskId [${taskId}]: `, body);

    const updatedTask = await this.taskService.updateTask(taskId, body, req.user);

    console.log(`AppController - putTask: Updated task : ${JSON.stringify(updatedTask)}`);
    return res.status(HttpStatus.NO_CONTENT).json({});
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:taskId')
  async deleteTask(@Req() req, @Res() res, @Param('taskId') taskId: string): Promise<string> {
    console.log(`AppController - putTask : USER : `, req.user);
    console.log(`AppController - putTask : taskId [${taskId}]`);

    //    const updatedTask = await this.taskService.setTaskStatus(taskId, status, req.user);

    // console.log(`AppController - patchTask Status : ${JSON.stringify(updatedTask)}`);
    return res.status(HttpStatus.OK).json({});
  }

  @UseGuards(JwtAuthGuard)
  @Get('/view/:taskId')
  async viewTask(@Req() req, @Res() res, @Param('taskId') taskId: string): Promise<string> {
    console.log(`AppController - viewTask : USER : `, req.user);
    console.log(`AppController - viewTask : taskId [${taskId}]`);

    const task = await this.taskService.getTask(taskId, req.user);

    console.log(`AppController - viewTask : found [${JSON.stringify(task)}]`);
    return res.status(HttpStatus.OK).json(task);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  async listTask(@Req() req, @Res() res): Promise<string> {
    console.log(`AppController - listTask : USER : `, req.user);
    const updatedTask = await this.taskService.listTasks(req.user, req.query);

    console.log(`AppController - patchTask Status : ${JSON.stringify(updatedTask)}`);
    return res.status(HttpStatus.OK).json({});
  }

}
