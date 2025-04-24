import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '@presentation/dto/user.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class AuthRegisterDto extends CreateUserDto {}
