import { Injectable } from '@nestjs/common';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { InjectModel } from '@nestjs/mongoose';
import { LogMe } from '../common/decorators/log.decorator';
import CategoryNotFoundException from './exceptions/category-not-found.exception';
import { CategoryLogic } from './logic/category.logic';

@Injectable()
export class CategoryService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>
  ) {}

  @LogMe()
  async getAllCategories(organizationId: string): Promise<CategoryDocument[]> {
    const categories: CategoryDocument[] = await this.categoryModel.find({
      organizationId,
    });

    const sortedCategories: CategoryDocument[] =
      CategoryLogic.sortCategoriesAlphabetically(categories);

    return sortedCategories;
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

  @LogMe()
  async getCategoriesByIds(categoryIds: string[]): Promise<CategoryDocument[]> {
    return this.categoryModel.find({
      _id: { $in: categoryIds },
    });
  }
}
