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
      HttpStatus.BAD_REQUEST
    );
  }
}

export class TripInvalidProductException extends TMSException {
  constructor(data?: any) {
    super(
      { message: 'Girilen ürün bilgisi tanımsız!', data },
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class TripInvalidOrganizationExcetion extends TMSException {
  constructor(data?: any) {
    super(
      { message: 'Organizasyon bulunamadı', data },
      HttpStatus.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  }
}

export class TripStatusNotAllowedException extends TMSException {
  constructor(data?: any) {
    super(
      { message: 'Yolculuk icin Bu işlem yapılamaz.', data },
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class TripDriverNameNotDefinedException extends TMSException {
  constructor(data?: any) {
    super(
      { message: 'Sürücü adı tanımlı değil!', data },
      HttpStatus.BAD_REQUEST,
      HttpStatus.BAD_REQUEST
    );
  }
}

export class TripDriverPhoneNotDefinedException extends NotFoundException {
  constructor(data?: any) {
    super({ message: 'Sürücü numarası tanımlı değil!', data });
  }
}

export class TripVehiclePlateNotDefinedException extends NotFoundException {
  constructor(data?: any) {
    super({ message: 'Araç plakası tanımlı değil!', data });
  }
}