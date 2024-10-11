import { language } from 'package/utils/language/language';
import { constructFileUrl } from 'package/utils/methods';
import { Ads } from 'src/ads/data/ads.schema';

export class GetByCriteriaAdsDashboardResponse {
  id: number;
  url?: string;
  description?: language;
  image: string;

  constructor({ ads, languageKey }: { ads: Ads; languageKey: string }) {
    this.id = ads.id;
    this.url = ads?.url;
    this.image = constructFileUrl(ads.image.key);
    this.description = ads?.description;
  }

  toObject(): {
    id: number;
    url?: string;
    image: string;
    description?: language;
  } {
    return {
      id: this.id,
      url: this.url,
      image: this.image,
      description: this.description,
    };
  }
}
