import {IsNotEmpty} from 'class-validator';


export class AuthRequestDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
