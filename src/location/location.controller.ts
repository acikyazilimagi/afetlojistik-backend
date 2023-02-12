import {
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { City } from './schemas/city.schema';
import { District } from './schemas/district.schema';
import { TokenHeader } from '../common/headers/token.header';
import {
  GetAllCitiesResponseDto,
  GetAllDistrictsResponseDto,
  GetCityByIdResponseDto,
  GetDistrictByIdResponseDto,
  GetDistrictsOfCityResponseDto,
} from './dto/response';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Location')
@Controller('location')
@UseGuards(JwtAuthGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('cities')
  @ApiOperation({ summary: 'Get all cities.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAllCitiesResponseDto })
  getAllCities(@Headers() _tokenHeader: TokenHeader): Promise<City[]> {
    return this.locationService.getAllCities();
  }

  @Get('districts')
  @ApiOperation({ summary: 'Get all districts.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAllDistrictsResponseDto })
  getAllDiscritcts(@Headers() _tokenHeader: TokenHeader): Promise<District[]> {
    return this.locationService.getAllDistricts();
  }

  @Get('districts/city')
  @ApiOperation({ summary: 'Get districts of city.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetDistrictsOfCityResponseDto })
  getDistrictsOfCity(
    @Headers() tokenHeader: TokenHeader,
    @Query('cityId') cityId: string
  ): Promise<District[]> {
    return this.locationService.getDistrictsOfCity(cityId);
  }

  @Get('cities/:cityId')
  @ApiOperation({ summary: 'Get city by id.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetCityByIdResponseDto })
  getCityById(
    @Headers() tokenHeader: TokenHeader,
    @Param('cityId') cityId: string
  ): Promise<City> {
    return this.locationService.getCityById(cityId);
  }

  @Get('districts/:districtId')
  @ApiOperation({ summary: 'Get district by id.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetDistrictByIdResponseDto })
  getDistrictById(
    @Headers() tokenHeader: TokenHeader,
    @Param('districtId') districtId: string
  ): Promise<District> {
    return this.locationService.getDistrictbyId(districtId);
  }
}
