import { Controller, UseInterceptors } from '@nestjs/common';
import { TransformResponseInterceptor } from 'src/common/interceptors';
import { OrganizationService } from './organization.service';

@UseInterceptors(TransformResponseInterceptor)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
}
