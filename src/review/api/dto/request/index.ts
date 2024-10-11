import { GetByCriteria } from 'package/pagination/dto';

export class CreateReviewRequest {
  comment: string;
  rate: number;
  product: number;
}
export class CreateReview {
  comment: string;
  rate: number;
  productId: number;
}

export class UpdateReview extends CreateReview {
  id: number;
}

export class GetAllReviewsQuery extends GetByCriteria {
  product?: number;
  user?: number;
}

export class CheckCoupon {
  code: string;
  products: {
    id: number;
    quantity: number;
    price: number;
  }[];
}
