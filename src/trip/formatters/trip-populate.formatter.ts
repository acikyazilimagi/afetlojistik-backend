import { TripDocument } from '../schemas/trip.schema';

type PopulateIds = {
  categoryIds: string[];
  cityIds: string[];
  districtIds: string[];

  userIds: string[];
};

export default class TripFormatter {
  getPopulateIds = (trips: TripDocument[]): PopulateIds => {
    const initialValue = {
      cityIds: [],
      districtIds: [],
      categoryIds: [],
      userIds: [],
    };

    const mappedTrips = trips.map((trip) => ({
      cityIds: [trip.toLocation.cityId, trip.fromLocation.cityId],
      districtIds: [trip.toLocation.districtId, trip.fromLocation.districtId],
      categoryIds: trip.products.map((product) => product.categoryId),
      userId: [
        trip.createdBy,
        ...trip.statusChangeLog.map((log) => log.createdBy),
      ],
    }));

    return mappedTrips.reduce((acc, data) => {
      acc.cityIds = [...acc.cityIds, ...data.cityIds];
      acc.districtIds = [...acc.districtIds, ...data.districtIds];
      acc.categoryIds = [...acc.categoryIds, ...data.categoryIds];
      acc.userIds = [...acc.userIds, ...data.userId];
      return acc;
    }, initialValue);
  };

  populateTrip = (
    trip: TripDocument,
    cities,
    districts,
    categories,
    users
  ) => ({
    ...trip,
    toLocation: {
      ...trip.toLocation,
      cityName: cities.find(
        (city) => city._id.toString() === trip.toLocation.cityId.toString()
      )?.name,
      districtName: districts.find(
        (district) =>
          district._id.toString() === trip.toLocation.districtId.toString()
      )?.name,
    },
    fromLocation: {
      ...trip.fromLocation,
      cityName: cities.find(
        (city) => city._id.toString() === trip.fromLocation.cityId.toString()
      )?.name,
      districtName: districts.find(
        (district) =>
          district._id.toString() === trip.fromLocation.districtId.toString()
      )?.name,
    },
    products: trip.products.map((product) => ({
      ...product,
      categoryName: categories.find(
        (category) => category._id.toString() === product.categoryId.toString()
      )?.name,
    })),
    createdBy: users.find(
      (user) => user._id.toString() === trip.createdBy.toString()
    ),
    statusChangeLog: trip.statusChangeLog.map((log) => ({
      ...log,
      createdBy: users.find(
        (user) => user._id.toString() === log.createdBy.toString()
      ),
    })),
  });
}
