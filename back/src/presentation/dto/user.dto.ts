import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Role, UserType } from '@prisma/client';
import { IsEmail, IsEnum, IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateUserDto implements Omit<Prisma.UserCreateInput, 'id'> {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  fullName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phone?: string;

  @IsEnum(Role)
  @ApiProperty()
  role: Role;

  @IsOptional()
  @IsJSON()
  @ApiProperty()
  parents?: any;

  @IsEnum(UserType)
  @ApiProperty()
  type: UserType;
}
