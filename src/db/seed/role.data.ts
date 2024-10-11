import { Types } from 'src/account/user/data/user.schema';
import {
  privilegeKeys,
  universityPrivilegeKeys,
} from 'src/privilege/data/privilege.schema';

export enum adminPrivileges {
  createRole = 'createRole',
  updateRole = 'updateRole',
  deleteRole = 'deleteRole',
  viewRole = 'viewRole',

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

export const rolesData = [
  {
    name: {
      en: 'Super Admin',
      ar: 'المدير الأعلى',
    },
    role: Types.SUPER_ADMIN,
    builtIn: true,
    privileges: [...Object.values(privilegeKeys)],
  },
  {
    name: {
      en: 'Doctor',
      ar: 'دكتور',
    },
    role: Types.DOCTOR,
    builtIn: true,
    privileges: [],
  },

  {
    name: {
      en: 'Admin',
      ar: 'المدير',
    },
    role: Types.ADMIN,
    builtIn: true,
    privileges: [...Object.values(adminPrivileges)],
  },

  {
    name: {
      en: 'Vendor',
      ar: 'البائع',
    },
    role: Types.VENDOR,
    builtIn: true,
    privileges: [],
  },
  {
    name: {
      en: 'University Super Admin',
      ar: 'مدير الجامعة الأعلى',
    },
    role: Types.UNIVERSITY_SUPER_ADMIN,
    builtIn: true,
    privileges: [...Object.values(universityPrivilegeKeys)],
  },
  {
    name: {
      en: 'University Admin',
      ar: 'مدير الجامعة',
    },
    role: Types.UNIVERSITY_ADMIN,
    builtIn: true,
    privileges: [...Object.values(universityPrivilegeKeys)],
  },
];
