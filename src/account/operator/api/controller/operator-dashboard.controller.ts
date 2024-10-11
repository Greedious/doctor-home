import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { OperatorDashboardService } from '../../service/operator-dashboard.service';
import { CreateOperatorRequest, GetAllOperatorQuery } from '../dto/request';
import { OperatorValidation } from '../validation';
import { paginationParser } from 'package/pagination/pagination';
import { GetByCriteriaOperatorResponse } from '../dto/response/get-by-criteria-dashboard.dto';
import { OperatorFilterObject } from '../../helpers/operator-filter';
import { UserFilterObject } from 'src/account/user/helper/user-filter';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { Params } from 'package/component/params/params';
import { GetByIdOperatorResponse } from '../dto/response/get-by-id-dashboard';
import { IHeaders } from 'package/types/header';

@AuthenticatedController({ controller: 'operators' })
export class OperatorDashboardController {
  constructor(
    private readonly operatorService: OperatorDashboardService,
    private readonly operatorValidation: OperatorValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Types.SUPER_ADMIN],
    privilege: [privilegeKeys.createOperator],
  })
  @UseInterceptors(TransactionInterceptor)
  async create(
    @Body() body: CreateOperatorRequest,
    @TransactionParam() transaction: Transaction,
  ) {
    this.operatorValidation.create({ body });
    await this.operatorService.validateRole(body.role);
    const user = await this.operatorService.createUser(
      {
        username: body.username,
        password: body.password,
        role: body.role,
      },
      transaction,
    );
    const operator = await this.operatorService.create(
      {
        fullName: body.fullName,
        user,
      },
      transaction,
    );
    user.set('operator', operator);
    await user.save({ transaction });
    return { id: user.id };
  }

  // @Patch('/:id')
  // async update(@Body() body: UpdateOperator, @Param() params: Params) {
  //   this.operatorValidation.update({ body, params });
  //   await this.operatorService.update(body, params);
  // }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [privilegeKeys.viewOperator],
    role: [Types.SUPER_ADMIN],
  })
  async findAll(
    @Headers() headers: IHeaders,
    @Query() query: GetAllOperatorQuery,
  ) {
    this.operatorValidation.getAll({ query });

    const { pagination } = paginationParser(query);
    const operatorFilter = new OperatorFilterObject()
      .getFullNameLike(query.fullName)
      .build();

    const userFilter = new UserFilterObject()
      .getIsActive(query.isActive)
      .build();

    const operators = await this.operatorService.findAll(
      { operatorFilter, userFilter },
      pagination,
    );
    return {
      count: operators.count,
      rows: operators.rows.map((operator) =>
        new GetByCriteriaOperatorResponse({
          operator,
          //todo update this
          languageKey: headers.languageKey,
        }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [privilegeKeys.viewOperator],
    role: [Types.SUPER_ADMIN],
  })
  async getOne(@Headers() headers: IHeaders, @Param() params: Params) {
    this.operatorValidation.paramsId({ params });
    const operator = await this.operatorService.findOneById(+params.id);
    return new GetByIdOperatorResponse({
      operator,
      languageKey: headers.languageKey,
    });
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [privilegeKeys.viewOperator],
    role: [Types.SUPER_ADMIN],
  })
  async delete(@Param() params: Params) {
    this.operatorValidation.paramsId({ params });
    await this.operatorService.delete(+params.id);
    return;
  }
}
