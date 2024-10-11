import { Category } from '../data/category.schema';

export function filterCategory(categories: Category[]) {
  const categoriesResponse = [];
  categories.map((category) => {
    if (!category.subcategories.length) return;

    categoriesResponse.push(category);
  });

  return categoriesResponse;
}
