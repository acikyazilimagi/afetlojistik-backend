import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActiveUserAuthGuard } from 'src/auth/active-user.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseCommonDto, ResponsePaginationDto } from 'src/common/dtos';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { TransformResponseInterceptor } from 'src/common/interceptors';
import { CategoryService } from './category.service';
import { CategoryDocument } from './schemas/category.schema';

@ApiTags('Category')
@UseInterceptors(TransformResponseInterceptor)
@Controller('category')
@UseGuards(JwtAuthGuard, ActiveUserAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponsePaginationDto<CategoryDocument[]>,
  })
  async getAllCategories(
    @Req() req,
    @Query() { limit, skip }: PaginationDto
  ): Promise<{ categories: CategoryDocument[]; total: number }> {
    const { organizationId } = req.user;

    const getAllCategoriesPromise = this.categoryService.getAllCategories(
      organizationId,
      limit,
      skip
    );

    const getAllTotalPromise = this.categoryService.getTotal({
      organizationId,
    });

    const [{ categories }, { total }] = await Promise.all([
      getAllCategoriesPromise,
      getAllTotalPromise,
    ]);

    return { categories, total };
  }

  @Get(':categoryId')
  @ApiOperation({ summary: 'Get category by category id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseCommonDto<CategoryDocument>,
  })
  async getCategory(
    @Req() req,
    @Param('categoryId') categoryId: string
  ): Promise<{ category: CategoryDocument }> {
    const { organizationId } = req.user;

    const { category } = await this.categoryService.getCategory(
      categoryId,
      organizationId
    );

    return { category };
  }
}
