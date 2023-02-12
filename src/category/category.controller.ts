import {
  Controller,
  Get,
  UseGuards,
  Headers,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { UserAuthGuard } from '../user/guards/user.guard';
import { User } from '../user/decorators/user.decorator';
import { CategoryDocument } from './schemas/category.schema';
import { UserDocument } from '../user/schemas/user.schema';
import { TokenHeader } from '../common/headers/token.header';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  GetAllCategoriesResponseDto,
  GetCategoryByCategoryIdResponseDto,
} from './dto/response';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Category')
@Controller('category')
@UseGuards(JwtAuthGuard)

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  @ApiOperation({ summary: 'Get all categories.' })
  @ApiResponse({ status: HttpStatus.OK, type: GetAllCategoriesResponseDto })
  getAllCategories(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Query() { limit, skip }: PaginationDto
  ): Promise<{ data: CategoryDocument[]; total: number }> {
    const { organizationId } = user;
    console.log(JSON.stringify({ user }));
    return this.categoryService.getAllCategories(organizationId, limit, skip);
  }

  @Get(':categoryId')
  @ApiOperation({ summary: 'Get category by category id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetCategoryByCategoryIdResponseDto,
  })
  getCategory(
    @Headers() tokenHeader: TokenHeader,
    @User() user: UserDocument,
    @Param('categoryId') categoryId: string
  ): Promise<CategoryDocument> {
    const { organizationId } = user;
    return this.categoryService.getCategory(categoryId, organizationId);
  }
}
