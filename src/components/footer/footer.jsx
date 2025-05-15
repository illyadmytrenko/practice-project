import { Link } from "react-router-dom";
import Logo from "../logo/logo";

export default function Footer() {
  const navLinks = [
    { to: "/about", label: "About Us" },
    { to: "/privacy", label: "Privacy" },
  ];

  return (
    <footer className="text-gray-400 !p-3 sm:!p-5 relative z-50 relative after:absolute after:top-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-green-400 after:to-black">
      <div className="flex flex-wrap flex-col sm:flex-row gap-3 sm:gap-x-20 justify-between items-center !px-6">
        <Logo />
        <nav className="!flex justify-center gap-10 text-2xl font-semibold transition duration-300 text-white">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="transition-colors duration-300 hover:text-green-400"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="text-xs text-gray-500">
          <p>
            Email:{" "}
            <a href="mailto:support@movietime.com">support@movietime.com</a>
          </p>
          <p>
            Phone number: <a href="tel:+380501234567">+38 (050) 123-45-67</a>
          </p>
        </div>
        <p className="text-xs text-gray-500 px-6">
          © 2025 All rights reserved.
        </p>
      </div>
    </footer>
  );
}
