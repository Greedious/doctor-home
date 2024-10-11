import { Injectable } from '@nestjs/common';
import { VendorRepository } from '../data/vendor.repository';

@Injectable()
export class VendorService {
  constructor(private readonly vendorRepository: VendorRepository) {}
}
