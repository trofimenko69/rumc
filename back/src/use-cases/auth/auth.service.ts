import { MinioService } from '@infrastructure/minio/minio.service';
import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthLoginDto, AuthRegisterDto } from '@presentation/dto/auth.dto';
import { IAuthService } from '@use-cases/auth/auth.interface';
import { ITokensService } from '@use-cases/tokens/tokens.service.interface';
import { IUserService } from '@use-cases/user/user.interface';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

@Injectable()
export class AuthService implements IAuthService {
  private readonly COOKIE_DOMAIN: string;

  constructor(
    @Inject('userService')
    private readonly userService: IUserService,
    @Inject('tokensService')
    private readonly tokensService: ITokensService,
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {
    this.COOKIE_DOMAIN = this.configService.getOrThrow<string>('COOKIE_DOMAIN');
  }
  async login(
    res: Response,
    dto: AuthLoginDto,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) throw new NotFoundException('user no found');

    const isValidPassword = bcrypt.compareSync(dto.password, user.password);

    if (!isValidPassword) throw new NotFoundException('user no found');

    return this.auth(res, user.id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async recoverPassword(email: string): Promise<void> {
    return;
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const tokens = await this.tokensService.refreshTokens(refreshToken);
      const userId = tokens.id;
      return this.auth(res, userId);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(res: Response) {
    await this.setCookie(res, '', new Date(0));
  }

  async register(
    res: Response,
    dto: AuthRegisterDto,
  ): Promise<{ access_token: string }> {
    const checkUser = await this.userService.findByEmail(dto.email);
    if (checkUser) throw new BadGatewayException('email already exist');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });
    const result = await this.auth(res, user.id);
    await this.minioService.createBucket(user.id);
    return result;
  }

  private async auth(res: Response, id: string) {
    const { access_token, refresh_token } =
      this.tokensService.generateTokens(id);

    await this.setCookie(
      res,
      refresh_token,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    );

    return { access_token };
  }

  private async setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: true,
      sameSite: 'strict',
    });
  }
}
