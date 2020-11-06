import {Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Put, Req, Request, Res, UseGuards} from "@nestjs/common";
import {CreateUserDto} from "./modules/user/dto/createUser.dto";
import {CreateResultDto} from "./modules/user/dto/createResult.dto";
import {UserService} from "./modules/user/user.service";
import {LocalAuthGuard} from "./modules/user/local-auth.guard";
import {JwtAuthGuard} from "@clsdcltask/dclauth/build/jwt/jwt-auth.guard";

require('dotenv').config();

@Controller('/api/auth')
export class AppController {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @Post()
  async create(@Body() createUser: CreateUserDto, @Res() res): Promise<string> {
    const createdUser = await this.userService.create(createUser);
    const createResult: CreateResultDto = {
      status: HttpStatus.OK,
      message: JSON.stringify(createdUser)
    }
    return res.status(HttpStatus.CREATED).json(createResult);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async auth(@Req() req, @Res() res): Promise<string> {
    const {user} = req;
    const token = await this.userService.signPayload(user);

    return res.status(HttpStatus.OK).json({token});
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@Request() req, @Res() res): string {

    if (!req.user) {
      throw new HttpException('User not found', HttpStatus.FORBIDDEN);
    }

    return res.status(HttpStatus.OK).json(req.user);
  }
}
