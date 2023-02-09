import { Controller, Get, Headers, Param, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CityDocument } from './schemas/city.schema';
import { DisctrictDocument } from './schemas/district.schema';
import { TokenHeader } from '../common/headers/token.header';
import { UserAuthGuard } from '../user/guards/user.guard';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('cities')
  @ApiOperation({ summary: 'Get all cities.' })
  @UseGuards(UserAuthGuard)
  getAllCities(@Headers() tokenHeader: TokenHeader): Promise<CityDocument[]> {
    return this.locationService.getAllCities();
  }

  @Get('districts')
  @ApiOperation({ summary: 'Get all districts.' })
  @UseGuards(UserAuthGuard)
  getAllDiscritcts(
    @Headers() tokenHeader: TokenHeader
  ): Promise<DisctrictDocument[]> {
    return this.locationService.getAllDiscritcts();
  }

  @Get('cities/:cityId')
  @ApiOperation({ summary: 'Get city by id.' })
  @UseGuards(UserAuthGuard)
  getCityById(
    @Headers() tokenHeader: TokenHeader,
    @Param('cityId') cityId: string
  ): Promise<CityDocument> {
    return this.locationService.getCityById(cityId);
  }

  @Get('districts/:districtId')
  @ApiOperation({ summary: 'Get district by id.' })
  @UseGuards(UserAuthGuard)
  getDistrictById(
    @Headers() tokenHeader: TokenHeader,
    @Param('districtId') districtId: string
  ): Promise<DisctrictDocument> {
    return this.locationService.getDistrictbyId(districtId);
  }
}
