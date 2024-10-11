import { Body } from '@nestjs/common';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { CheckCoupon } from '../dto/request';
import { DiscountValidation } from '../validation';
import { DiscountMobileService } from 'src/discount/service/discount-mobile.service';

@AuthenticatedController({
  controller: 'mobile/discounts',
})
export class DiscountMobileController {
  constructor(
    private readonly discountService: DiscountMobileService,
    private readonly discountValidation: DiscountValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '/check',
  })
  async check(@Body() body: CheckCoupon) {
    this.discountValidation.checkCoupon({ body });
    const response = await this.discountService.checkCoupon(body);
    return response;
  }
}
