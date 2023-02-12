import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  GetAllCitiesResponseDto,
  GetCityByIdResponseDto,
  GetDistrictsOfCityResponseDto,
} from '../dto/response';
import { City } from '../schemas/city.schema';
import { CityService } from '../services/city.service';
import { District } from '../schemas/district.schema';

@ApiTags('City')
@Controller('location/cities')
@UseGuards(JwtAuthGuard)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cities.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAllCitiesResponseDto })
  getAllCities(): Promise<City[]> {
    return this.cityService.getAllCities();
  }
  @Get(':cityId')
  @ApiOperation({ summary: 'Get city by id.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetCityByIdResponseDto })
  getCityById(@Param('cityId') cityId: string): Promise<City> {
    return this.cityService.getCityById(cityId);
  }

  @Get(':cityId/districts')
  @ApiOperation({ summary: 'Get districts of city.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetDistrictsOfCityResponseDto })
  getDistrictsOfCity(@Param('cityId') cityId: string): Promise<District[]> {
    return this.cityService.getDistrictsOfCity(cityId);
  }
}
