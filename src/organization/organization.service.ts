import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from '../common/decorators/log.decorator';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    public readonly logger: PinoLogger,
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>
  ) {}

  @LogMe()
  async getAllOrganizations(): Promise<{
    organizations: OrganizationDocument[];
  }> {
    const organizations = await this.organizationModel.find({});

    return { organizations };
  }

  @LogMe()
  async getOrganizationById(
    organizationId: string
  ): Promise<{ organization: OrganizationDocument }> {
    const organization = await this.organizationModel.findById(organizationId);

    // TODO: check is null, if true throw exception

    return { organization };
  }
}
