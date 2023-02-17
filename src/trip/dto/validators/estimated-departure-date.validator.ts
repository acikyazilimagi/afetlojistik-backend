import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint()
@Injectable()
export class NotMoreThanMonth implements ValidatorConstraintInterface {
  public async validate(estimatedDepartTime: Date) {
    const dateNow = new Date(Date.now());
    return (
      new Date(estimatedDepartTime) <=
        new Date(dateNow.setMonth(dateNow.getMonth() + 1)) &&
      new Date(estimatedDepartTime) >= new Date(Date.now())
    );
  }
}
