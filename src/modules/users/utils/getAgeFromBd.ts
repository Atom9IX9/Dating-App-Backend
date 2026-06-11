/*
 * FILE: src/modules/users/utils/getAgeFromBd.ts
 * PURPOSE: TypeScript source file part of the application logic.
 */

export const getAgeByBd = (bd: string) => {
  const d1 = new Date();
  const d2 = new Date(bd);

  return d1.getFullYear() - d2.getFullYear();
};
