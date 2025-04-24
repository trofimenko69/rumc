import { Auth } from '@common/decorators/auth.decorator';
import { Public } from '@common/decorators/public.decorator';
import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { AuthLoginDto, AuthRegisterDto } from '@presentation/dto/auth.dto';
import { IAuthService } from '@use-cases/auth/auth.interface';
import { Request, Response } from 'express';

@Controller()
export class AuthController {
  constructor(
    @Inject('authService') private readonly authService: IAuthService,
  ) {}

  @Public()
  @Post('register')
  async register(@Res() res: Response, @Body() dto: AuthRegisterDto) {
    const result = await this.authService.register(res, dto);
    return res.status(201).json(result);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: AuthLoginDto, @Res() res: Response) {
    const result = await this.authService.login(res, dto);
    return res.status(200).json(result);
  }

  @Auth()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.refreshToken(req, res);
    return res.status(200).json(result);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    const result = await this.authService.logout(res);
    return res.status(200).json(result);
  }
}
