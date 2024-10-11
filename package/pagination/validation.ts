import * as joi from 'joi';
import { paginationConstant } from './pagination.constant';

export const pagination = (
  needPaginationValidValues: [boolean, ...boolean[]],
) => {
  return {
    total: joi.boolean().default(paginationConstant.total),
    needPagination: joi
      .boolean()
      .required()
      .valid(...needPaginationValidValues),
    page: joi.number().min(0).default(paginationConstant.page),
    limit: joi
      .number()
      .min(0)
      .max(paginationConstant.limit.max)
      .default(paginationConstant.limit.default),
  };
};
