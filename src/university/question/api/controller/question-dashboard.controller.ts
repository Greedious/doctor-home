import { Body, Param, Query, UsePipes } from '@nestjs/common';
import {
  CreateQuestionRequest,
  GetAllQuestions,
  UpdateQuestion,
} from '../dto/request';
import { QuestionValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { universityPrivilegeKeys } from 'src/privilege/data/privilege.schema';
import { Types } from 'src/account/user/data/user.schema';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { GetByIdQuestionDashboardResponse } from '../dto/response/get-by-id-question-dashboard.dto';
import { GetByCriteriaQuestionsDashboardResponse } from '../dto/response/get-all-questions-dashboard.dto';
import { QuestionDashboardService } from '../../service/question-dashboard.service';
import { ModifyPayloadPipe } from 'package/decorator/modify-payload';

@AuthenticatedController({
  controller: '/university/questions',
})
export class QuestionDashboardController {
  constructor(
    private readonly questionService: QuestionDashboardService,
    private readonly questionValidation: QuestionValidation,
  ) {}

  @AuthorizedApi({
    api: Api.POST,
    url: '',
    privilege: [universityPrivilegeKeys.createQuestion],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async create(@Body() body: CreateQuestionRequest) {
    this.questionValidation.create({ body });
    return await this.questionService.create(body);
  }

  @AuthorizedApi({
    api: Api.PATCH,
    url: '/:id',
    privilege: [universityPrivilegeKeys.updateQuestion],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async update(@Body() body: UpdateQuestion, @Param() params: Params) {
    this.questionValidation.update({ body, params });
    await this.questionService.findOneById(params.id);
    return await this.questionService.update(body, +params.id);
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
    privilege: [universityPrivilegeKeys.viewQuestion],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    this.questionValidation.paramsId({ params });
    const question = await this.questionService.findOne(params);
    return new GetByIdQuestionDashboardResponse({
      question,
      languageKey,
    }).toObject();
  }

  @AuthorizedApi({
    api: Api.GET,
    url: '',
    privilege: [universityPrivilegeKeys.viewQuestion],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async getAll(@Headers() header: IHeaders, @Query() query: GetAllQuestions) {
    this.questionValidation.getAll({ query });
    const ads = await this.questionService.findAll();
    return {
      rows: ads.map((question) =>
        new GetByCriteriaQuestionsDashboardResponse({
          question: question,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }

  @AuthorizedApi({
    api: Api.DELETE,
    url: '/:id',
    privilege: [universityPrivilegeKeys.deleteQuestion],
    role: [Types.UNIVERSITY_SUPER_ADMIN, Types.UNIVERSITY_ADMIN],
  })
  async delete(@Param() params: Params) {
    this.questionValidation.paramsId({ params });
    await this.questionService.findOneById(params.id);
    await this.questionService.delete(+params.id);
    return;
  }
}
