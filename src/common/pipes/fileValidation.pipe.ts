import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
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