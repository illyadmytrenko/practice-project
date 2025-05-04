import MoviePoster from "../../components/movie-poster/movie-poster";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useMovies } from "../../context/movies-context";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function HomePage() {
  const { movies } = useMovies();

  return (
    <section className="relative">
      <Swiper
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Navigation]}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} className="w-full">
            <MoviePoster movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-button-prev bg-green-600 p-3 rounded-full absolute top-1/2 left-0 -translate-y-1/2 z-10 hover:bg-green-700 cursor-pointer transition-colors h-16! w-16! md:h-20! md:w-20! text-white! border-black! border-2! after:text-4xl! after:font-bold!"></div>
      <div className="swiper-button-next bg-green-600 p-3 rounded-full absolute top-1/2 right-0 -translate-y-1/2 z-10 hover:bg-green-700 cursor-pointer transition-colors h-16! w-16! md:h-20! md:w-20! text-white! border-black! border-2! after:text-4xl! after:font-bold!"></div>
    </section>
  );
}
