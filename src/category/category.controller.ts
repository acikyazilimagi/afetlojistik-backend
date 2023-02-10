import { Controller, Get, UseGuards, Headers, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { UserAuthGuard } from '../user/guards/user.guard';
import { User } from '../user/decorators/user.decorator';
import { CategoryDocument } from './schemas/category.schema';
import { UserDocument } from '../user/schemas/user.schema';
import { TokenHeader } from '../common/headers/token.header';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories.' })
  @UseGuards(UserAuthGuard)
  getAllCategories(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument
  ): Promise<CategoryDocument[]> {
    const { organizationId } = user;
    return this.categoryService.getAllCategories(organizationId);
  }

  @Get(':categoryId')
  @ApiOperation({ summary: 'Get category by category id.' })
  @UseGuards(UserAuthGuard)
  getCategory(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('categoryId') categoryId: string
  ): Promise<CategoryDocument> {
    const { organizationId } = user;
    return this.categoryService.getCategory(categoryId, organizationId);
  }
}
