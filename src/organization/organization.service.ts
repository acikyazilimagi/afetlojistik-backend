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
    private readonly organizationDocument: Model<OrganizationDocument>
  ) {}

  @LogMe()
  getAllOrganizations(): OrganizationDocument[] {
    return this.organizationDocument.find(
      {}
    ) as unknown as OrganizationDocument[];
  }

  @LogMe()
  getOrganizationById(organizationId: string): OrganizationDocument {
    return this.organizationDocument.findById(
      organizationId
    ) as unknown as OrganizationDocument;
  }
}
