import {
  Controller,
  Get,
  Headers,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { City } from './schemas/city.schema';
import { District } from './schemas/district.schema';
import { TokenHeader } from '../common/headers/token.header';
import { UserAuthGuard } from '../user/guards/user.guard';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('cities')
  @ApiOperation({ summary: 'Get all cities.' })
  @UseGuards(UserAuthGuard)
  getAllCities(@Headers() _tokenHeader: TokenHeader): Promise<City[]> {
    return this.locationService.getAllCities();
  }

  @Get('districts')
  @ApiOperation({ summary: 'Get all districts.' })
  @UseGuards(UserAuthGuard)
  getAllDiscritcts(@Headers() _tokenHeader: TokenHeader): Promise<District[]> {
    return this.locationService.getAllDistricts();
  }

  @Get('districts/city')
  @ApiOperation({ summary: 'Get districts of city.' })
  @UseGuards(UserAuthGuard)
  getDistrictsOfCity(
    @Headers() tokenHeader: TokenHeader,
    @Query('cityId') cityId: string
  ): Promise<District[]> {
    return this.locationService.getDistrictsOfCity(cityId);
  }

  @Get('cities/:cityId')
  @ApiOperation({ summary: 'Get city by id.' })
  @UseGuards(UserAuthGuard)
  getCityById(
    @Headers() tokenHeader: TokenHeader,
    @Param('cityId') cityId: string
  ): Promise<City> {
    return this.locationService.getCityById(cityId);
  }

  @Get('districts/:districtId')
  @ApiOperation({ summary: 'Get district by id.' })
  @UseGuards(UserAuthGuard)
  getDistrictById(
    @Headers() tokenHeader: TokenHeader,
    @Param('districtId') districtId: string
  ): Promise<District> {
    return this.locationService.getDistrictbyId(districtId);
  }
}
