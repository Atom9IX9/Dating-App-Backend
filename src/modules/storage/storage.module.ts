/*
 * FILE: src/modules/storage/storage.module.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { multerOptions } from "./multer.options";
import { StorageService } from "./storage.service";

@Module({
  imports: [MulterModule.register(multerOptions)],
  providers: [StorageService],
  exports: [StorageService],
})
// NestJS class implementing StorageModule.
export class StorageModule {}
