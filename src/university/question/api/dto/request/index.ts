import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';

export class CreateQuestionRequest {
  question: language;
}

export class UpdateQuestion {
  id?: number;
  question?: language;
}

export class GetAllQuestions extends GetByCriteria {}
