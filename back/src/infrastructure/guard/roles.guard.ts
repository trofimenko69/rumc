import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private requiredRoles: Role[], // Изменено: теперь принимает массив ролей

  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (!user) {
      return false; // Изменено: Возвращает false, если пользователь не найден
    }

    // Проверка, есть ли у пользователя одна из требуемых ролей
    if (!this.requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'У вас недостаточно прав для выполнения этой операции',
      );
    }


    return true;
  }
}

export function createRoleGuard(role: Role) {
  return {
    provide: 'ROLE_GUARD',
    useFactory: (reflector: Reflector) => new RoleGuard(reflector, [role]),
    inject: [Reflector],
  };
}
