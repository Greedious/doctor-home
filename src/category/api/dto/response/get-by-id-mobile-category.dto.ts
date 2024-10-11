import { Category } from 'src/category/data/category.schema';

export class GetByIdCategoryMobileResponse {
  id: number;
  name: string;
  image: string;
  subcategories: {
    id: number;
    name: string;
  }[];

  constructor({
    category,
    languageKey,
  }: {
    category: Category;
    languageKey: string;
  }) {
    this.id = category.id;
    this.name = category.name[languageKey || 'ar'];
    this.image = category.image.key;
    this.subcategories = category.subcategories.map((subcategory) => {
      return {
        id: subcategory.id,
        name: subcategory.name[languageKey || 'ar'],
      };
    });
  }

  toObject(): {
    id: number;
    name: string;
    image?: string;
    subcategories: {
      id: number;
      name: string;
    }[];
  } {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
      subcategories: this.subcategories,
    };
  }
}
