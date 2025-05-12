import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { useModalAccount } from "../../context/modal-account-context";
import { useSchedule } from "../../context/schedule-context";

export default function Cart() {
  const { state } = useLocation();
  const { movieId, hall, date, time, price, duration } = state;

  const { schedule } = useSchedule();

  const [chosenSeats, setChosenSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const { setIsModalWindowAccountOpen } = useModalAccount();
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || null;

  const formattedDate = format(new Date(date), "eeee, dd MMMM yyyy", {
    locale: enGB,
  });

  const [hours, minutes] = time.split(":").map(Number);
  const startDateTime = new Date(date);
  startDateTime.setHours(hours, minutes);

  const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

  const formattedStartTime = format(startDateTime, "HH:mm");
  const formattedEndTime = format(endDateTime, "HH:mm");

  const [movie, setMovie] = useState({});

  useEffect(() => {
    axios
      // .get(`http://localhost:5050/api/movies/${movieId}`)
      .get(`http://localhost:5000/api/movies/${movieId}`)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке фильмов:", error);
      });
  }, [movieId]);

  const handleChooseSeat = (seat) => {
    const exists = chosenSeats.some(
      (s) => s.row === seat.row && s.seat === seat.seat
    );

    if (exists) {
      setChosenSeats((prev) =>
        prev.filter((s) => !(s.row === seat.row && s.seat === seat.seat))
      );
      setTotalPrice((totalPrice) => totalPrice - price);
    } else {
      setChosenSeats((prev) => [...prev, seat]);
      setTotalPrice((totalPrice) => totalPrice + price);
    }
  };

  const handlePayment = async (e) => {
    e.stopPropagation();
    if (!token) {
      setIsModalWindowAccountOpen(true);
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: storedTotalPrice * 100,
          redirectUrl: "http://localhost:5173/",
          name: `${movie.title} - ${formattedDate}, ${formattedStartTime}–${formattedEndTime}`,
          qty: storedSeats.length,
          sum: price * 100,
          icon: movie.poster,
          userId,
          movieId,
          date,
          time,
          hall,
          seats: storedSeats,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.removeItem("chosenSeats");
        sessionStorage.removeItem("totalPrice");
        window.location.href = data.pageUrl;
      } else {
        console.error("Payment error:", data);
        alert("Помилка під час створення рахунку");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Щось пішло не так");
    }
  };

  const storedSeats = JSON.parse(sessionStorage.getItem("chosenSeats")) || [];
  const storedTotalPrice = sessionStorage.getItem("totalPrice") || 0;

  useEffect(() => {
    if (chosenSeats.length > 0) {
      sessionStorage.setItem("chosenSeats", JSON.stringify(chosenSeats));
      sessionStorage.setItem("totalPrice", totalPrice);
    }
  }, [chosenSeats, totalPrice]);

  if (!state) {
    return (
      <div className="text-white !px-3 sm:!px-6 !py-12 text-center">
        <img
          src="./assets/icons/empty-cart.svg"
          alt="empty cart icon"
          className="h-[400px] inline !mb-6"
        />
        <h1 className="!mb-10 text-4xl font-semibold">
          Looks like your cart is empty
        </h1>
        <Link
          to="/schedule"
          className="!px-5 !py-3 bg-green-500 rounded-sm transition-colors hover:bg-green-600 text-xl"
        >
          Return to schedule
        </Link>
      </div>
    );
  }

  return (
    <div className="text-white !px-3 sm:!px-6 !pb-12">
      <div className="flex gap-20">
        <img
          src={movie.poster}
          alt="movie poster"
          className="w-full md:w-[400px] object-cover"
        />
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-4xl font-bold !mb-2">{movie.title}</h1>
          <div className="flex flex-wrap gap-5">
            <div className="text-lg bg-green-700 flex items-center">
              <div className="bg-zinc-500">
                <img
                  src="./assets/icons/cinema.svg"
                  alt="hall icon"
                  className="w-20 !p-4"
                />
              </div>
              <p className="!p-4">Hall №{hall}</p>
            </div>
            <div className="text-lg bg-green-700 flex items-center">
              <div className="bg-zinc-500">
                <img
                  src="./assets/icons/calendar.png"
                  alt="calendar icon"
                  className="w-20"
                />
              </div>
              <p className="!p-4">
                {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
              </p>
            </div>
            <div className="text-lg bg-green-700 flex items-center">
              <div className="bg-zinc-500">
                <img
                  src="./assets/icons/time.png"
                  alt="time icon"
                  className="w-20 !p-3"
                />
              </div>
              <p className="!p-4">
                Time: {formattedStartTime} - {formattedEndTime}
              </p>
            </div>
            <div className="text-lg bg-green-700 flex items-center">
              <div className="bg-zinc-500">
                <img
                  src="./assets/icons/ticket.png"
                  alt="ticket icon"
                  className="w-20 !p-3"
                />
              </div>
              <p className="!p-4">Price: {price} ₴</p>
            </div>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-1 flex-col gap-2 max-w-[600px]">
              <h2 className="text-3xl font-bold text-center !mb-8 !mt-2">
                Екран
              </h2>
              {schedule.find((h) => h.hall === Number(hall))?.rows &&
                Array.from({
                  length: schedule.find((h) => h.hall === Number(hall)).rows,
                }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2">
                    {Array.from({
                      length: schedule.find((h) => h.hall === Number(hall))
                        .seatsPerRow,
                    }).map((_, seatIndex) => {
                      const isSeatOccupied = schedule
                        .find((h) => h.hall === Number(hall))
                        ?.schedule?.some((s) =>
                          s.seats.some(
                            (occupiedSeat) =>
                              occupiedSeat.row === rowIndex + 1 &&
                              occupiedSeat.seat === seatIndex + 1 &&
                              occupiedSeat.date === date
                          )
                        );
                      return (
                        <div
                          key={seatIndex}
                          onClick={() =>
                            handleChooseSeat({
                              row: rowIndex + 1,
                              seat: seatIndex + 1,
                            })
                          }
                          className={`flex-1 bg-gray-500 rounded hover:bg-green-500 cursor-pointer !py-4   ${
                            isSeatOccupied
                              ? "bg-gray-950 !cursor-not-allowed pointer-events-none"
                              : "bg-gray-500 hover:bg-green-500"
                          } ${
                            chosenSeats.some(
                              (seat) =>
                                seat.row === rowIndex + 1 &&
                                seat.seat === seatIndex + 1
                            )
                              ? "bg-red-500"
                              : ""
                          }`}
                        >
                          <span className="text-lg text-white flex justify-center items-center h-full">
                            {seatIndex + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
            <div className="!border !border-green-700 rounded-md bg-zinc-900 bg-zinc-900 text-white !p-6 rounded-xl shadow-lg h-fit">
              <h2 className="text-2xl font-semibold !mb-4">Your order</h2>
              <div className="text-lg flex flex-col gap-3">
                <div>
                  <p className="text-gray-400">Фільм</p>
                  <p className="text-base font-medium">
                    {movie?.title || "Назва фільму"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Date & Time</p>
                  <p className="text-base font-medium">
                    {formattedDate}, {formattedStartTime}–{formattedEndTime}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Hall</p>
                  <p className="text-base font-medium">№{hall}</p>
                </div>
                <div>
                  <p className="text-gray-400">Seats</p>
                  {chosenSeats.length > 0 ? (
                    <ul className="font-semibold">
                      {chosenSeats.map((seat, idx) => (
                        <li key={idx}>
                          Row {seat.row}, Seat {seat.seat}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Seats not selected</p>
                  )}
                </div>
              </div>
              <div className="!border-t !border-gray-700 !pt-2 !mt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{totalPrice} ₴</span>
                </div>
                <button
                  className="!mt-4 w-full bg-green-500 hover:bg-green-600 transition-colors !py-2 !px-4 rounded-lg font-semibold"
                  disabled={chosenSeats.length === 0}
                  onClick={handlePayment}
                >
                  Proceed to payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
