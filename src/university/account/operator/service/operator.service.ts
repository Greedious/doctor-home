import { Injectable } from '@nestjs/common';
import { UniversityOperatorRepository } from '../data/operator.repository';
import { UserService } from 'src/account/user/service/user.service';
import { universityOperatorsData } from 'src/db/seed/university-operator.data';

@Injectable()
export class UniversityOperatorService {
  constructor(
    private readonly universityOperatorRepository: UniversityOperatorRepository,
    private userService: UserService,
  ) {}
  async seed() {
    const count = await this.universityOperatorRepository.count({});
    if (count) return false;
    for (const universityOperator of universityOperatorsData) {
      const user = await this.userService.findByUsername(
        universityOperator.username,
      );
      const universityOperatorDoc =
        await this.universityOperatorRepository.create({
          doc: {
            fullName: universityOperator.fullName,
            userId: user.id,
          },
        });

      await this.userService.updateUniversityOperator(
        universityOperatorDoc.userId,
        universityOperatorDoc.id,
      );
    }
    return true;
  }
}
