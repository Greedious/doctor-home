import { myDayjs } from 'package/utils/my-dayjs';
import { Discount } from 'src/discount/data/discount.schema';

export class DiscountEntity {
  id: number;
  percentage?: number;
  value?: number;
  code: string;
  from: string;
  to: string;

  constructor({ discount }: { discount: Discount }) {
    const { code, percentage, value, from, to } = discount;
    this.id = discount.id;
    this.percentage = percentage;
    this.value = value;
    this.code = code;
    this.from = myDayjs(from).format();
    this.to = myDayjs(to).format();
  }

  toObject() {
    return {
      id: this.id,
      code: this.code,
      percentage: this.percentage,
      value: this.value,
      from: this.from,
      to: this.to,
    };
  }
}

class VendorWithDiscountEntity {
  id: number;
  name: string;
}
