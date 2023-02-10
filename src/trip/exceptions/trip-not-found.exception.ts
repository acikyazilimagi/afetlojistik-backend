import { NotFoundException } from '@nestjs/common';

export default class TripNotFoundException extends NotFoundException {
  constructor() {
    super('Yolculuk bulunamadı!');
  }
}
