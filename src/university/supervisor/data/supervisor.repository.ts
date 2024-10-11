import { Injectable } from '@nestjs/common';
import { SequelizeRepository } from 'package/database/typeOrm/sequelize.repository';
import { InjectModel } from '@nestjs/sequelize';
import { Supervisor } from './supervisor.schema';

@Injectable()
export class SupervisorRepository extends SequelizeRepository<Supervisor> {
  constructor(
    @InjectModel(Supervisor)
    supervisorRepository: typeof Supervisor,
  ) {
    super(supervisorRepository);
  }

  // async findFreeSupervisors() {
  //   const query = `
  //     SELECT DISTINCT(t.*) FROM supervisors t
  //     LEFT JOIN supervisor_subjects ts ON t."id" = ts."supervisorId"
  //     LEFT JOIN supervised_groups sg ON ts."supervisorId" = sg."supervisorSubjectId"
  //     WHERE ts."supervisorId" IS NULL
  //     OR sg."supervisorSubjectId" IS NULL;
  //   `;
  //   const supervisors = await Supervisor.sequelize.query(query, {
  //     type: QueryTypes.SELECT,
  //   });
  //   const query1 = `
  //     SELECT DISTINCT(t.*) FROM supervisors t
  //     LEFT JOIN supervisor_subjects ts ON t."id" = ts."supervisorId"
  //     LEFT JOIN supervised_groups sg ON ts."supervisorId" = sg."supervisorSubjectId"
  //     WHERE ts."supervisorId" IS NOT NULL
  //     OR sg."supervisorSubjectId" IS NOT NULL;
  //   `;
  //   const supervisors1 = await Supervisor.sequelize.query(query1, {
  //     type: QueryTypes.SELECT,
  //   });
  //   return {
  //     free_supervisors: supervisors,
  //     non_free_supervisors: supervisors1,
  //   };
  //   const freeSupervisors = await Supervisor.findAll({
  //     include: [
  //       {
  //         model: SupervisorSubject,
  //         required: false,
  //         include: [{ model: SupervisedGroup, required: true }],
  //       },
  //     ],
  //     where: {
  //       $subjects$: { [Op.is]: null },
  //     },
  //   });

  //   const nonFreeSupervisors = await Supervisor.findAll({
  //     include: [
  //       {
  //         model: SupervisorSubject,
  //         required: true,
  //         include: [{ model: SupervisedGroup, required: true }],
  //       },
  //     ],
  //   });
  //   return {
  //     freeSupervisors,
  //     nonFreeSupervisors,
  //   };
  // }
}
