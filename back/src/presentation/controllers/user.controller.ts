import {  Controller } from '@nestjs/common';
import { UserService } from '@use-cases/user/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
}