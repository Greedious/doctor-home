import { myDayjs } from 'package/utils/my-dayjs';
import { Review } from 'src/review/data/review.schema';

export class ReviewEntity {
  id: number;
  comment?: string | null;
  rate: number;
  user: {
    id: number;
    fullName: string;
  };

  constructor({ review }: { review: Review }) {
    this.id = review.id;
    this.comment = review.comment || null;
    this.rate = review.rate;
    this.user = {
      id: review.user.id,
      fullName:
        review.user.doctor.firstName + ' ' + review.user.doctor.lastName,
    };
  }

  toObject(): {
    id: number;
    comment?: string | null;
    rate: number;
    user: {
      id: number;
      fullName: string;
    };
  } {
    return {
      id: this.id,
      comment: this.comment,
      rate: this.rate,
      user: this.user,
    };
  }
}

class VendorWithReviewEntity {
  id: number;
  name: string;
}
