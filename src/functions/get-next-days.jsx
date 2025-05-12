export const getNextDays = (numDays = 7) => {
  const today = new Date();
  return [...Array(numDays)].map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split("T")[0];
  });
};
