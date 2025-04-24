import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto } from '@presentation/dto/auth.dto';
import { AuthService } from '@use-cases/auth/auth.service';
import { Request, Response } from 'express';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(res: Response, @Body() dto: AuthRegisterDto) {
    return await this.authService.register(res, dto);
  }

  @Post('login')
  async login(@Body() dto: AuthLoginDto, res: Response) {
    return await this.authService.login(res, dto);
  }

  @Post('refresh')
  async refresh(req: Request, res: Response) {
    return await this.authService.refreshToken(req, res);
  }

  @Post('logout')
  async logout(res: Response) {
    return await this.authService.logout(res);
  }
}
