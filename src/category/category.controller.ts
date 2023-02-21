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
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { TransformResponseInterceptor } from 'src/common/interceptors';
import { CategoryService } from './category.service';
import {
  GetAllCategoriesResponseDto,
  GetCategoryByCategoryIdResponseDto,
} from './dto/response';
import { CategoryDocument } from './schemas/category.schema';

@ApiTags('Category')
@UseInterceptors(TransformResponseInterceptor)
@Controller('category')
@UseGuards(JwtAuthGuard, ActiveUserAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAllCategoriesResponseDto })
  getAllCategories(
    @Req() req,
    @Query() { limit, skip }: PaginationDto
  ): Promise<{ data: CategoryDocument[]; total: number }> {
    const { organizationId } = req.user;
    return this.categoryService.getAllCategories(organizationId, limit, skip);
  }

  @Get(':categoryId')
  @ApiOperation({ summary: 'Get category by category id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCategoryByCategoryIdResponseDto,
  })
  getCategory(
    @Req() req,
    @Param('categoryId') categoryId: string
  ): Promise<CategoryDocument> {
    const { organizationId } = req.user;
    return this.categoryService.getCategory(categoryId, organizationId);
  }
}
