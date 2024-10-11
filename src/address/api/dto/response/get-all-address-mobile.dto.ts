import { Address } from 'src/address/data/address.schema';

export class GetAllAddressesMobileResponse {
  id: number;
  title: string;
  zone: string;
  street: string;
  description: string;
  building: string;
  floor: string;
  flat: string;

  constructor({
    address,
    languageKey,
  }: {
    address: Address;
    languageKey?: string;
  }) {
    this.id = address.id;
    this.title = address.zone;
    this.street = address.street;
    this.description = address.description;
    this.building = address.building;
    this.floor = address.floor;
    this.flat = address.flat;
  }

  toObject(): {
    id: number;
    title: string;
    zone: string;
    street: string;
    description: string;
    building: string;
    floor: string;
    flat: string;
  } {
    return {
      id: this.id,
      title: this.title,
      zone: this.zone,
      street: this.street,
      description: this.description,
      building: this.building,
      flat: this.flat,
      floor: this.floor,
    };
  }
}
