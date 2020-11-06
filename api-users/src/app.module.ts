import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {UserModule} from './modules/user/user.module';

require('dotenv').config();

let port: number = 27017;
if ('MONGO_DB_PORT' in process.env) {
  port = parseInt(process.env.MONGO_DB_PORT);
}

let host: string = 'db';
if ('MONGO_DB_HOST' in process.env) {
  host = process.env.MONGO_DB_HOST;
}

let uri = `mongodb://${host}:${port}/users`;
if('MONGO_URI' in process.env){
 uri = process.env.MONGO_URI;
}

console.log("URI", uri);
@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(uri),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
