import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      catchError((err) => {
        if (
          err instanceof UnauthorizedException &&
          this.isAccessTokenExpired(err)
        ) {
          const refreshToken = request.cookies?.refreshToken;
          if (!refreshToken) {
            return throwError(
              () => new UnauthorizedException('Refresh token is missing'),
            );
          }

          return from(this.refreshToken(refreshToken)).pipe(
            switchMap((newTokens) => {
              response.cookie('refreshToken', newTokens.refresh_token, {
                httpOnly: true,
                domain: process.env.COOKIE_DOMAIN,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                secure: true,
                sameSite: 'strict',
              });

              request.headers.authorization = `Bearer ${newTokens.access_token}`;
              return next.handle();
            }),
            catchError(() =>
              throwError(
                () => new UnauthorizedException('Invalid refresh token'),
              ),
            ),
          );
        }

        return throwError(() => err);
      }),
    );
  }

  private isAccessTokenExpired(error: UnauthorizedException): boolean {
    return error.message === 'Access token expired';
  }

  private async refreshToken(refreshToken: string): Promise<any> {
    try {
      const response = await axios.post(
        'http://localhost:4200/authrefresh',
        {},
        {
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh token');
    }
  }
}
