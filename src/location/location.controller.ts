import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { City } from './schemas/city.schema';
import { District } from './schemas/district.schema';
import {
  GetAllCitiesResponseDto,
  GetAllDistrictsResponseDto,
  GetCityByIdResponseDto,
  GetDistrictByIdResponseDto,
  GetDistrictsOfCityResponseDto,
} from './dto/response';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ActiveUserAuthGuard } from 'src/auth/active-user.guard';

@ApiTags('Location')
@Controller('location')
@UseGuards(JwtAuthGuard, ActiveUserAuthGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('cities')
  @ApiOperation({ summary: 'Get all cities.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAllCitiesResponseDto })
  getAllCities(): Promise<City[]> {
    return this.locationService.getAllCities();
  }

  @Get('districts')
  @ApiOperation({ summary: 'Get all districts.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAllDistrictsResponseDto })
  getAllDiscritcts(): Promise<District[]> {
    return this.locationService.getAllDistricts();
  }

  @Get('districts/city')
  @ApiOperation({ summary: 'Get districts of city.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetDistrictsOfCityResponseDto })
  getDistrictsOfCity(@Query('cityId') cityId: string): Promise<District[]> {
    return this.locationService.getDistrictsOfCity(cityId);
  }

  @Get('cities/:cityId')
  @ApiOperation({ summary: 'Get city by id.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetCityByIdResponseDto })
  getCityById(@Param('cityId') cityId: string): Promise<City> {
    return this.locationService.getCityById(cityId);
  }

  @Get('districts/:districtId')
  @ApiOperation({ summary: 'Get district by id.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetDistrictByIdResponseDto })
  getDistrictById(@Param('districtId') districtId: string): Promise<District> {
    return this.locationService.getDistrictbyId(districtId);
  }
}
