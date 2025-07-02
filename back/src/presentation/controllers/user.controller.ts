import { Controller } from '@nestjs/common';
import { UserService } from '@use-cases/user/user.service';
import { IUserService } from '@use-cases/user/user.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: IUserService) {}
}
