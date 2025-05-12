import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { useMovies } from "../../context/movies-context";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { goToMovie } from "../../functions/go-to-movie";
import MoviePosterWithoutInfo from "../../components/movie-poster-without-info/movie-poster-without-info";

export default function PersonalAccount() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const { movies } = useMovies();
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored?.id) {
      navigate("/");
      return;
    }

    axios.get("http://localhost:5000/api/users").then((res) => {
      const foundUser = res.data.find((u) => u.id === stored.id);
      setUser(foundUser);
    });
  }, [navigate]);

  useEffect(() => {
    if (!user || !movies.length || !user.tickets) return;

    const watchedMovieIds = user.tickets.map((t) => t.movieId.toString());
    const watchedMovies = movies.filter((m) =>
      watchedMovieIds.includes(m.id.toString())
    );

    const allGenres = new Set();
    const allCountries = new Set();

    watchedMovies.forEach((movie) => {
      movie.genre?.forEach((g) => allGenres.add(g.toLowerCase()));
      if (movie.country) allCountries.add(movie.country.toLowerCase());
    });

    const recommended = movies
      .filter((m) => {
        if (watchedMovieIds.includes(m.id.toString())) return false;

        const genres = Array.isArray(m.genre)
          ? m.genre.map((g) => g.toLowerCase())
          : [];

        const countries = Array.isArray(m.country)
          ? m.country.map((c) => c.toLowerCase())
          : typeof m.country === "string"
          ? [m.country.toLowerCase()]
          : [];

        const genreMatch = genres.some((g) => allGenres.has(g));
        const langMatch = countries.some((c) => allCountries.has(c));

        return genreMatch || langMatch;
      })
      .slice(0, 4);

    setRecommendedMovies(recommended);
  }, [user, movies]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleDownload = async (ticket, movie) => {
    const doc = new jsPDF({ orientation: "landscape" });

    for (let i = 0; i < 210; i++) {
      const ratio = i / 210;
      const green = Math.floor(60 * (1 - ratio));
      const black = Math.floor(0);

      for (let j = 0; j < 297; j += 3) {
        doc.setFillColor(0, green, 0 + black);
        doc.rect(j, i, 3, 1, "F");
      }
    }

    const marginLeft = 20;
    const imageWidth = 100;
    const imageHeight = 140;
    const contentLeft = marginLeft + imageWidth + 30;
    const topY = 30;
    const lineHeight = 10;

    doc.setFont("courier", "bold");
    doc.setFontSize(36);
    doc.setTextColor(255);
    doc.text("Movie Ticket", contentLeft, topY);

    doc.setFont("courier", "normal");
    doc.setFontSize(18);
    let currentY = topY + lineHeight * 2;
    doc.text(`Title: ${movie.originalTitle}`, contentLeft, currentY);
    currentY += lineHeight;
    doc.text(`Genre: ${movie.genre?.join(", ") || "-"}`, contentLeft, currentY);
    currentY += lineHeight;
    doc.text(
      `Language: ${movie.language || "Ukrainian"}`,
      contentLeft,
      currentY
    );
    currentY += lineHeight;
    doc.text(`Date: ${ticket.date}`, contentLeft, currentY);
    currentY += lineHeight;
    doc.text(`Time: ${ticket.time}`, contentLeft, currentY);
    currentY += lineHeight;
    doc.text(
      `Seat: Row ${ticket.row}, Seat ${ticket.seat}`,
      contentLeft,
      currentY
    );
    currentY += lineHeight;
    doc.text(`Hall: ${ticket.hall}`, contentLeft, currentY);

    const qrText = `${movie.originalTitle} | ${ticket.date} ${ticket.time} | Row ${ticket.row}, Seat ${ticket.seat}`;
    const qrDataUrl = await QRCode.toDataURL(qrText);
    doc.addImage(
      qrDataUrl,
      "PNG",
      contentLeft,
      topY + imageHeight - 50,
      50,
      50
    );

    if (movie.poster) {
      try {
        const imgData = await loadImageAsBase64(movie.poster);
        doc.addImage(
          imgData,
          "JPEG",
          marginLeft,
          topY,
          imageWidth,
          imageHeight
        );
      } catch (err) {
        console.warn("Image load failed:", err);
      }
    }

    doc.setDrawColor(255);
    doc.setLineDash([2, 2], 0);
    doc.line(marginLeft, 190, 277, 190);
    doc.setLineDash();

    doc.setFontSize(10);
    doc.text("movietime.com", marginLeft, 200);
    doc.text("Email: support@movietime.com", 120, 200);
    doc.text("Phone: +38 (050) 123-45-67", 220, 200);

    doc.save(`${movie.originalTitle}-ticket.pdf`);
  };

  const loadImageAsBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -325, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 325, behavior: "smooth" });
  };

  const getMovieById = (id) =>
    movies.find((m) => m.id.toString() === id.toString());

  if (!user) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="text-white !px-3 sm:!px-6 !pb-12 flex flex-col gap-10">
      <h2 className="text-4xl font-bold text-white">Personal Information</h2>

      <div className="bg-white/5 border border-white/20 rounded-2xl !py-3 !px-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-10 w-fit ">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {user.name[0]}
          </div>

          <div>
            <div className="!mb-2 mt-2">
              <p className="text-sm text-gray-400 leading-none !pb-1! ">Name</p>
              <p className="text-2xl font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 leading-none !pb-1">Email</p>
              <p className="text-lg text-white">{user.email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-green-600 hover:bg-green-700 text-white !py-4 !px-8 rounded-lg text-xl font-semibold transition-colors"
        >
          Log out
        </button>
      </div>

      <div className="w-full">
        <h2 className="text-4xl font-bold text-white !mb-6">Your Tickets</h2>

        {user.tickets && user.tickets.length > 0 ? (
          <div className="flex items-center justify-center gap-4 w-full">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full shadow disabled:opacity-30"
            >
              <span className="text-2xl font-bold !pr-1">&#x276E;</span>
            </button>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto no-scrollbar w-full !px-2"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {user.tickets.map((ticket, index) => {
                const movie = getMovieById(ticket.movieId) || {};
                return (
                  <div
                    key={index}
                    className="w-[300px] flex-shrink-0 border border-white bg-white/10 backdrop-blur-sm rounded-2xl !px-6 !py-6 text-left text-xl flex flex-col gap-4"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <div>
                      <p className="text-sm text-gray-300 mb-1">Date</p>
                      <p>
                        {format(new Date(ticket.date), "d MMMM yyyy, eeee", {
                          locale: enGB,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 mb-1">Movie Title</p>
                      <p className="font-bold">{movie.title || "Movie"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 mb-1">Ticket</p>
                      <p>
                        Row {ticket.row}, Seat {ticket.seat}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300 mb-1">Time</p>
                      <p>{ticket.time}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(ticket, movie)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white !py-2 rounded-lg text-lg font-semibold"
                    >
                      Download Ticket
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={scrollRight}
              className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full shadow disabled:opacity-30"
            >
              <span className="text-2xl font-bold">&#x276F;</span>
            </button>
          </div>
        ) : (
          <p className="text-gray-500 italic text-lg">
            You have no tickets yet.
          </p>
        )}
      </div>

      <div>
        <h2 className="text-4xl font-bold text-white !mb-6">
          Recommended Movies For You
        </h2>
        {recommendedMovies.length === 0 ? (
          <p className="text-gray-500 italic text-lg">
            You don’t have any recommendations yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {recommendedMovies.map((recMovie) => (
              <MoviePosterWithoutInfo
                movie={recMovie}
                goToMovie={goToMovie}
                key={recMovie.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
