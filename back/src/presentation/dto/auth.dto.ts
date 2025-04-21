import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '@presentation/dto/user.dto';

export class AuthLoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class AuthRegisterDto extends CreateUserDto {}



