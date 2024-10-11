import { language } from 'package/utils/language/language';
import { constructFileUrl } from 'package/utils/methods';
import { Ads } from 'src/ads/data/ads.schema';

export class GetByCriteriaAdsMobileResponse {
  id: number;
  url?: string;
  description?: string;
  image: string;

  constructor({ ads, languageKey }: { ads: Ads; languageKey: string }) {
    this.id = ads.id;
    this.url = ads?.url;
    this.image = constructFileUrl(ads.image.key);
    this.description = ads.description?.[languageKey];
  }

  toObject(): {
    id: number;
    url?: string;
    image: string;
    description?: string;
  } {
    return {
      id: this.id,
      url: this.url,
      image: this.image,
      description: this.description,
    };
  }
}
