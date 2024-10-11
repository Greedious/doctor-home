import { myDayjs } from 'package/utils/my-dayjs';
import { Review } from 'src/review/data/review.schema';

export class GetAllReviewMobileDto {
  id: number;
  comment?: string | null;
  rate: number;
  user: {
    id: number;
    name: string;
  };
  date: Date;

  constructor({ review }: { review: Review }) {
    this.id = review.id;
    this.comment = review.comment || null;
    this.rate = review.rate;
    this.date = review.createdAt;
    this.user = {
      id: review.user.id,
      name: review.user.doctor.firstName + review.user.doctor.lastName,
    };
  }

  toObject(): {
    id: number;
    comment?: string | null;
    rate: number;
    user: {
      id: number;
      name: string;
    };
    date: Date;
  } {
    return {
      id: this.id,
      comment: this.comment,
      rate: this.rate,
      user: this.user,
      date: this.date,
    };
  }
}
