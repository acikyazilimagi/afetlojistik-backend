import { Injectable } from '@nestjs/common';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { InjectModel } from '@nestjs/mongoose';
import { LogMe } from '../common/decorators/log.decorator';
import CategoryNotFoundException from './exceptions/category-not-found.exception';

@Injectable()
export class CategoryService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>
  ) {}

  @LogMe()
  async getAllCategories(organizationId: string): Promise<CategoryDocument[]> {
    return this.categoryModel.find({
      organizationId,
    });
  }

  @LogMe()
  async getCategory(
    categoryId: string,
    organizationId: string
  ): Promise<CategoryDocument> {
    const category: CategoryDocument = await this.categoryModel.findOne({
      _id: categoryId,
      organizationId,
    });

    if (!category) throw new CategoryNotFoundException();

    return category;
  }
}
