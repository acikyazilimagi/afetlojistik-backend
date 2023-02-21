import { CityDocument } from '../schemas/city.schema';
import { DistrictDocument } from '../schemas/district.schema';

export class LocationLogic {
  static sortCitiesAlphabetically(cities: CityDocument[]): CityDocument[] {
    return cities.sort(function (a, b) {
      return a.name.localeCompare(b.name, 'tr');
    });
  }

  static sortDistrictsAlphabetically(
    districts: DistrictDocument[]
  ): DistrictDocument[] {
    return districts.sort(function (a, b) {
      return a.name.localeCompare(b.name, 'tr');
    });
  }
}
