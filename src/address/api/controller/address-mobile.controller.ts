import { Body, Param, ParseIntPipe } from '@nestjs/common';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { AddressMobileService } from 'src/address/service/address-mobile.service';
import { CurrentUser } from 'package/decorator/authorization/user.decorator';
import { Types, User } from 'src/account/user/data/user.schema';
import { AddressValidation } from '../validation';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { GetAllAddressesMobileResponse } from '../dto/response/get-all-address-mobile.dto';
import { CreateAddress } from '../dto/request';

@AuthenticatedController({ controller: 'mobile/addresses' })
export class AddressMobileController {
  constructor(
    private readonly addressMobileService: AddressMobileService,
    private readonly addressValidation: AddressValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    role: [Types.DOCTOR],
    url: '/',
  })
  async create(@Body() body: CreateAddress, @CurrentUser() user: User) {
    this.addressValidation.create({ body });
    const created = await this.addressMobileService.create({
      ...body,
      userId: user.id,
    });
    return { id: created.id };
  }

  @AuthorizedApi({
    api: Api.GET,
    role: [Types.DOCTOR],
    url: '/',
  })
  async getAllForUser(@CurrentUser() user: User) {
    const addresses = await this.addressMobileService.findForUser(user.id);
    return addresses.map((address) => {
      return new GetAllAddressesMobileResponse({ address }).toObject();
    });
  }

  @AuthorizedApi({
    api: Api.DELETE,
    role: [Types.DOCTOR],
    url: '/:id',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    this.addressValidation.paramsId({ params: { id } });
    return await this.addressMobileService.delete({ id, userId: user.id });
  }
}
