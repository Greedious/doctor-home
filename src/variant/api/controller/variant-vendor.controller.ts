import { Body, Param, ParseIntPipe } from '@nestjs/common';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { VariantVendorService } from 'src/variant/service/variant-dashboard.service';
import { CreateVariant, UpdateVariant } from '../dto/request';
import { VariantValidation } from '../validation';

@AuthenticatedController({
  controller: 'variants',
})
export class VariantVendorController {
  constructor(
    private readonly variantDashboardService: VariantVendorService,
    private readonly variantValidation: VariantValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '/',
    role: [Types.VENDOR],
  })
  async create(@Body() body: CreateVariant) {
    this.variantValidation.create({ body });
    await this.variantDashboardService.create(body);
    return;
  }

  @AuthorizedApi({
    api: Api.PUT,
    url: '/',
    role: [Types.VENDOR],
  })
  async update(@Body() body: UpdateVariant) {
    this.variantValidation.update({ body });
    await this.variantDashboardService.update(body);
    return;
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    role: [Types.VENDOR],
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.variantDashboardService.delete(id);
    return;
  }
}
