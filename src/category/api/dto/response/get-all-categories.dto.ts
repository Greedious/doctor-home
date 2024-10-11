import { language } from 'package/utils/language/language';
import { constructFileUrl } from 'package/utils/methods';
import { Category } from 'src/category/data/category.schema';

export class GetByCriteriaCategoryResponse {
  id: number;
  name: language;
  image?: string;
  subcategories: {
    id: number;
    name: language;
  }[];

  constructor({
    category,
    languageKey,
  }: {
    category: Category;
    languageKey: string;
  }) {
    this.id = category.id;
    this.name = category.name;
    this.image = constructFileUrl(category.image.key);
    this.subcategories = category.subcategories.map((subcategory) => {
      return {
        id: subcategory.id,
        name: subcategory.name,
      };
    });
  }

  toObject(): {
    id: number;
    name: language;
    image?: string;
    subcategories: {
      id: number;
      name: language;
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
