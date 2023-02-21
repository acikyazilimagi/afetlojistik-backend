import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActiveUserAuthGuard } from 'src/auth/active-user.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SuccessResponseDto } from 'src/common/dtos';
import { TransformResponseInterceptor } from 'src/common/interceptors';
import { AdminAuthGuard } from '../auth/admin.guard';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserBodyDto } from './dto/filter-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';
import { VerifyResponseDto } from './dto/response';
import { FilterUsersResponseDto } from './dto/response/filter-users.response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

@UseInterceptors(TransformResponseInterceptor)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user.' })
  @ApiResponse({ status: HttpStatus.OK, type: SuccessResponseDto })
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<{ success: boolean }> {
    const { success } = await this.userService.login(loginUserDto);

    return { success };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Validate verification code.' })
  @ApiResponse({ status: HttpStatus.OK, type: VerifyResponseDto })
  async validateVerificationCode(
    @Body() verifyOtpDto: VerifyOtpDto
  ): Promise<{ user: Partial<User>; token: string }> {
    const { token, user } = await this.userService.validateVerificationCode(
      verifyOtpDto
    );

    return { token, user };
  }

  @Post('verification/resend')
  @ApiOperation({ summary: 'Resend verification code.' })
  @ApiResponse({ status: HttpStatus.OK, type: SuccessResponseDto })
  async resendVerificationCode(
    @Body() resendVerificationCodeDto: ResendVerificationCodeDto
  ): Promise<{ success: boolean }> {
    const { success } = await this.userService.resendVerificationCode(
      resendVerificationCodeDto
    );

    return { success };
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminAuthGuard, ActiveUserAuthGuard)
  @ApiOperation({ summary: 'List users' })
  async list(): Promise<{ users: UserDocument[] }> {
    const { users } = await this.userService.getAll();

    return { users };
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user.' })
  @UseGuards(JwtAuthGuard, AdminAuthGuard, ActiveUserAuthGuard)
  async getUser(
    @Param('userId') userId: string
  ): Promise<{ user: UserDocument }> {
    const { user } = await this.userService.getUserById(userId);

    return { user };
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user.' })
  @UseGuards(JwtAuthGuard, AdminAuthGuard, ActiveUserAuthGuard)
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<{ user: UserDocument }> {
    const { user } = await this.userService.update(userId, updateUserDto);

    return { user };
  }

  @Post()
  @ApiOperation({ summary: 'Create user.' })
  async createUser(
    @Body() updateUserDto: CreateUserDto
  ): Promise<{ user: UserDocument }> {
    const { user } = await this.userService.create(updateUserDto);

    return { user };
  }

  @UseGuards(JwtAuthGuard, ActiveUserAuthGuard)
  @Post('filter')
  @ApiOperation({ summary: 'Filter users.' })
  @ApiOkResponse({
    description: 'Filtered users',
    type: FilterUsersResponseDto,
  })
  async filterUsers(
    @Req() req,
    @Body() filterTripDto: FilterUserBodyDto,
    @Query() { limit, skip }: PaginationDto
  ): Promise<{ data: UserDocument[]; total: number }> {
    const { organizationId } = req.user;
    const { data, total } = await this.userService.filterUsers({
      ...filterTripDto,
      organizationId,
      limit,
      skip,
    });

    return { data, total };
  }
}
