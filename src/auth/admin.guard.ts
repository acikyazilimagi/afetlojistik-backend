import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';

export class AdminAuthGuard implements CanActivate {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.userService.getUserById(request.user.id);

    request.user = user;

    return user.isAdmin;
  }
}
