import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class IsValidUuidPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if (!isUUID(value)) {
      throw new BadRequestException(`${value} is not a valid UUID`);
    }

    return value;
  }
}
