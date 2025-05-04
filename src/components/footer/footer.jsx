import React from "react";
import Logo from "../logo/logo";

export default function Footer() {
  return (
    <footer className="text-gray-400 !p-3 sm:!p-5 relative z-50">
      <div className="flex flex-col min-[450px]:flex-row gap-3 min-[450px]:gap-20 justify-between items-center !px-6">
        <Logo />
        <div className="text-xs text-gray-500">
          <p>Email: support@movietime.com</p>
          <p>Телефон: +38 (050) 123-45-67</p>
        </div>
        <p className="text-xs text-gray-500 px-6">
          © {new Date().getFullYear()} Усі права захищено.
        </p>
      </div>
    </footer>
  );
}
