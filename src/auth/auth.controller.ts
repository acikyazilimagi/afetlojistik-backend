import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dtos';
import { User } from 'src/user/schemas';
import { AuthService } from './auth.service';
import {
  LoginUserDto,
  ResendVerificationCodeDto,
  VerifyOtpDto,
  VerifyResponseDto,
} from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user.' })
  @ApiResponse({ status: HttpStatus.OK, type: SuccessResponseDto })
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<{ success: boolean }> {
    const { success } = await this.authService.login(loginUserDto);

    return { success };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Validate verification code.' })
  @ApiResponse({ status: HttpStatus.OK, type: VerifyResponseDto })
  async validateVerificationCode(
    @Body() verifyOtpDto: VerifyOtpDto
  ): Promise<{ user: Partial<User>; token: string }> {
    const { token, user } = await this.authService.validateVerificationCode(
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
    const { success } = await this.authService.resendVerificationCode(
      resendVerificationCodeDto
    );

    return { success };
  }
}
