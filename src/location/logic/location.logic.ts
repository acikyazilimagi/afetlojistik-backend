import { CityDocument } from '../schemas/city.schema';
import { DisctrictDocument } from '../schemas/district.schema';

export class LocationLogic {
  static sortCitiesAlphabetically(cities: CityDocument[]): CityDocument[] {
    return cities.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  static sortDistrictsAlphabetically(
    districts: DisctrictDocument[]
  ): DisctrictDocument[] {
    return districts.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }
}
