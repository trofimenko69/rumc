import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ITokensService } from '@use-cases/tokens/tokens.service.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @Inject('tokensService') private tokensService: ITokensService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (!request.headers) {
      throw new UnauthorizedException('Отсутствуют заголовки запроса');
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Необходимо авторизоваться');
    }

    try {
      const decoded = await this.tokensService.verifyTokens(token);
      request.user = decoded;
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const refreshToken = request.headers['refresh-token'];
        if (!refreshToken) {
          throw new UnauthorizedException(
            'Токен истек. Необходимо авторизоваться заново',
          );
        }

        try {
          const newTokens =
            await this.tokensService.refreshTokens(refreshToken);
          request.headers.authorization = `Bearer ${newTokens.access_token}`;
          request.headers['refresh-token'] = newTokens.refresh_token;
          request.user = { id: newTokens.id };
          const result = await super.canActivate(context);
          return result as boolean;
        } catch {
          throw new UnauthorizedException('Не удалось обновить токен');
        }
      }
      throw new UnauthorizedException('Недействительный токен');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
