import { CreateUserDto } from '@presentation/dto/user.dto';
import { User } from '@prisma/client';

export interface IUserService {
  create(dto: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  find(): Promise<string>;
}
