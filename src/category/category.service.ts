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
  ) { }

  @LogMe()
  async getAllCategories(
    organizationId: string,
    limit: number,
    skip: number
  ): Promise<{ data: CategoryDocument[]; total: number }> {
    const query = { organizationId };

    const result = {
      data: (await this.categoryModel
        .find(query)
        .skip(skip || 0)
        .limit(
          limit || Number.MAX_SAFE_INTEGER
        )) as unknown as CategoryDocument[],

      total: (await this.categoryModel.countDocuments(
        query
      )) as unknown as number,
    };

    const sortedCategories: CategoryDocument[] =
      CategoryLogic.sortCategoriesAlphabetically(result.data);

    return {
      data: sortedCategories,
      total: result.total,
    };
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
