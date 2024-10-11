import { Body, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { UniversityOperatorDashboardService } from '../../service/operator-dashboard.service';
import {
  CreateUniversityOperatorRequest,
  GetAllUniversityOperatorQuery,
} from '../dto/request';
import { UniversityOperatorValidation } from '../validation';
import { paginationParser } from 'package/pagination/pagination';
import { GetByCriteriaUniversityOperatorResponse } from '../dto/response/get-by-criteria-dashboard.dto';
import { UniversityOperatorFilterObject } from '../../helpers/operator-filter';
import { UserFilterObject } from 'src/account/user/helper/user-filter';
import { TransactionParam } from 'package/decorator/param/transaction.decorator';
import { Transaction } from 'sequelize';
import { TransactionInterceptor } from 'package/database/transaction/transaction.interceptor';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { Types } from 'src/account/user/data/user.schema';

@AuthenticatedController({ controller: '/university/operators' })
export class UniversityOperatorDashboardController {
  constructor(
    private readonly universityOperatorService: UniversityOperatorDashboardService,
    private readonly universityOperatorValidation: UniversityOperatorValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
    privilege: [],
  })
  @UseInterceptors(TransactionInterceptor)
  async create(
    @Body() body: CreateUniversityOperatorRequest,
    @TransactionParam() transaction: Transaction,
  ) {
    this.universityOperatorValidation.create({ body });
    await this.universityOperatorService.validateRole(body.role);
    const user = await this.universityOperatorService.createUser(
      {
        username: body.username,
        password: body.password,
        role: body.role,
      },
      transaction,
    );
    const universityOperator = await this.universityOperatorService.create(
      {
        fullName: body.fullName,
        user,
      },
      transaction,
    );
    user.set('universityOperator', universityOperator);
    await user.save({ transaction });
    return { id: user.id };
  }

  // @Patch('/:id')
  // async update(@Body() body: UpdateUniversityOperator, @Param() params: Params) {
  //   this.universityOperatorValidation.update({ body, params });
  //   await this.universityOperatorService.update(body, params);
  // }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    role: [Types.UNIVERSITY_ADMIN, Types.UNIVERSITY_SUPER_ADMIN],
  })
  async findAll(@Query() query: GetAllUniversityOperatorQuery) {
    this.universityOperatorValidation.getAll({ query });

    const { pagination } = paginationParser(query);
    const universityOperatorFilter = new UniversityOperatorFilterObject()
      .getFullNameLike(query.fullName)
      .build();

    const userFilter = new UserFilterObject()
      .getIsActive(query.isActive)
      .build();

    const universityOperators = await this.universityOperatorService.findAll(
      { universityOperatorFilter, userFilter },
      pagination,
    );
    return {
      count: universityOperators.count,
      rows: universityOperators.rows.map((universityOperator) =>
        new GetByCriteriaUniversityOperatorResponse({
          universityOperator,
          //todo update this
          languageKey: 'ar',
        }).toObject(),
      ),
    };
  }
}
