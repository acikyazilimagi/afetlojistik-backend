import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  GetAllDistrictsResponseDto,
  GetDistrictByIdResponseDto,
  GetDistrictsOfCityResponseDto,
} from '../dto/response';
import { District } from '../schemas/district.schema';
import { DistrictService } from '../services/district.service';

@ApiTags('District')
@Controller('location/districts')
@UseGuards(JwtAuthGuard)
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  @ApiOperation({ summary: 'Get all districts.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAllDistrictsResponseDto })
  getAllDiscritcts(): Promise<District[]> {
    return this.districtService.getAllDistricts();
  }

  @Get('city')
  @ApiOperation({ summary: 'Get districts of city.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetDistrictsOfCityResponseDto })
  getDistrictsOfCity(@Query('cityId') cityId: string): Promise<District[]> {
    return this.districtService.getDistrictsOfCity(cityId);
  }

  @Get(':districtId')
  @ApiOperation({ summary: 'Get district by id.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetDistrictByIdResponseDto })
  getDistrictById(@Param('districtId') districtId: string): Promise<District> {
    return this.districtService.getDistrictbyId(districtId);
  }
}
