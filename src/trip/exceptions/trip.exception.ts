import { NotFoundException } from '@nestjs/common';

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
