import { PrismaService } from '@infrastructure/db/prisma.service';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@presentation/dto/user.dto';
import { User } from '@prisma/client';
import { IUserService } from '@use-cases/user/user.interface';
import bcrypt from 'bcrypt';
@Injectable() // Добавлены скобки
export class UserService implements IUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<User> {
    // Логика для поиска пользователя по email
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new BadGatewayException('user not exist');

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new BadGatewayException('user not exist');

    return user;
  }

  async find() {
    // Логика для получения всех пользователей
    return ''; // Верните строку или другую информацию
  }

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prismaService.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });
  }
}
