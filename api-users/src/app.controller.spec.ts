import {AppController} from './app.controller';
import *  as request from "supertest";
import {CreateUserDto} from "./modules/user/dto/createUser.dto";
import {AuthRequestDto} from "./modules/user/dto/authRequest.dto";

describe('AppController', () => {

  const baseUri = 'http://dcltask.dev';

  describe('USERS', () => {
    it('POST /auth : should return 201 status', () => {
      const createUser: CreateUserDto = {
        email: 'clschalkwyk+2@gmail.com',
        password: 'some_password',
        token: "token123"
      }

      return request(baseUri)
        .post('/api/auth')
        .send(createUser)
        .expect(201);
    });

    it('POST /users/auth : should return 200 status', () => {
      const authRequest: AuthRequestDto = {
        email: 'clschalkwyk+2@gmail.com',
        password: 'some_password',
      }

      return request(baseUri)
        .post('/api/auth/login')
        .send(authRequest)
        .expect(200);
    });

    it('GET /users/me : should validate token and match email address', async () => {

      const authRequest: AuthRequestDto = {
        email: 'clschalkwyk+2@gmail.com',
        password: 'some_password',
      }

      let jwtToken;
      await request(baseUri)
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send(authRequest)
        .then(res => {
          jwtToken = res.body.token;
        });

      let resBody;
      await request(baseUri)
        .get('/api/auth/me')
        .auth(jwtToken, {type: "bearer"})
        .then(res => {
          resBody = res.body;
        });

      expect(resBody.email).toBe(authRequest.email);
    });

  });
});
