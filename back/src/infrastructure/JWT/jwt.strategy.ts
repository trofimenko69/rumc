import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { IUserService } from '@use-cases/user/user.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
  implements CanActivate
{
  constructor(
    private configService: ConfigService,
    @Inject('userService') private userService: IUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET_KEY'),
    });
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async validate({ id }: { id: User['id'] }) {
    return this.userService.findById(id);
  }
}
