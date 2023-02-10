import { TripDocument } from '../schemas/trip.schema';

type PopulateIds = {
  categoryIds: string[];
  cityIds: string[];
  districtIds: string[];
};

export default class TripFormatter {
  getPopulateIds = (trips: TripDocument[]): PopulateIds => {
    const initialValue = { cityIds: [], districtIds: [], categoryIds: [] };

    const mappedTrips = trips.map((trip) => ({
      cityIds: [trip.toLocation.cityId, trip.fromLocation.cityId],
      districtIds: [trip.toLocation.districtId, trip.fromLocation.districtId],
      categoryIds: trip.products.map((product) => product.categoryId),
    }));

    return mappedTrips.reduce((acc, data) => {
      acc.cityIds = [...acc.cityIds, ...data.cityIds];
      acc.districtIds = [...acc.districtIds, ...data.districtIds];
      acc.categoryIds = [...acc.categoryIds, ...data.categoryIds];
      return acc;
    }, initialValue);
  };

  populateTrip = (trip: TripDocument, cities, districts, categories) => ({
    ...trip,
    toLocation: {
      ...trip.toLocation,
      cityName: cities.find(
        (city) => city._id.toString() === trip.toLocation.cityId.toString()
      ).name,
      districtName: districts.find(
        (district) =>
          district._id.toString() === trip.toLocation.districtId.toString()
      ).name,
    },
    fromLocation: {
      ...trip.fromLocation,
      cityName: cities.find(
        (city) => city._id.toString() === trip.fromLocation.cityId.toString()
      ).name,
      districtName: districts.find(
        (district) =>
          district._id.toString() === trip.fromLocation.districtId.toString()
      ).name,
    },
    products: trip.products.map((product) => ({
      ...product,
      categoryName: categories.find(
        (category) => category._id.toString() === product.categoryId.toString()
      ).name,
    })),
  });
}
