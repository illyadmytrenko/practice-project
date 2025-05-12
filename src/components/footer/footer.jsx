import Logo from "../logo/logo";

export default function Footer() {
  return (
    <footer className="text-gray-400 !p-3 sm:!p-5 relative z-50 relative after:absolute after:top-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-green-400 after:to-black">
      <div className="flex flex-col min-[450px]:flex-row gap-3 min-[450px]:gap-20 justify-between items-center !px-6">
        <Logo />
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
