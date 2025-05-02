import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Role, UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateUserDto implements Omit<Prisma.UserCreateInput, 'id'> {
  @IsEmail()
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'securePassword123',
  })
  password: string;

  @IsString()
  @ApiProperty({
    description: 'Полное имя пользователя',
    example: 'Иван Иванов',
  })
  fullName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Номер телефона пользователя',
    required: false,
    example: '+79991234567',
  })
  phone?: string;

  @IsEnum(Role)
  @ApiProperty({
    description: 'Роль пользователя',
    enum: Role,
    example: Role.ADMIN,
  })
  role: Role;

  @IsOptional()
  @IsJSON()
  @ApiProperty({
    description: 'Родители пользователя в формате JSON',
    required: false,
    example: { mother: 'Ирина Иванова', father: 'Сергей Иванов' },
  })
  parents?: Prisma.InputJsonValue;

  @IsEnum(UserType)
  @ApiProperty({
    description: 'Тип пользователя',
    enum: UserType,
    example: UserType.INDIVIDUAL,
  })
  type: UserType;
}
