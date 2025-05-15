import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function CinemaCarousel() {
  return (
    <div className="flex justify-center mb-12">
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-lg bg-black/70">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={3000}
          transitionTime={700}
          showArrows={true}
        >
          <div>
            <img
              src="/assets/images/cin1.jpg"
              alt="Cinema 1"
              className="object-cover w-full h-80"
            />
          </div>

          <div>
            <img
              src="/assets/images/cin3.jpg"
              alt="Cinema 3"
              className="object-cover w-full h-80"
            />
          </div>

          <div>
            <img
              src="/assets/images/cin2.jpg"
              alt="Cinema 2"
              className="object-cover w-full h-80"
            />
          </div>

          <div>
            <img
              src="/assets/images/cin4.jpg"
              alt="Cinema 4"
              className="object-cover w-full h-80"
            />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
