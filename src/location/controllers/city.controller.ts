import {
  Controller,
  Get,
  HttpStatus,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformResponseInterceptor } from 'src/common/interceptors';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  GetAllCitiesResponseDto,
  GetCityByIdResponseDto,
  GetDistrictsOfCityResponseDto,
} from '../dto/response';
import { CityDocument } from '../schemas/city.schema';
import { District } from '../schemas/district.schema';
import { CityService } from '../services/city.service';

@ApiTags('City')
@UseInterceptors(TransformResponseInterceptor)
@Controller('location/cities')
@UseGuards(JwtAuthGuard)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cities.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAllCitiesResponseDto })
  async getAllCities(): Promise<{ cities: CityDocument[] }> {
    return await this.cityService.getAllCities();
  }

  @Get(':cityId')
  @ApiOperation({ summary: 'Get city by id.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetCityByIdResponseDto })
  async getCityById(
    @Param('cityId') cityId: string
  ): Promise<{ city: CityDocument }> {
    return await this.cityService.getCityById(cityId);
  }

  @Get(':cityId/districts')
  @ApiOperation({ summary: 'Get districts of city.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetDistrictsOfCityResponseDto })
  async getDistrictsOfCity(
    @Param('cityId') cityId: string
  ): Promise<{ districts: District[] }> {
    return await this.cityService.getDistrictsOfCity(cityId);
  }
}
