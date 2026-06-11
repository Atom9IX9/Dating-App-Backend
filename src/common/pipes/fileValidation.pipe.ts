/*
 * FILE: src/common/pipes/fileValidation.pipe.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

// NestJS class implementing FileValidationPipe.
@Injectable()
export class FileValidationPipe implements PipeTransform {
  // Inject required services and repositories for this class.
  constructor(
    private readonly options: {
      maxSize?: number;
      mimeTypes?: string[];
    } = {},
  ) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (this.options.maxSize && file.size > this.options.maxSize) {
      throw new BadRequestException('File is too large');
    }

    if (
      this.options.mimeTypes &&
      !this.options.mimeTypes.includes(file.mimetype)
    ) {
      throw new BadRequestException('Invalid file type');
    }

    return file;
  }
}