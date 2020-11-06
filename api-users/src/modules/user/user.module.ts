import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./schemas/user.schema";
import {UserService} from "./user.service";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {LocalStrategy } from "./local.strategy";
import {JwtStrategy } from "@clsdcltask/dclauth/build/jwt/jwt.strategy";

require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.post('save', (doc) => {
            console.log(`POST Saving Model User: ${JSON.stringify(doc)}`)
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
    })
  ],
  providers: [UserService, LocalStrategy, JwtStrategy],
  exports: [UserService, LocalStrategy]
})

export class UserModule {
}
