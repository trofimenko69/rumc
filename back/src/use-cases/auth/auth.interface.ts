import { Response, Request } from 'express';
import { AuthLoginDto } from '@presentation/dto/auth.dto';
import { CreateUserDto } from '@presentation/dto/user.dto';

export interface IAuthService {
  register(res: Response, dto: CreateUserDto): Promise<{ access_token: string }> ;
  login(res: Response, dto: AuthLoginDto): Promise<{ access_token: string }>;
  recoverPassword(email: string): Promise<void>;
  refreshToken(req: Request, res: Response);
  logout(res: Response);
}