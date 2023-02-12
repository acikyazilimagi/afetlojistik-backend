import { HttpStatus } from '@nestjs/common';
import { TMSException } from 'src/common/exceptions/tms.exception';

export class TripNotFoundException extends TMSException {
  constructor() {
    super('Yolculuk bulunamadı!', HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}

export class TripInvalidLocationException extends TMSException {
  constructor(data?: any) {
    super(
      { message: 'Girilen lokasyon bilgisi tanımsız!', data },
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}

export class TripInvalidProductException extends TMSException {
  constructor(data?: any) {
    super(
      { message: 'Girilen ürün bilgisi tanımsız!', data },
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}

export class TripInvalidOrganizationExcetion extends TMSException {
  constructor(data?: any) {
    super(
      'Organizasyon bulunamadı!',
      HttpStatus.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      data
    );
  }
}

export class TripStatusNotAllowedException extends TMSException {
  constructor(data?: any) {
    super(
      'Yolculuk icin bu işlem yapılamaz!',
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}

export class TripDriverNameNotDefinedException extends TMSException {
  constructor(data?: any) {
    super(
      'Sürücü adı tanımlı değil!',
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}

export class TripDriverPhoneNotDefinedException extends TMSException {
  constructor(data?: any) {
    super(
      'Sürücü numarası tanımlı değil!',
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}

export class TripVehiclePlateNotDefinedException extends TMSException {
  constructor(data?: any) {
    super(
      'Araç plakası tanımlı değil!',
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST,
      data
    );
  }
}
