/*
 * FILE: src/modules/app/app.controller.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

// NestJS class implementing AppController.
@Controller()
export class AppController {
  // Inject required services and repositories for this class.
  constructor(private readonly appService: AppService) {}
}
