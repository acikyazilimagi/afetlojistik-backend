import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';
import { ERROR_META_DATAS } from 'src/constants';

export class TripNotFoundException extends TMSException {
  constructor() {
    super(
      ERROR_META_DATAS.TRIP.NOT_FOUND.message,
      ERROR_META_DATAS.TRIP.NOT_FOUND.code,
      HttpStatus.NOT_FOUND
    );
  }
}

export class TripInvalidLocationException extends TMSException {
  constructor(data?: any) {
    super(
      ERROR_META_DATAS.TRIP.INVALID_LOCATION.message,
      ERROR_META_DATAS.TRIP.INVALID_LOCATION.code,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}

export class TripInvalidProductException extends TMSException {
  constructor(data?: any) {
    super(
      ERROR_META_DATAS.TRIP.INVALID_PRODUCT.message,
      ERROR_META_DATAS.TRIP.INVALID_PRODUCT.code,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}

export class TripInvalidOrganizationExcetion extends TMSException {
  constructor(data?: any) {
    super(
      ERROR_META_DATAS.TRIP.INVALID_ORGANIZATION.message,
      ERROR_META_DATAS.TRIP.INVALID_ORGANIZATION.code,
      HttpStatus.NOT_FOUND,
      data
    );
  }
}

export class TripStatusNotAllowedException extends TMSException {
  constructor(data?: any) {
    super(
      ERROR_META_DATAS.TRIP.STATUS_NOT_ALLOWED.message,
      ERROR_META_DATAS.TRIP.STATUS_NOT_ALLOWED.code,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}

export class TripDriverNameNotDefinedException extends TMSException {
  constructor(data?: any) {
    super(
      ERROR_META_DATAS.TRIP.DRIVER_NAME_NOT_DEFINED.message,
      ERROR_META_DATAS.TRIP.DRIVER_NAME_NOT_DEFINED.code,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}

export class TripDriverPhoneNotDefinedException extends TMSException {
  constructor(data?: any) {
    super(
      ERROR_META_DATAS.TRIP.DRIVER_PHONE_NOT_DEFINED.message,
      ERROR_META_DATAS.TRIP.DRIVER_PHONE_NOT_DEFINED.code,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}

export class TripVehiclePlateNotDefinedException extends TMSException {
  constructor(data?: any) {
    super(
      ERROR_META_DATAS.TRIP.VEHICLE_PLATE_NOT_DEFINED.message,
      ERROR_META_DATAS.TRIP.VEHICLE_PLATE_NOT_DEFINED.code,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}
