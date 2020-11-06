import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@clsdcltask/dclauth/build/jwt/jwt.strategy';
import { Task, TaskSchema } from './schema/task.schema';


require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Task.name,
        useFactory: () => {
          const schema = TaskSchema;
          schema.post('save', (doc) => {
            console.log(`POST Saving Model Task: ${JSON.stringify(doc)}`)
            // emmit to event bus
          });
          return schema;
        }
      }
    ]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '5min'
      }
    }),
  ],
  providers: [TasksService, JwtStrategy],
  exports: [TasksService]
})
export class TasksModule {}
