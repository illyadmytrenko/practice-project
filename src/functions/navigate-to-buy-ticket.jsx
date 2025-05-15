export const navigateToBuyTicket = (
  navigate,
  movieId,
  hall,
  date,
  time,
  price,
  duration
) => {
  navigate("/cart", { state: { movieId, hall, date, time, price, duration } });
};
