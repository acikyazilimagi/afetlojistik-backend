import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

export class TripNotFoundException extends NotFoundException {
  constructor() {
    super('Yolculuk bulunamadı!');
  }
}

export class TripInvalidLocationException extends NotFoundException {
  constructor(data?: any) {
    super({ message: 'Girilen lokasyon bilgisi tanımsız!', data });
  }
}

export class TripInvalidProductException extends NotFoundException {
  constructor(data?: any) {
    super({ message: 'Girilen ürün bilgisi tanımsız!', data });
  }
}

export class TripInvalidOrganizationExcetion extends NotFoundException {
  constructor(data?: any) {
    super({ message: 'Organizasyon bulunamadı', data });
  }
}

export class TripStatusNotAllowedException extends HttpException {
  constructor(data?: any) {
    super(
      { message: 'Yolculuk icin Bu işlem yapılamaz.', data },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class TripDriverNameNotDefinedException extends NotFoundException {
  constructor(data?: any) {
    super({ message: 'Sürücü adı tanımlı değil!', data });
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