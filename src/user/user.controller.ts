import { Controller, Post, Body, Headers, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponse, ValidateVerificationCodeResponse } from './types';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { TokenHeader } from '../common/headers/token.header';
import { SuccessResponseDto } from 'src/common/dtos';
import { VerifyResponseDto } from './dto/response';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user.' })
  @ApiResponse({ status: HttpStatus.OK, type: SuccessResponseDto })
  login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.userService.login(loginUserDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Validate verification code.' })
  @ApiResponse({ status: HttpStatus.OK, type: VerifyResponseDto })
  validateVerificationCode(
    @Body() verifyOtpDto: VerifyOtpDto
  ): Promise<ValidateVerificationCodeResponse> {
    return this.userService.validateVerificationCode(verifyOtpDto);
  }

  @Post('verification/resend')
  @ApiOperation({ summary: 'Resend verification code.' })
  @ApiResponse({ status: HttpStatus.OK, type: SuccessResponseDto })
  resendVerificationCode(
    @Body() resendVerificationCodeDto: ResendVerificationCodeDto
  ): Promise<LoginResponse> {
    return this.userService.resendVerificationCode(resendVerificationCodeDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user.' })
  @ApiResponse({ status: HttpStatus.OK, type: SuccessResponseDto })
  logout(@Headers() tokenHeader: TokenHeader) {
    return this.userService.logout(tokenHeader.token);
  }
}
