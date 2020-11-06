import {AppController} from './app.controller';
import *  as request from "supertest";
import {CreateTaskDto} from './modules/tasks/dto/createTask.dto';
import {HttpStatus} from "@nestjs/common";
import {Task} from "./modules/tasks/schema/task.schema";

describe('AppController', () => {

  const baseUri = 'http://dcltask.dev';
  let jwtToken;

  beforeEach(async () => {
    const loginRequest = {
      email: 'clschalkwyk+2@gmail.com',
      password: 'some_password'
    };

    //Login user, get JWT token
    await request(baseUri)
      .post("/api/auth/login")
      .set('Accept', 'application/json')
      .send(loginRequest)
      .then(res => {
        jwtToken = res.body.token;
      });
  });

  // {/api/tasks, POST}
  describe('TASK API', () => {
    it('POST /api/tasks: should return HttpStatus.ACCEPTED ', async () => {

      const createTask: CreateTaskDto = {
        title: "Title for new Task",
        status: 1
      };

      let resBody;
      const resPost: request.Response = await request(baseUri)
        .post('/api/tasks')
        .send(createTask)
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          resBody = res.body;
          return res;
        });

      expect(resPost.status).toBe(HttpStatus.ACCEPTED);
    });


    // {/api/tasks/:taskId, GET}
    it('GET /api/tasks/:taskId : should return HttpStatus.OK', async () => {

      const createTask: CreateTaskDto = {
        title: "Return me",
        status: 1
      };

      const newTask: Task = await request(baseUri)
        .post('/api/tasks')
        .send(createTask)
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res.body;
        });

      const response = await request(baseUri)
        .get(`/api/tasks/view/${newTask._id}`)
        .send()
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res;
        });

      expect(response.status).toBe(HttpStatus.OK);
    });


    // {/api/tasks/:taskId, PUT}
    it('PUT /api/tasks/:taskId : should update existing task', async () => {
      const createTask: CreateTaskDto = {
        title: "Update me please",
        status: 1
      };

      const newTask: Task = await request(baseUri)
        .post('/api/tasks')
        .send(createTask)
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res.body;
        });

      const newTitle = newTask.title + ', Updated';
      newTask.title = newTitle;

      const response = await request(baseUri)
        .put(`/api/tasks/${newTask._id}`)
        .send(newTask)
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res;
        });

      const updatedTask: Task = await request(baseUri)
        .get(`/api/tasks/view/${newTask._id}`)
        .send()
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res.body;
        });

      expect(updatedTask.title).toBe(newTitle);
    });

    // {/api/tasks/status/:taskId, PATCH}
    it('PATCH /api/tasks/status/:taskId : should update status of specified task', async () => {

      const createTask: CreateTaskDto = {
        title: "Patch my status please",
        status: 1
      };

      const newTask: Task = await request(baseUri)
        .post('/api/tasks')
        .send(createTask)
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res.body;
        });

      const response = await request(baseUri)
        .patch(`/api/tasks/status/${newTask._id}`)
        .send({status: 0})// new status
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res;
        });

      const updatedTask: Task = await request(baseUri)
        .get(`/api/tasks/view/${newTask._id}`)
        .send()
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res.body;
        });

      expect(updatedTask.status).toBe(0);
    });

    // {/api/tasks/:taskId, DELETE}
    it('DELETE /api/tasks/:taskId : should update status of specified task', async () => {

      const createTask: CreateTaskDto = {
        title: "Delete me please",
        status: 1
      };

      const newTask: Task = await request(baseUri)
        .post('/api/tasks')
        .send(createTask)
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res.body;
        });


      const response = await request(baseUri)
        .delete(`/api/tasks/${newTask._id}`)
        .send()// new status
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res;
        });

      expect(response.status).toBe(HttpStatus.OK);
    });

    // {/api/tasks/:taskId, GET}
    it('GET /api/tasks/:taskId : should fetch existing task', async () => {

      const createTask: CreateTaskDto = {
        title: "Get me please " + (new Date().getTime()),
        status: 1
      };

      const newTask: Task = await request(baseUri)
        .post('/api/tasks')
        .send(createTask)
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res.body;
        });

      const response: Task = await request(baseUri)
        .get(`/api/tasks/view/${newTask._id}`)
        .send()// new status
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          return res.body;
        });

      expect(response.title).toBe(createTask.title);
    });

    // {/api/tasks/list, GET}
    it('GET /api/tasks/list : should fetch list of tasks', async () => {

      const createTask: CreateTaskDto = {
        title: "Get me please " + (new Date().getTime()),
        status: 1
      };

      let currentTasks: Task;
      const response: request.Response = await request(baseUri)
        .get('/api/tasks/list')
        .send()
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          currentTasks = res.body;
          return res;
        });

      expect(response.status).toBe(HttpStatus.OK);
    });
  });
});
