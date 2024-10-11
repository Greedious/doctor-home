import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { VendorDashboardService } from '../../service/vendor-dashboard.service';
import { CreateVendorRequest, GetAllVendorQuery } from '../dto/request';
import { VendorValidation } from '../validation';
import { paginationParser } from 'package/pagination/pagination';
import { GetByCriteriaVendorResponse } from '../dto/response/get-by-criteria-dashboard.dto';
import { VendorFilterObject } from '../../helpers/vendor-filter';
import { UserFilterObject } from 'src/account/user/helper/user-filter';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';

@Controller('vendors')
export class VendorDashboardController {
  constructor(
    private readonly vendorService: VendorDashboardService,
    private readonly vendorValidation: VendorValidation,
  ) {}

  @UseInterceptors(TransactionInterceptor)
  @Post('')
  async create(
    @Body() body: CreateVendorRequest,
    @TransactionParam() transaction: Transaction,
  ) {
    this.vendorValidation.create({ body });
    const role = await this.vendorService.validateRole();
    const user = await this.vendorService.createUser(
      {
        username: body.username,
        password: body.password,
        role: role.id,
      },
      transaction,
    );
    const vendor = await this.vendorService.create(
      {
        fullName: body.fullName,
        user,
      },
      transaction,
    );
    user.set('vendor', vendor);
    await user.save({ transaction });
    return { id: user.id };
  }

  // @Patch('/:id')
  // async update(@Body() body: UpdateVendor, @Param() params: Params) {
  //   this.vendorValidation.update({ body, params });
  //   await this.vendorService.update(body, params);
  // }

  @Get('')
  // todo make type for header
  async findAll(@Query() query: GetAllVendorQuery) {
    this.vendorValidation.getAll({ query });

    const { pagination } = paginationParser(query);
    const vendorFilter = new VendorFilterObject()
      .getFullNameLike(query.fullName)
      .build();

    const userFilter = new UserFilterObject()
      .getIsActive(query.isActive)
      .build();

    const vendors = await this.vendorService.findAll(
      { vendorFilter, userFilter },
      pagination,
    );
    return {
      count: vendors.count,
      rows: vendors.rows.map((vendor) =>
        new GetByCriteriaVendorResponse({
          vendor,
          //todo update this
          languageKey: 'ar',
        }).toObject(),
      ),
    };
  }
}
