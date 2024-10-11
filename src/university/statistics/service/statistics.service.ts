import { Injectable } from '@nestjs/common';
import { WhereOptions } from 'sequelize';
import { Appointment } from 'src/university/appointment/data/appointment.schema';
import { AppointmentService } from 'src/university/appointment/service/appointment.service';
import { Patient } from 'src/university/patient/data/patient.schema';
import { PatientService } from 'src/university/patient/service/patient.service';
import { Student } from 'src/university/student/data/student.schema';
import { StudentService } from 'src/university/student/service/student.service';
import { Teacher } from 'src/university/teacher/data/teacher.schema';
import { TeacherService } from 'src/university/teacher/service/teacher.service';

@Injectable()
export class UniversityStatisticsService {
  constructor(
    private readonly studentService: StudentService,
    private readonly patientService: PatientService,
    private readonly teacherService: TeacherService,
    private readonly appointmentService: AppointmentService,
  ) {}

  async findStudentsCount(whereOptions: WhereOptions<Student>) {
    const studentsCount = await this.studentService.countStudents(whereOptions);
    return studentsCount;
  }

  async findPatientsCount(whereOptions: WhereOptions<Patient>) {
    const patientsCount = await this.patientService.countPatients(whereOptions);
    return patientsCount;
  }

  async findTeachersCount(whereOptions: WhereOptions<Teacher>) {
    const teachersCount = await this.teacherService.countTeachers(whereOptions);
    return teachersCount;
  }

  async findAppointmentsCount(whereOptions: WhereOptions<Appointment>) {
    const appointmentsCount =
      await this.appointmentService.countAppointments(whereOptions);
    return appointmentsCount;
  }
}
