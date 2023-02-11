import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  Patch,
  Put,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponse, ValidateVerificationCodeResponse } from './types';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { TokenHeader } from '../common/headers/token.header';
import { UserAuthGuard } from './guards/user.guard';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schemas/user.schema';
import { AdminAuthGuard } from './guards/admin.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user.' })
  login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.userService.login(loginUserDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Validate verification code.' })
  validateVerificationCode(
    @Body() verifyOtpDto: VerifyOtpDto
  ): Promise<ValidateVerificationCodeResponse> {
    return this.userService.validateVerificationCode(verifyOtpDto);
  }

  @Post('verification/resend')
  @ApiOperation({ summary: 'Resend verification code.' })
  resendVerificationCode(
    @Body() resendVerificationCodeDto: ResendVerificationCodeDto
  ): Promise<LoginResponse> {
    return this.userService.resendVerificationCode(resendVerificationCodeDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user.' })
  logout(@Headers() tokenHeader: TokenHeader) {
    return this.userService.logout(tokenHeader.token);
  }

  @Get()
  @ApiOperation({ summary: 'List users' })
  list() {
    return this.userService.getAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user.' })
  @UseGuards(AdminAuthGuard)
  getUser(
    @Headers() tokenHeader: TokenHeader,
    @Param('userId') userId: string
  ): Promise<UserDocument> {
    return this.userService.getUserById(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user.' })
  @UseGuards(AdminAuthGuard)
  updateUser(
    @Headers() tokenHeader: TokenHeader,
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserDocument> {
    return this.userService.updateUser(userId, updateUserDto);
  }
}
