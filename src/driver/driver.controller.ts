import { Body, Controller, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UserAuthGuard } from '../user/guards/user.guard';
import { TokenHeader } from '../common/headers/token.header';
import { User } from '../user/decorators/user.decorator';
import { UserDocument } from '../user/schemas/user.schema';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Driver')
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  create(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Body() createDriverDto: CreateDriverDto
  ) {
    const { organizationId } = user;
    return this.driverService.createDriver(createDriverDto, organizationId);
  }

  @Patch(':driverPhone')
  @UseGuards(UserAuthGuard)
  update(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('driverPhone') driverPhone: string,
    @Body() updateDriverDto: UpdateDriverDto
  ) {
    const { organizationId } = user;
    return this.driverService.updateDriver(
      driverPhone,
      updateDriverDto,
      organizationId
    );
  }
}
