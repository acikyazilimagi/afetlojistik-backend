import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { UserService } from '../user.service';

export class AdminAuthGuard implements CanActivate {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { token } = request.headers;

    if (!token) return false;

    const user = await this.userService.validateToken(token);

    request.user = user;

    return user.isAdmin;
  }
}
