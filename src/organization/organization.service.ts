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
  async getAllOrganizations(): Promise<OrganizationDocument[]> {
    return await this.organizationModel.find({});
  }

  @LogMe()
  async getOrganizationById(
    organizationId: string
  ): Promise<OrganizationDocument> {
    return this.organizationModel.findById(organizationId);
  }
}
