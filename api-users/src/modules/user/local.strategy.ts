import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {UserService} from "./user.service";
import {Injectable} from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor(
    private usersService: UserService) {
    super({usernameField: 'email'});
  }

  async validate(email: string, password: string): Promise<any>{
    const user = await this.usersService.authenticate({email, password});
    return user;
  }
}
