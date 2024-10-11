import { Injectable } from '@nestjs/common';
import { OperatorRepository } from '../data/operator.repository';
import { universityOperatorsData } from 'src/db/seed/university-operator.data';
import { UserService } from 'src/account/user/service/user.service';

@Injectable()
export class OperatorService {
  constructor(
    private readonly operatorRepository: OperatorRepository,
    private userService: UserService,
  ) {}
  async seed() {
    const count = await this.operatorRepository.count({});
    if (count) return false;
    for (const operator of universityOperatorsData) {
      const user = await this.userService.findByUsername(operator.username);
      const operatorDoc = await this.operatorRepository.create({
        doc: {
          fullName: operator.fullName,
          userId: user.id,
        },
      });
      await this.userService.updateOperator(operatorDoc.userId, operatorDoc.id);
    }
    return true;
  }
}
