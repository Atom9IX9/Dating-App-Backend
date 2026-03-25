export const getAgeByBd = (bd: string) => {
  const d1 = new Date();
  const d2 = new Date(bd);

  return d1.getFullYear() - d2.getFullYear();
};
