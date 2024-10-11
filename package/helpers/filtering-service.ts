import { JObject } from 'package/utils/interfaces';
import { Op } from 'sequelize';

interface IWhereOptionsBuilder {
  equals(key: string, value: number | string | boolean): FilterService;
  substringLangObject(key: string, value: string): FilterService;
  substring(key: string, value: string): FilterService;
  notEquals(key: string, value: number | string | boolean): FilterService;
  get(): any;
}
const opKeys = {
  and: Op.and as unknown as string,
  or: Op.or as unknown as string,
};

export class FilterService implements IWhereOptionsBuilder {
  constructor() {}

  result: JObject = {
    [opKeys.and]: [],
    [opKeys.or]: [],
  };

  notEquals(key: string, value: number | string | boolean) {
    this.result[opKeys.and].push({
      [key]: {
        [Op.ne]: value,
      },
    });
    return this;
  }

  equals(key: string, value: number | string | boolean) {
    this.result[opKeys.and].push({
      [key]: value,
    });
    return this;
  }
  substringLangObject(key: string, value: string) {
    this.result[opKeys.or].push({
      [`${key}.en`]: {
        [Op.substring]: value,
      },
    });
    this.result[opKeys.or].push({
      [`${key}.ar`]: {
        [Op.substring]: value,
      },
    });
    return this;
  }

  substring(key: string, value: string) {
    this.result[opKeys.or].push({
      [key]: {
        [Op.substring]: value,
      },
    });
    return this;
  }

  get() {
    const options: any = {};
    if (this.result[opKeys.and].length)
      options[opKeys.and] = this.result[opKeys.and];
    if (this.result[opKeys.or].length)
      options[opKeys.or] = this.result[opKeys.or];
    return options;
  }
}
