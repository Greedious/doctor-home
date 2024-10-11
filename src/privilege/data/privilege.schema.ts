import { language } from 'package/utils/language/language';
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Role, RolePrivilege } from 'src/role/data/role.schema';

export enum privilegeKeys {
  createRole = 'createRole',
  updateRole = 'updateRole',
  deleteRole = 'deleteRole',
  viewRole = 'viewRole',

  createOperator = 'createOperator',
  updateOperator = 'updateOperator',
  deleteOperator = 'deleteOperator',
  viewOperator = 'viewOperator',

  createAddress = 'createAddress',
  updateAddress = 'updateAddress',
  deleteAddress = 'deleteAddress',
  viewAddress = 'viewAddress',

  createProduct = 'createProduct',
  updateProduct = 'updateProduct',
  deleteProduct = 'deleteProduct',
  viewProduct = 'viewProduct',
  addProductToFavorites = 'addProductToFavorites',

  createAd = 'createAd',
  updateAd = 'updateAd',
  deleteAd = 'deleteAd',
  viewAd = 'viewAd',

  createCategory = 'createCategory',
  updateCategory = 'updateCategory',
  deleteCategory = 'deleteCategory',
  viewCategory = 'viewCategory',

  createDiscount = 'createDiscount',
  updateDiscount = 'updateDiscount',
  deleteDiscount = 'deleteDiscount',
  viewDiscount = 'viewDiscount',

  createOrder = 'createOrder',
  updateOrder = 'updateOrder',
  deleteOrder = 'deleteOrder',
  viewOrder = 'viewOrder',

  createReview = 'createReview',
  updateReview = 'updateReview',
  deleteReview = 'deleteReview',
  viewReview = 'viewReview',

  createDeliveryArea = 'createDeliveryArea',
  updateDeliveryArea = 'updateDeliveryArea',
  deleteDeliveryArea = 'deleteDeliveryArea',
  viewDeliveryArea = 'viewDeliveryArea',

  uploadFile = 'uploadFile',
}

export enum universityPrivilegeKeys {
  createOperator = 'university-createOperator',
  updateOperator = 'university-updateOperator',
  viewOperator = 'university-viewOperator',
  deleteOperator = 'university-deleteOperator',

  createSubject = 'university-createSubject',
  updateSubject = 'university-updateSubject',
  viewSubject = 'university-viewSubject',
  deleteSubject = 'university-deleteSubject',

  createStudent = 'university-createStudent',
  updateStudent = 'university-updateStudent',
  deleteStudent = 'university-deleteStudent',
  viewStudent = 'university-viewStudent',

  createTeacher = 'university-createTeacher',
  updateTeacher = 'university-updateTeacher',
  deleteTeacher = 'university-deleteTeacher',
  viewTeacher = 'university-viewTeacher',

  createYear = 'university-createYear',
  updateYear = 'university-updateYear',
  deleteYear = 'university-deleteYear',
  viewYear = 'university-viewYear',

  createGroup = 'university-createGroup',
  updateGroup = 'university-updateGroup',
  deleteGroup = 'university-deleteGroup',
  viewGroup = 'university-viewGroup',

  createSpecialty = 'university-createSpecialty',
  updateSpecialty = 'university-updateSpecialty',
  deleteSpecialty = 'university-deleteSpecialty',
  viewSpecialty = 'university-viewSpecialty',

  createQuestion = 'university-createQuestion',
  updateQuestion = 'university-updateQuestion',
  deleteQuestion = 'university-deleteQuestion',
  viewQuestion = 'university-viewQuestion',

  createChair = 'university-createChair',
  updateChair = 'university-updateChair',
  deleteChair = 'university-deleteChair',
  viewChair = 'university-viewChair',

  createStatus = 'university-createStatus',
  updateStatus = 'university-updateStatus',
  deleteStatus = 'university-deleteStatus',
  viewStatus = 'university-viewStatus',

  createTask = 'university-createTask',
  updateTask = 'university-updateTask',
  deleteTask = 'university-deleteTask',
  viewTask = 'university-viewTask',

  viewPatient = 'university-viewPatient',

  createAppointment = 'university-createAppointment',
  updateAppointment = 'university-updateAppointment',
  deleteAppointment = 'university-deleteAppointment',
  viewAppointment = 'university-viewAppointment',

  createSupervisor = 'university-createSupervisor',
  updateSupervisor = 'university-updateSupervisor',
  deleteSupervisor = 'university-deleteSupervisor',
  viewSupervisor = 'university-viewSupervisor',

  createMark = 'university-createMark',
  updateMark = 'university-updateMark',
  deleteMark = 'university-deleteMark',
  viewMark = 'university-viewMark',
}
@Table({
  tableName: 'privileges',
  modelName: 'Privilege',
})
export class Privilege extends Model<Privilege> {
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  key: privilegeKeys | universityPrivilegeKeys;

  @Column({
    type: DataType.JSONB,
    defaultValue: { en: '', ar: '' },
  })
  name: language;

  @Column({
    type: DataType.JSONB,
    defaultValue: { en: '', ar: '' },
  })
  description: language;

  @BelongsToMany(() => Role, () => RolePrivilege)
  roles: Role[];
}
