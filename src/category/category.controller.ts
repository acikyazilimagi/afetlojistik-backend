import {
  Controller,
  Get,
  UseGuards,
  Param,
  Query,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDocument } from './schemas/category.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  GetAllCategoriesResponseDto,
  GetCategoryByCategoryIdResponseDto,
} from './dto/response';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ActiveUserAuthGuard } from 'src/auth/active-user.guard';

@ApiTags('Category')
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
