import React from "react";
import Logo from "../logo/logo";

export default function Footer() {
  return (
    <footer className="text-gray-400 !p-3 sm:!p-5 relative z-50">
      <div className="flex flex-col min-[450px]:flex-row gap-3 min-[450px]:gap-20 justify-between items-center !px-6">
        <Logo />
        <div className="text-xs text-gray-500">
          <p>
            Email:{" "}
            <a href="mailto:support@movietime.com">support@movietime.com</a>
          </p>
          <p>
            Телефон: <a href="tel:+380501234567">+38 (050) 123-45-67</a>
          </p>
        </div>
        <p className="text-xs text-gray-500 px-6">
          © {new Date().getFullYear()} Усі права захищено.
        </p>
      </div>
    </footer>
  );
}
