import { JwtAuthGuard } from '@infrastructure/guard/jwt.guard';
import { RoleGuard } from '@infrastructure/guard/roles.guard';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

export type TypeRole = Role;

export function Auth(role: TypeRole = Role.APPLICANT) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, new RoleGuard(new Reflector(), role)),
  );
}
