import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ITokensService, TTokens } from './tokens.service.interface';

@Injectable()
export class TokensService implements ITokensService {
  private readonly JWT_SECRET: string;
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_SECRET = this.configService.getOrThrow<string>('JWT_SECRET_KEY');
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
  }

  generateTokens(userId: User['id']): TTokens {
    const payload = { id: userId };
    const access_token = this.jwtService.sign(payload, {
      secret: this.JWT_SECRET,
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.JWT_SECRET,
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });
    return { id: userId, access_token, refresh_token };
  }

  verifyTokens(token: string): Promise<TTokens> {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET_KEY'),
    });
    return Promise.resolve(decoded);
  }

  decodeTokens(token: string): Promise<TTokens> {
    const decoded = this.jwtService.decode(token);
    return Promise.resolve(decoded);
  }

  async refreshTokens(refreshToken: string): Promise<TTokens> {
    try {
      const payload = await this.verifyTokens(refreshToken);
      return this.generateTokens(payload.id);
    } catch {
      throw new UnauthorizedException('Недействительный refresh token');
    }
  }
}
