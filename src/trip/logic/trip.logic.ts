import { CategoryDocument } from 'src/category/schemas/category.schema';
import { ProductDto } from '../dto/create-trip.dto';

export class TripLogic {
  static getDistinctCategoriesFromProducts(products: ProductDto[]): string[] {
    return [
      ...new Set(
        products.map<string>((product: ProductDto) =>
          product.categoryId.toString().toLowerCase()
        )
      ),
    ];
  }

  static getInvalidProductsByCategories(
    products: ProductDto[],
    categories: CategoryDocument[]
  ): ProductDto[] {
    return products.filter(
      (product) =>
        !categories.some(
          (category: CategoryDocument) =>
            product.categoryId === category._id.toString()
        )
    );
  }
}
