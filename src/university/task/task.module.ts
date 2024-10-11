import { Module, forwardRef } from '@nestjs/common';
import { TaskTemplate, TaskTemplateSchema } from './data/task-template.schema';
import { TaskDashboardController } from './api/controller/task-dashboard.controller';
import { TaskMobileController } from './api/controller/task-mobile.controller';
import {
  NotesRepository,
  TaskRepository,
  TaskTemplateRepository,
} from './data/task.repository';
import { TaskDashboardService } from './service/task-dashboard.service';
import { TaskError } from './service/task-error.service';
import { TaskValidation } from './api/validation';
import { TaskService } from './service/task.service';
import { TaskMobileService } from './service/task-mobile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notes, NotesSchema, Task, TaskSchema } from './data/task.schema';
import { SubjectModule } from '../subject/subject.module';
import { TeacherModule } from '../teacher/teacher.module';
import { StudentModule } from '../student/student.module';
import { SupervisorLogModule } from '../supervisor-log/supervisor-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaskTemplate.name, schema: TaskTemplateSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Notes.name, schema: NotesSchema },
    ]),
    forwardRef(() => SubjectModule),
    forwardRef(() => TeacherModule),
    forwardRef(() => StudentModule),
    SupervisorLogModule,
  ],
  controllers: [TaskDashboardController, TaskMobileController],
  providers: [
    TaskRepository,
    NotesRepository,
    TaskTemplateRepository,
    TaskDashboardService,
    TaskError,
    TaskValidation,
    TaskService,
    TaskMobileService,
  ],
  exports: [TaskService, TaskRepository, TaskError, TaskTemplateRepository],
})
export class TaskModule {}
