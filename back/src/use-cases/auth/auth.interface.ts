import { AuthLoginDto } from '@presentation/dto/auth.dto';
import { CreateUserDto } from '@presentation/dto/user.dto';
import { Request, Response } from 'express';

export interface IAuthService {
  register(
    res: Response,
    dto: CreateUserDto,
  ): Promise<{ access_token: string }>;
  login(res: Response, dto: AuthLoginDto): Promise<{ access_token: string }>;
  recoverPassword(email: string): Promise<void>;
  refreshToken(
    req: Request,
    res: Response,
  ): Promise<{
    access_token: string;
  }>;
  logout(res: Response): Promise<void>;
}
