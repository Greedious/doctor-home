import { Injectable } from '@nestjs/common';
import * as joi from 'joi';
import { JoiValidationPipe } from 'package/validation/joi.pips';
import { GetByCriteria } from 'package/pagination/dto';
import { pagination } from 'package/pagination/validation';
import { GetPrivilegesCriteria, PrivilegeTypeEnum } from '../dto/request';

@Injectable()
export class PrivilegeValidation {
  getAll({ query }: { query: GetPrivilegesCriteria }) {
    const getAll = joi.object({
      ...pagination([false, true]),
      type: joi
        .string()
        .allow(...Object.values(PrivilegeTypeEnum))
        .optional(),
    });

    return new JoiValidationPipe(getAll).transform(query);
  }
}
