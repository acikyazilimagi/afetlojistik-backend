import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from '../common/decorators/log.decorator';
import { InjectModel } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrganizationService {
  constructor(
    public readonly logger: PinoLogger,
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<Organization>
  ) {}

  @LogMe()
  getAllOrganizations(): OrganizationDocument[] {
    return this.organizationModel.find({}) as unknown as OrganizationDocument[];
  }

  @LogMe()
  async getOrganizationById(
    organizationId: string
  ): Promise<OrganizationDocument> {
    return this.organizationModel.findById(
      organizationId
    ) as unknown as OrganizationDocument;
  }
}
