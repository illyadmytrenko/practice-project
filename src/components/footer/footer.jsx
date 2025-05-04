import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-neutral-900/30 text-gray-400 pt-6 pb-3 text-sm relative z-50">
      {/* Верхній блок із контентом */}
      <div className="grid grid-cols-5 gap-4 items-center w-full px-6">
        {/* Відступ зліва */}
        <div></div>

        {/* Назва */}
        <div className="text-left">
          <Link to="/" className="text-xl font-bold tracking-wide uppercase hover:underline">
            <span className="text-white">Movie</span>
            <span className="text-green-500">Time</span>
          </Link>
        </div>

        {/* Центр-проміжок */}
        <div></div>

        {/* Контакти */}
        <div className="text-right text-xs text-gray-500">
          <p>Email: support@movietime.com</p>
          <p>Телефон: +38 (050) 123-45-67</p>
        </div>

        {/* Відступ справа */}
        <div></div>
      </div>

      {/* Горизонтальна риска */}
      <hr className="border-t border-gray-700 my-4 mx-6" />

      {/* Копірайт */}
      <div className="text-center text-xs text-gray-500 px-6">
        © {new Date().getFullYear()} Усі права захищено.
      </div>
    </footer>
  );
};

export default Footer;
