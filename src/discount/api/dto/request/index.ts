import { GetByCriteria } from 'package/pagination/dto';
import { Category } from 'src/category/data/category.schema';

export class CreateDiscountRequest {
  code: string;
  percentage?: number;
  value?: number;
  from: string;
  to: string;
  subcategory?: number;
}
export class CreateDiscount {
  code: string;
  percentage?: number;
  value?: number;
  from: string;
  to: string;
  subcategoryId?: number;
}

export class UpdateDiscount extends CreateDiscount {
  id: number;
}

export class GetAllDiscountsQuery extends GetByCriteria {
  subcategoryId?: number;
  from?: Date;
  to?: Date;
}

export class CheckCoupon {
  code: string;
  products: {
    id: number;
    quantity: number;
    price: number;
  }[];
}
