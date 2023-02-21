import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { LogMe } from '../common/decorators/log.decorator';
import CategoryNotFoundException from './exceptions/category-not-found.exception';
import { CategoryLogic } from './logic/category.logic';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>
  ) {}

  @LogMe()
  async getAllCategories(
    organizationId: string,
    limit: number,
    skip: number
  ): Promise<{ categories: CategoryDocument[] }> {
    const query = { organizationId };

    const categories = await this.categoryModel
      .find(query)
      .skip(skip || 0)
      .limit(limit || Number.MAX_SAFE_INTEGER);

    const sortedCategories =
      CategoryLogic.sortCategoriesAlphabetically(categories);

    return {
      categories: sortedCategories,
    };
  }

  @LogMe()
  async getTotal(query: object): Promise<{ total: number }> {
    const total = await this.categoryModel.countDocuments(query);

    return {
      total,
    };
  }

  @LogMe()
  async getCategory(
    categoryId: string,
    organizationId: string
  ): Promise<{ category: CategoryDocument }> {
    const category = await this.categoryModel.findOne({
      _id: categoryId,
      organizationId,
    });

    if (!category) throw new CategoryNotFoundException();

    return { category };
  }

  @LogMe()
  async getCategoriesByIds(
    categoryIds: string[]
  ): Promise<{ categories: CategoryDocument[] }> {
    const categories = await this.categoryModel.find({
      _id: { $in: categoryIds },
    });

    return { categories };
  }
}
