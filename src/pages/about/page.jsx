import React from "react";
import "./about.css";
import CinemaCarousel from "../../components/carousel/cinema-carousel";


export default function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">About Us</h1>

     

      <p className="about-text">
        <strong>Our cinema</strong> is more than just a place to watch movies — it's a cultural landmark that has brought people together for over three decades.
      </p>

      <h2>Our Story</h2>
      <p className="about-text">
        Established in <strong>1990</strong>, our cinema opened its doors in the heart of the city with the mission to create an inclusive, welcoming space for movie lovers. What started as a single-screen neighborhood theater has evolved into a modern multi-hall complex, while still retaining the charm and atmosphere of the golden age of cinema.
      </p>
      <p className="about-text">
        Throughout the years, we have hosted countless film festivals, themed nights, charity events, and school screenings. Many locals recall their first movie experience right here in our cozy red velvet chairs under the art-deco chandeliers.
      </p>
      <p className="about-text">
        In the early 2000s, we embraced digital transformation, upgrading our projection systems and sound technologies while preserving our architectural identity. Our commitment to both innovation and tradition makes us a unique venue that bridges generations of cinema enthusiasts.
      </p>
      <p className="about-text">
        Today, we continue to screen the latest blockbusters, indie gems, and timeless classics. Whether you're visiting us for a premiere or a nostalgic rewatch, we aim to offer a warm and immersive experience every time.
      </p>

      <div>
      <h1 className="text-white text-3xl text-center mb-8">Gallery</h1>
      <CinemaCarousel />
    </div>

      <h2>Contact Information</h2>
      <ul>
        <li><strong>Email:</strong> support@movietime.com</li>
        <li><strong>Phone:</strong> +38 (050) 123-45-67</li>
        <li><strong>Address:</strong> 26 Kostyantynivska Street, Kyiv, 04071, Ukraine</li>
        <li><strong>Working Hours:</strong> Daily from 10:00 AM to 11:00 PM</li>
      </ul>
    </div>
  );
}
