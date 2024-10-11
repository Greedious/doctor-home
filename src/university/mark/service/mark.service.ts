// import { Injectable } from '@nestjs/common';
// import { YearRepository } from '../data/mark.repository';
// import { YearError } from './mark-error.service';

// @Injectable()
// export class YearService {
//   constructor(
//     private readonly yearRepository: YearRepository,
//     private readonly yearError: YearError,
//   ) {}

//   async checkYear(id: number) {
//     return await this.yearRepository.findOne({
//       where: { id },
//       error: this.yearError.notFound(),
//     });
//   }
// }
