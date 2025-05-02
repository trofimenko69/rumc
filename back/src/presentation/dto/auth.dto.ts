import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '@presentation/dto/user.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'securePassword123',
  })
  password: string;
}

export class AuthRegisterDto extends CreateUserDto {}
