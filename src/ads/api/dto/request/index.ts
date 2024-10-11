import { GetByCriteria } from 'package/pagination/dto';
import { language } from 'package/utils/language/language';

export class CreateAdsRequest {
  url: string;
  image: number;
  description: language;
}

export class UpdateAdsRequest {
  id?: number;
  url?: string;
  image: number;
  description?: language;
}
export class UpdateAds {
  url?: string;
  imageId: number;
  description?: language;
}

export class GetAllAds extends GetByCriteria {
  parent: number;
}
