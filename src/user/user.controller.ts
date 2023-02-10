import { Controller, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponse, ValidateVerificationCodeResponse } from './types';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user.' })
  login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.userService.login(loginUserDto);
  }

  @Post('verify/:verificationCode')
  @ApiOperation({ summary: 'Validate verification code.' })
  validateVerificationCode(
    @Param('verificationCode') verificationCode: string
  ): Promise<ValidateVerificationCodeResponse> {
    return this.userService.validateVerificationCode(verificationCode);
  }

  @Post('verification/resend')
  @ApiOperation({ summary: 'Resend verification code.' })
  resendVerificationCode(
    @Body() resendVerificationCodeDto: ResendVerificationCodeDto
  ): Promise<LoginResponse> {
    return this.userService.resendVerificationCode(resendVerificationCodeDto);
  }
}
