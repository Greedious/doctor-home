import {
  privilegeKeys,
  universityPrivilegeKeys,
} from 'src/privilege/data/privilege.schema';

export const privilegesData = [
  {
    key: privilegeKeys.createRole,
    description: {
      en: 'Ability to create new role',
      ar: 'القدرة على إنشاء دور ',
    },
    name: {
      en: 'Create new role',
      ar: 'إنشاء دور ',
    },
  },
  {
    key: privilegeKeys.updateRole,
    description: {
      en: 'Ability to update role',
      ar: 'القدرة على تعديل دور ',
    },
    name: {
      en: 'Update new role',
      ar: 'تعديل دور ',
    },
  },
  {
    key: privilegeKeys.deleteRole,
    description: {
      en: 'Ability to delete new role',
      ar: 'القدرة على حذف دور ',
    },
    name: {
      en: 'Delete new role',
      ar: 'حذف دور ',
    },
  },
  {
    key: privilegeKeys.viewRole,
    description: {
      en: 'Ability to view new role',
      ar: 'القدرة على عرض دور ',
    },
    name: {
      en: 'View new role',
      ar: 'عرض دور ',
    },
  },
  //*---------------------------------
  {
    key: privilegeKeys.createOperator,
    description: {
      en: 'Ability to create new operator',
      ar: 'القدرة على إنشاء ادمن ',
    },
    name: {
      en: 'Create new operator',
      ar: 'إنشاء ادمن ',
    },
  },
  {
    key: privilegeKeys.updateOperator,
    description: {
      en: 'Ability to update operator',
      ar: 'القدرة على تعديل ادمن ',
    },
    name: {
      en: 'Update new operator',
      ar: 'تعديل ادمن ',
    },
  },
  {
    key: privilegeKeys.deleteOperator,
    description: {
      en: 'Ability to delete new operator',
      ar: 'القدرة على حذف ادمن ',
    },
    name: {
      en: 'Delete new operator',
      ar: 'حذف ادمن ',
    },
  },
  {
    key: privilegeKeys.viewOperator,
    description: {
      en: 'Ability to view new operator',
      ar: 'القدرة على عرض ادمن ',
    },
    name: {
      en: 'View new operator',
      ar: 'عرض ادمن ',
    },
  },
  //*---------------------------------
  {
    key: privilegeKeys.createAddress,
    description: {
      en: 'Ability to create new address',
      ar: 'القدرة على إنشاء عنوان جديد',
    },
    name: {
      en: 'Create new address',
      ar: 'إنشاء عنوان',
    },
  },
  {
    key: privilegeKeys.updateAddress,
    description: {
      en: 'Ability to update some of my addresses',
      ar: 'القدرة تعديل عنوان خاص بي',
    },
    name: {
      en: 'Update address',
      ar: 'تعديل عنوان',
    },
  },
  {
    key: privilegeKeys.deleteAddress,
    description: {
      en: 'Ability to delete some of my addresses',
      ar: 'القدرة على حذف عنوان خاص بي',
    },
    name: {
      en: 'Delete address',
      ar: 'حذف عنوان',
    },
  },
  {
    key: privilegeKeys.viewAddress,
    description: {
      en: 'Ability to show addresses',
      ar: 'القدرة على عرض عنوان',
    },
    name: {
      en: 'Show address',
      ar: 'عرض عنوان',
    },
  },
  //*---------------------------------
  {
    key: privilegeKeys.createProduct,
    description: {
      en: 'Ability to create new product',
      ar: 'القدرة على إنشاء منتج جديد',
    },
    name: {
      en: 'Create new product',
      ar: 'إنشاء منتج',
    },
  },
  {
    key: privilegeKeys.updateProduct,
    description: {
      en: 'Ability to update product',
      ar: 'القدرة على تعديل منتج',
    },
    name: {
      en: 'Update product',
      ar: 'تعديل منتج',
    },
  },
  {
    key: privilegeKeys.deleteProduct,
    description: {
      en: 'Ability to delete product',
      ar: 'القدرة على حذف منتج',
    },
    name: {
      en: 'Delete product',
      ar: 'حذف منتج',
    },
  },
  {
    key: privilegeKeys.viewProduct,
    description: {
      en: 'Ability to show product',
      ar: 'القدرة على عرض منج',
    },
    name: {
      en: 'Show product',
      ar: 'عرض منتج',
    },
  },
  //*-------------------------------
  {
    key: privilegeKeys.createAd,
    description: {
      en: 'Ability to create new Ad',
      ar: 'القدرة على إنشاء إعلان جديد',
    },
    name: {
      en: 'Create new Ad',
      ar: 'عرض إعلان',
    },
  },
  {
    key: privilegeKeys.updateAd,
    description: {
      en: 'Ability to update Ad',
      ar: 'القدرة على تعديل إعلان',
    },
    name: {
      en: 'Update ',
      ar: 'عرض ادمن ',
    },
  },
  {
    key: privilegeKeys.deleteAd,
    description: {
      en: 'Ability to delete Ad',
      ar: 'القدرة على حذف إعلان',
    },
    name: {
      en: 'Delete Ad',
      ar: 'حذف إعلان',
    },
  },
  {
    key: privilegeKeys.viewAd,
    description: {
      en: 'Ability to show Ad',
      ar: 'القدرة على عرض إعلان',
    },
    name: {
      en: 'Show Ad',
      ar: 'عرض إعلان',
    },
  },
  //*--------------------------------
  {
    key: privilegeKeys.createCategory,
    description: {
      en: 'Ability to create new category',
      ar: 'القدرة على إنشاء التصنيف جديد',
    },
    name: {
      en: 'Create category',
      ar: 'عرض التصنيف',
    },
  },
  {
    key: privilegeKeys.updateCategory,
    description: {
      en: 'Ability to update category',
      ar: 'القدرة على تعديل التصنيف',
    },
    name: {
      en: 'Update category',
      ar: 'عرض ادمن ',
    },
  },
  {
    key: privilegeKeys.deleteCategory,
    description: {
      en: 'Ability to delete category',
      ar: 'القدرة على حذف التصنيف',
    },
    name: {
      en: 'Delete category',
      ar: 'حذف التصنيف',
    },
  },
  {
    key: privilegeKeys.viewCategory,
    description: {
      en: 'Ability to show category',
      ar: 'القدرة على عرض التصنيف',
    },
    name: {
      en: 'Show category',
      ar: 'عرض التصنيف',
    },
  },
  //*--------------------------------
  {
    key: privilegeKeys.updateOrder,
    description: {
      en: 'Ability to update order',
      ar: 'القدرة على تعديل الطلب',
    },
    name: {
      en: 'Update order',
      ar: 'عرض طلب ',
    },
  },
  {
    key: privilegeKeys.deleteOrder,
    description: {
      en: 'Ability to delete order',
      ar: 'القدرة على حذف الطلب',
    },
    name: {
      en: 'Delete order',
      ar: 'حذف الطلب',
    },
  },
  {
    key: privilegeKeys.viewOrder,
    description: {
      en: 'Ability to show order',
      ar: 'القدرة على عرض الطلب',
    },
    name: {
      en: 'Show order',
      ar: 'عرض الطلب',
    },
  },
  //*--------------------------------
  {
    key: privilegeKeys.createDiscount,
    description: {
      en: 'Ability to create new discount',
      ar: 'القدرة على إنشاء الخصم جديد',
    },
    name: {
      en: 'Create discount',
      ar: 'عرض الخصم',
    },
  },
  {
    key: privilegeKeys.updateDiscount,
    description: {
      en: 'Ability to update discount',
      ar: 'القدرة على تعديل الخصم',
    },
    name: {
      en: 'Update discount',
      ar: 'عرض ادمن ',
    },
  },
  {
    key: privilegeKeys.deleteDiscount,
    description: {
      en: 'Ability to delete discount',
      ar: 'القدرة على حذف الخصم',
    },
    name: {
      en: 'Delete discount',
      ar: 'حذف الخصم',
    },
  },
  {
    key: privilegeKeys.viewDiscount,
    description: {
      en: 'Ability to show discount',
      ar: 'القدرة على عرض الخصم',
    },
    name: {
      en: 'Show discount',
      ar: 'عرض الخصم',
    },
  },
  //*--------------------------------
  {
    key: privilegeKeys.uploadFile,
    description: {
      en: 'Ability to upload new file',
      ar: 'رفع ملف',
    },
    name: {
      en: 'Upload file',
      ar: 'رفع ملف',
    },
  },
  //*--------------------------------*--------------------------------*
  {
    key: universityPrivilegeKeys.createOperator,
    description: {
      en: 'Ability to create new operator',
      ar: 'إضافة مدير جديد',
    },
    name: {
      en: 'Create operator',
      ar: 'إضافة مدبر',
    },
  },
  //*--------------------------------*--------------------------------*
  {
    key: universityPrivilegeKeys.createStudent,
    description: {
      en: 'Ability to create new student',
      ar: 'القدرة على إنشاء طالب جديد',
    },
    name: {
      en: 'Create student',
      ar: 'إنشاء طالب',
    },
  },
  {
    key: universityPrivilegeKeys.updateStudent,
    description: {
      en: 'Ability to update student information',
      ar: 'القدرة على تحديث معلومات الطالب',
    },
    name: {
      en: 'Update student',
      ar: 'تحديث الطالب',
    },
  },
  {
    key: universityPrivilegeKeys.deleteStudent,
    description: {
      en: 'Ability to delete a student',
      ar: 'القدرة على حذف طالب',
    },
    name: {
      en: 'Delete student',
      ar: 'حذف الطالب',
    },
  },
  {
    key: universityPrivilegeKeys.viewStudent,
    description: {
      en: 'Ability to view student information',
      ar: 'القدرة على عرض معلومات الطالب',
    },
    name: {
      en: 'View student',
      ar: 'عرض الطالب',
    },
  },
  {
    key: universityPrivilegeKeys.createSubject,
    description: {
      en: 'Ability to create new subject',
      ar: 'القدرة على إنشاء مادة جديد',
    },
    name: {
      en: 'Create subject',
      ar: 'إنشاء مادة',
    },
  },
  {
    key: universityPrivilegeKeys.updateSubject,
    description: {
      en: 'Ability to update subject information',
      ar: 'القدرة على تحديث معلومات المادة',
    },
    name: {
      en: 'Update subject',
      ar: 'تحديث المادة',
    },
  },
  {
    key: universityPrivilegeKeys.deleteSubject,
    description: {
      en: 'Ability to delete a subject',
      ar: 'القدرة على حذف مادة',
    },
    name: {
      en: 'Delete subject',
      ar: 'حذف المادة',
    },
  },
  {
    key: universityPrivilegeKeys.viewSubject,
    description: {
      en: 'Ability to view subject information',
      ar: 'القدرة على عرض معلومات المادة',
    },
    name: {
      en: 'View subject',
      ar: 'عرض المادة',
    },
  },
  //*------------------------*-----------------------

  {
    key: universityPrivilegeKeys.createYear,
    description: {
      en: 'Ability to create new year',
      ar: 'القدرة على إنشاء سنة دراسية جديدة',
    },
    name: {
      en: 'Create year',
      ar: 'إنشاء سنة دراسية',
    },
  },
  {
    key: universityPrivilegeKeys.updateYear,
    description: {
      en: 'Ability to update year information',
      ar: 'القدرة على تحديث معلومات السنة الدراسية',
    },
    name: {
      en: 'Update year',
      ar: 'تحديث السنة الدراسية',
    },
  },
  {
    key: universityPrivilegeKeys.deleteYear,
    description: {
      en: 'Ability to delete a year',
      ar: 'القدرة على حذف سنة دراسية',
    },
    name: {
      en: 'Delete year',
      ar: 'حذف السنة الدراسية',
    },
  },
  {
    key: universityPrivilegeKeys.viewYear,
    description: {
      en: 'Ability to view year information',
      ar: 'القدرة على عرض معلومات السنة الدراسية',
    },
    name: {
      en: 'View year',
      ar: 'عرض السنة الدراسية',
    },
  },
  //*------------------------*-----------------------
  {
    key: universityPrivilegeKeys.createTeacher,
    description: {
      en: 'Ability to create new teacher',
      ar: 'القدرة على إنشاء معلم جديد',
    },
    name: {
      en: 'Create teacher',
      ar: 'إنشاء معلم',
    },
  },
  {
    key: universityPrivilegeKeys.updateTeacher,
    description: {
      en: 'Ability to update teacher information',
      ar: 'القدرة على تحديث معلومات المعلم',
    },
    name: {
      en: 'Update teacher',
      ar: 'تحديث المعلم',
    },
  },
  {
    key: universityPrivilegeKeys.deleteTeacher,
    description: {
      en: 'Ability to delete a teacher',
      ar: 'القدرة على حذف معلم',
    },
    name: {
      en: 'Delete teacher',
      ar: 'حذف المعلم',
    },
  },
  {
    key: universityPrivilegeKeys.viewTeacher,
    description: {
      en: 'Ability to view teacher information',
      ar: 'القدرة على عرض معلومات المعلم',
    },
    name: {
      en: 'View teacher',
      ar: 'عرض المعلم',
    },
  },
  //*------------------------*-----------------------
  {
    key: universityPrivilegeKeys.createSupervisor,
    description: {
      en: 'Ability to create new supervisor',
      ar: 'القدرة على إنشاء دكتور جديد',
    },
    name: {
      en: 'Create supervisor',
      ar: 'إنشاء دكتور',
    },
  },
  {
    key: universityPrivilegeKeys.updateSupervisor,
    description: {
      en: 'Ability to update supervisor information',
      ar: 'القدرة على تحديث معلومات الدكتور',
    },
    name: {
      en: 'Update supervisor',
      ar: 'تحديث الدكتور',
    },
  },
  {
    key: universityPrivilegeKeys.deleteSupervisor,
    description: {
      en: 'Ability to delete a supervisor',
      ar: 'القدرة على حذف دكتور',
    },
    name: {
      en: 'Delete supervisor',
      ar: 'حذف الدكتور',
    },
  },
  {
    key: universityPrivilegeKeys.viewSupervisor,
    description: {
      en: 'Ability to view supervisor information',
      ar: 'القدرة على عرض معلومات الدكتور',
    },
    name: {
      en: 'View supervisor',
      ar: 'عرض الدكتور',
    },
  },
  //*------------------------*-----------------------
  {
    key: universityPrivilegeKeys.createGroup,
    description: {
      en: 'Ability to create a group',
      ar: 'القدرة على إنشاء مجموعة',
    },
    name: {
      en: 'Create Group',
      ar: 'إنشاء مجموعة',
    },
  },

  {
    key: universityPrivilegeKeys.updateGroup,
    description: {
      en: 'Ability to update a group',
      ar: 'القدرة على تحديث مجموعة',
    },
    name: {
      en: 'Update Group',
      ar: 'تحديث المجموعة',
    },
  },

  {
    key: universityPrivilegeKeys.deleteGroup,
    description: {
      en: 'Ability to delete a group',
      ar: 'القدرة على حذف مجموعة',
    },
    name: {
      en: 'Delete Group',
      ar: 'حذف المجموعة',
    },
  },
  {
    key: universityPrivilegeKeys.viewGroup,
    description: {
      en: 'Ability to view group information',
      ar: 'القدرة على عرض معلومات المجموعة',
    },
    name: {
      en: 'View Group',
      ar: 'عرض المجموعة',
    },
  },
  {
    key: universityPrivilegeKeys.createStatus,
    description: {
      en: 'Ability to create a status',
      ar: 'القدرة على إنشاء مجموعة',
    },
    name: {
      en: 'Create Status',
      ar: 'إنشاء مجموعة',
    },
  },

  {
    key: universityPrivilegeKeys.updateStatus,
    description: {
      en: 'Ability to update a status',
      ar: 'القدرة على تحديث مجموعة',
    },
    name: {
      en: 'Update Status',
      ar: 'تحديث المجموعة',
    },
  },

  {
    key: universityPrivilegeKeys.deleteStatus,
    description: {
      en: 'Ability to delete a status',
      ar: 'القدرة على حذف مجموعة',
    },
    name: {
      en: 'Delete Status',
      ar: 'حذف المجموعة',
    },
  },

  {
    key: universityPrivilegeKeys.viewStatus,
    description: {
      en: 'Ability to view status information',
      ar: 'القدرة على عرض معلومات المجموعة',
    },
    name: {
      en: 'View Status',
      ar: 'عرض المجموعة',
    },
  },
  {
    key: universityPrivilegeKeys.createChair,
    description: {
      en: 'Ability to create a chair',
      ar: 'القدرة على إنشاء كرسي',
    },
    name: {
      en: 'Create Chair',
      ar: 'إنشاء كرسي',
    },
  },

  {
    key: universityPrivilegeKeys.updateChair,
    description: {
      en: 'Ability to update a chair',
      ar: 'القدرة على تحديث كرسي',
    },
    name: {
      en: 'Update Chair',
      ar: 'تحديث الكرسي',
    },
  },

  {
    key: universityPrivilegeKeys.deleteChair,
    description: {
      en: 'Ability to delete a chair',
      ar: 'القدرة على حذف كرسي',
    },
    name: {
      en: 'Delete Chair',
      ar: 'حذف الكرسي',
    },
  },

  {
    key: universityPrivilegeKeys.viewChair,
    description: {
      en: 'Ability to view chair information',
      ar: 'القدرة على عرض معلومات الكرسي',
    },
    name: {
      en: 'View Status',
      ar: 'عرض الكرسي',
    },
  },
  //*------------------------*-----------------------
  {
    key: universityPrivilegeKeys.createQuestion,
    description: {
      en: 'Ability to create questions',
      ar: 'القدرة على إنشاء أسئلة',
    },
    name: {
      en: 'Create Question',
      ar: 'إنشاء سؤال',
    },
  },
  {
    key: universityPrivilegeKeys.updateQuestion,
    description: {
      en: 'Ability to update questions',
      ar: 'القدرة على تحديث الأسئلة',
    },
    name: {
      en: 'Update Question',
      ar: 'تحديث سؤال',
    },
  },
  {
    key: universityPrivilegeKeys.deleteQuestion,
    description: {
      en: 'Ability to delete questions',
      ar: 'القدرة على حذف الأسئلة',
    },
    name: {
      en: 'Delete Question',
      ar: 'حذف سؤال',
    },
  },
  {
    key: universityPrivilegeKeys.viewQuestion,
    description: {
      en: 'Ability to view questions',
      ar: 'القدرة على عرض الأسئلة',
    },
    name: {
      en: 'View Question',
      ar: 'عرض سؤال',
    },
  },
  {
    key: universityPrivilegeKeys.createSpecialty,
    description: {
      en: 'Ability to create a specialty',
      ar: 'القدرة على إنشاء تخصص',
    },
    name: {
      en: 'Create Specialty',
      ar: 'إنشاء تخصص',
    },
  },
  {
    key: universityPrivilegeKeys.updateSpecialty,
    description: {
      en: 'Ability to update a specialty',
      ar: 'القدرة على تحديث تخصص',
    },
    name: {
      en: 'Update Specialty',
      ar: 'تحديث تخصص',
    },
  },
  {
    key: universityPrivilegeKeys.deleteSpecialty,
    description: {
      en: 'Ability to delete a specialty',
      ar: 'القدرة على حذف تخصص',
    },
    name: {
      en: 'Delete Specialty',
      ar: 'حذف تخصص',
    },
  },
  {
    key: universityPrivilegeKeys.viewSpecialty,
    description: {
      en: 'Ability to view a specialty',
      ar: 'القدرة على عرض تخصص',
    },
    name: {
      en: 'View Specialty',
      ar: 'عرض تخصص',
    },
  },
  {
    key: universityPrivilegeKeys.createTask,
    description: {
      en: 'Ability to create a task',
      ar: 'القدرة على إنشاء مهمة',
    },
    name: {
      en: 'Create Task',
      ar: 'إنشاء مهمة',
    },
  },
  {
    key: universityPrivilegeKeys.updateTask,
    description: {
      en: 'Ability to update a task',
      ar: 'القدرة على تحديث مهمة',
    },
    name: {
      en: 'Update Task',
      ar: 'تحديث مهمة',
    },
  },
  {
    key: universityPrivilegeKeys.deleteTask,
    description: {
      en: 'Ability to delete a task',
      ar: 'القدرة على حذف مهمة',
    },
    name: {
      en: 'Delete Task',
      ar: 'حذف مهمة',
    },
  },
  {
    key: universityPrivilegeKeys.viewTask,
    description: {
      en: 'Ability to view a task',
      ar: 'القدرة على عرض مهمة',
    },
    name: {
      en: 'View Task',
      ar: 'عرض مهمة',
    },
  },
  //*-------------------*----------------------
  {
    key: universityPrivilegeKeys.viewPatient,
    description: {
      en: 'Ability to view a patient',
      ar: 'القدرة على عرض مريض',
    },
    name: {
      en: 'View Patient',
      ar: 'عرض مريض',
    },
  },
  //*-------------------*----------------------
  {
    key: privilegeKeys.createDeliveryArea,
    description: {
      en: 'Ability to create a delivery area',
      ar: 'القدرة على إنشاء منطقة توصيل',
    },
    name: {
      en: 'Create Delivery Area',
      ar: 'إنشاء منطقة توصيل',
    },
  },
  {
    key: privilegeKeys.updateDeliveryArea,
    description: {
      en: 'Ability to update a delivery area',
      ar: 'القدرة على تحديث منطقة توصيل',
    },
    name: {
      en: 'Update Delivery Area',
      ar: 'تحديث منطقة توصيل',
    },
  },
  {
    key: privilegeKeys.deleteDeliveryArea,
    description: {
      en: 'Ability to delete a delivery area',
      ar: 'القدرة على حذف منطقة توصيل',
    },
    name: {
      en: 'Delete Delivery Area',
      ar: 'حذف منطقة توصيل',
    },
  },
  {
    key: privilegeKeys.viewDeliveryArea,
    description: {
      en: 'Ability to view a delivery area',
      ar: 'القدرة على عرض منطقة توصيل',
    },
    name: {
      en: 'View Delivery Area',
      ar: 'عرض منطقة توصيل',
    },
  },
  //*-------------------*----------------------

  {
    key: universityPrivilegeKeys.createAppointment,
    description: {
      en: 'Ability to create an appointment',
      ar: 'القدرة على إنشاء موعد',
    },
    name: {
      en: 'Create Appointment',
      ar: 'إنشاء موعد',
    },
  },
  {
    key: universityPrivilegeKeys.updateAppointment,
    description: {
      en: 'Ability to update an appointment',
      ar: 'القدرة على تحديث موعد',
    },
    name: {
      en: 'Update Appointment',
      ar: 'تحديث موعد',
    },
  },
  {
    key: universityPrivilegeKeys.deleteAppointment,
    description: {
      en: 'Ability to delete an appointment',
      ar: 'القدرة على حذف موعد',
    },
    name: {
      en: 'Delete Appointment',
      ar: 'حذف موعد',
    },
  },
  {
    key: universityPrivilegeKeys.viewAppointment,
    description: {
      en: 'Ability to view an appointment',
      ar: 'القدرة على عرض موعد',
    },
    name: {
      en: 'View Appointment',
      ar: 'عرض موعد',
    },
  },
  {
    key: universityPrivilegeKeys.createMark,
    description: {
      en: 'Ability to create a mark',
      ar: 'القدرة على إنشاء علامة',
    },
    name: {
      en: 'Create Mark',
      ar: 'إنشاء علامة',
    },
  },
  {
    key: universityPrivilegeKeys.updateMark,
    description: {
      en: 'Ability to update a mark',
      ar: 'القدرة على تحديث علامة',
    },
    name: {
      en: 'Update Mark',
      ar: 'تحديث علامة',
    },
  },
  {
    key: universityPrivilegeKeys.deleteMark,
    description: {
      en: 'Ability to delete a mark',
      ar: 'القدرة على حذف علامة',
    },
    name: {
      en: 'Delete Mark',
      ar: 'حذف علامة',
    },
  },
  {
    key: universityPrivilegeKeys.viewMark,
    description: {
      en: 'Ability to view a mark',
      ar: 'القدرة على عرض علامة',
    },
    name: {
      en: 'View Mark',
      ar: 'عرض علامة',
    },
  },
];
