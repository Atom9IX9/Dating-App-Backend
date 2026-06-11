/*
 * FILE: src/modules/sockets/dto/index.ts
 * PURPOSE: Barrel file re-exporting module members for easier imports.
 */

export type CreateSocketMessage = {
  text: string;
  chatRoom: string;
};
