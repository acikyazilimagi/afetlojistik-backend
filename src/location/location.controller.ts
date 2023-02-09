import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CityDocument } from './schemas/city.schema';
import { DisctrictDocument, District } from './schemas/district.schema';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('cities')
  @ApiOperation({ summary: 'Get all cities.' })
  getAllCities(): Promise<CityDocument[]> {
    return this.locationService.getAllCities();
  }

  @Get('districts')
  @ApiOperation({ summary: 'Get all districts.' })
  getAllDiscritcts(): Promise<DisctrictDocument[]> {
    return this.locationService.getAllDiscritcts();
  }

  @Get('cities/:cityId')
  @ApiOperation({ summary: 'Get city by id.' })
  getCityById(@Param('cityId') cityId: string): Promise<CityDocument> {
    return this.locationService.getCityById(cityId);
  }

  @Get('districts/:districtId')
  @ApiOperation({ summary: 'Get district by id.' })
  getDistrictById(
    @Param('districtId') districtId: string
  ): Promise<DisctrictDocument> {
    return this.locationService.getDistrictbyId(districtId);
  }
}
