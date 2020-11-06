import {Model} from 'mongoose';
import {HttpException, Injectable} from '@nestjs/common';
import {User, UserDocument} from "./schemas/user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {CreateUserDto} from "./dto/createUser.dto";
import {compare, toHash, getToken, encrypt} from "@clsdcltask/dclauth/build/crypt";
import {AuthRequestDto} from "./dto/authRequest.dto";
import {JwtService} from "@nestjs/jwt";
import {AuthResponseDto} from "./dto/authResponse.dto";

require('dotenv').config();

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {  }

  async create(createUser: CreateUserDto): Promise<User> {

    const existing = this.userModel.findOne({email: createUser.email});
    //console.log("Exitsing: ",existing);
    // salt password
    createUser.password = await toHash(createUser.password);
    // Id token
    createUser.token = await getToken();

    const createdUser = new this.userModel(createUser);

    // emmit event
    return Promise.resolve(createdUser.save());
  }

  async findUserByEmail(email: string): Promise<User> {
    const found = this.userModel.findOne({email});
    return Promise.resolve(found);
  }

  async authenticate(authRequest: AuthRequestDto): Promise<AuthResponseDto> {
    try {
      const user = await this.findUserByEmail(authRequest.email);
      if (compare(user.password, authRequest.password)) {
        const {email, token} = user;
        return Promise.resolve({email, token});
      }
    } catch (error) {
      console.log(`UserService - authenticate : erorr ${error.message}`)
    }

    throw new HttpException('Unauthorized', 400);
  }

  async signPayload(user): Promise<string> {
    return Promise
      .resolve(
        this.jwtService.sign({data:user}, {algorithm: "HS512"}));
  }
}
