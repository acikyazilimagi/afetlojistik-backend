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
  HttpStatus
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponse, ValidateVerificationCodeResponse } from './types';
import { ResendVerificationCodeDto } from './dto/resend-verification-code.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { TokenHeader } from '../common/headers/token.header';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schemas/user.schema';
import { AdminAuthGuard } from './guards/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';
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
    return this.userService.update(userId, updateUserDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create user.' })
  createUser(
    @Headers() tokenHeader: TokenHeader,
    @Body() updateUserDto: CreateUserDto
  ): Promise<UserDocument> {
    return this.userService.create(updateUserDto);
  }
}
