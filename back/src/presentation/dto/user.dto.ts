import { IsEmail, IsEnum, IsJSON , IsOptional, IsString } from 'class-validator';
import { UserType , Role } from '../../../prisma/generated';


export class CreateUserDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsJSON()
  parents?: any;

  @IsEnum(UserType)
  type: UserType;

  createdAt?: Date; // Дата создания (можно не указывать, если генерируется автоматически)
  updatedAt?: Date; // Дата обновления (можно не указывать, если генерируется автоматически)
}







