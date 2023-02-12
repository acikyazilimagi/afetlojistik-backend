import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { UserService } from '../user.service';

export class AdminAuthGuard implements CanActivate {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { payloadUser } = request.user;

    if (!payloadUser) return false;

    const user = await this.userService.getUserById(payloadUser.id);

    request.user = user;

    return user.isAdmin;
  }
}
