import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { AdsDashboardService } from 'src/ads/service/ads-dashboard.service';
import { GetAllQuestions } from '../dto/request';
import { QuestionValidation } from '../validation';
import { Params } from 'package/component/params/params';
import { Headers } from 'package/decorator/param/header.decorator';
import { IHeaders } from 'package/types/header';
import { GetByCriteriaQuestionsMobileResponse } from '../dto/response/get-all-questions-mobile.dto';
import { GetByIdQuestionMobileResponse } from '../dto/response/get-by-id-question-mobile.dto';
import { AuthorizedApi } from 'package/decorator/authorization/authorization.decorator';
import { Api } from 'package/utils/api-methods';
import { privilegeKeys } from 'src/privilege/data/privilege.schema';
import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';
import { QuestionDashboardService } from '../../service/question-dashboard.service';
import { Types } from 'src/account/user/data/user.schema';

@AuthenticatedController({
  controller: '/university/mobile/questions',
})
export class QuestionMobileController {
  constructor(
    private readonly questionService: QuestionDashboardService,
    private readonly questionValidation: QuestionValidation,
  ) {}

  @AuthorizedApi({
    api: Api.GET,
    url: '/:id',
  })
  async getOne(@Headers() { languageKey }: IHeaders, @Param() params: Params) {
    this.questionValidation.paramsId({ params });
    const question = await this.questionService.findOne(params);
    return new GetByIdQuestionMobileResponse({
      question,
      languageKey,
    }).toObject();
  }

  @AuthorizedApi({
    api: Api.GET,
    role: [Types.STUDENT, Types.TEACHER],
    url: '',
  })
  async getAll(@Headers() header: IHeaders, @Query() query: GetAllQuestions) {
    this.questionValidation.getAll({ query });
    const questions = await this.questionService.findAll();
    return {
      rows: questions.map((question) =>
        new GetByCriteriaQuestionsMobileResponse({
          question,
          languageKey: header.languageKey,
        }).toObject(),
      ),
    };
  }
}
