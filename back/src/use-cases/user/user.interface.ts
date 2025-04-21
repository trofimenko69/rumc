import { User } from '@prisma/client';

export interface IUserService {
  findByEmail(email: string):  Promise<User>;
  findById(id: string):  Promise<User>;
  find();
}