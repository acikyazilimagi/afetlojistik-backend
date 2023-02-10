import { CategoryDocument } from '../schemas/category.schema';

export class CategoryLogic {
  static sortCategoriesAlphabetically(
    categories: CategoryDocument[]
  ): CategoryDocument[] {
    return categories.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }
}
