import { Vendor } from 'src/account/vendor/data/vendor.schema';

export class GetByCriteriaVendorResponse {
  id: number;
  username: string;
  type: string;
  fullName: string;
  isActive: boolean;
  role: {
    id: number;
    name: string;
  };

  constructor({
    vendor,
    languageKey,
  }: {
    vendor: Vendor;
    languageKey: string;
  }) {
    this.id = vendor.user.id;
    this.username = vendor.user.username;
    this.isActive = vendor.user.isActive;
    this.type = vendor.user.type;
    this.fullName = vendor.fullName;
    this.role = {
      id: vendor.user.role.id,
      name: vendor.user.role.name[languageKey],
    };
  }

  toObject(): {
    id: number;
    username: string;
    type: string;
    fullName: string;
    isActive: boolean;
    role: {
      id: number;
      name: string;
    };
  } {
    return {
      id: this.id,
      username: this.username,
      isActive: this.isActive,
      type: this.type,
      role: this.role,
      fullName: this.fullName,
    };
  }
}
