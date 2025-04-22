import { isDev } from '@common/utils';
import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto, AuthRegisterDto } from '@presentation/dto/auth.dto';
import { IAuthService } from '@use-cases/auth/auth.interface';
import { JwtPayload } from '@use-cases/auth/jwt.interface';
import { IUserService } from '@use-cases/user/user.interface';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

@Injectable()
export class AuthService implements IAuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;

  private readonly COOKIE_DOMAIN: string;

  constructor(
    @Inject('userService')
    private readonly userService: IUserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_SECRET = configService.getOrThrow<string>('JWT_SECRET');
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );

    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }
  async login(
    res: Response,
    dto: AuthLoginDto,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) throw new NotFoundException('user no found');

    const isValidPassword = bcrypt.compareSync(dto.password, user.password); // true

    if (!isValidPassword) throw new NotFoundException('user no found');

    return this.auth(res, user.id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async recoverPassword(email: string): Promise<void> {
    return;
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token not found');

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);
    if (payload) {
      const user = await this.userService.findById(payload.id);
      if (!user) throw new NotFoundException('No user found');

      return this.auth(res, user.id);
    }
  }

  async logout(res: Response) {
    this.setCookie(res, 'refresh_token', new Date(0));
  }

  async register(
    res: Response,
    dto: AuthRegisterDto,
  ): Promise<{ access_token: string }> {
    const checkUser = await this.userService.findByEmail(dto.email);
    if (checkUser) throw new BadGatewayException('email already exist');

    const user = await this.userService.create(dto);

    return this.auth(res, user.id);
  }

  private auth(res: Response, id: string) {
    const { access_token, refresh_token } = this.generateTokens(id);
    this.setCookie(
      res,
      refresh_token,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    );
    return { access_token };
  }

  private generateTokens(id: string) {
    const payload: JwtPayload = { id };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });

    return { access_token, refresh_token };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(),
      sameSite: !isDev() ? 'none' : 'lax',
    });
  }
}
