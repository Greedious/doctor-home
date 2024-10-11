import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';
import { Privilege } from 'src/privilege/data/privilege.schema';

export class CreateSubcategoryRequest {
  name: language;
}
export class CreateCategoryRequest {
  name: language;
  image: number;
  subcategories: {
    name: language;
  }[];
}

export class UpdateCategoryRequest {
  id?: number;
  name?: language;
  image?: number;
}
export class UpdateCategory {
  name?: language;
  imageId?: number;
}

export class GetAllCategory extends GetByCriteria {
  parent: number;
}

export class GetAllCategoryMobile {
  isFeatured: boolean;
}
