import logoLeft from "@assets/WhatsApp_Image_2026-01-07_at_10.23.23-removebg-preview_1767762385457.png";
import logoRight from "@assets/WhatsApp_Image_2026-01-07_at_10.23.22-removebg-preview_1767762430087.png";
import { Link, useLocation } from "wouter";

export function Header() {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 bg-[#0047AB]">
      <Link href="/">
        <div className="relative group cursor-pointer">
          {isHome ? (
            <img
              src={logoLeft}
              alt="Nasohold Logo"
              className="h-10 md:h-16 object-contain brightness-0 invert"
            />
          ) : (
            <img
              src={logoRight}
              alt="Aristo Logo"
              className="h-10 md:h-16 object-contain brightness-0 invert"
            />
          )}
        </div>
      </Link>
      {isHome && (
        <div className="flex items-center">
          <img
            src={logoRight}
            alt="Aristo Logo"
            className="h-8 md:h-12 object-contain brightness-0 invert"
          />
        </div>
      )}
    </header>
  );
}
