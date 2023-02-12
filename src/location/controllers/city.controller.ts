import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  GetAllCitiesResponseDto,
  GetCityByIdResponseDto,
} from '../dto/response';
import { City } from '../schemas/city.schema';
import { CityService } from '../services/city.service';

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
}
