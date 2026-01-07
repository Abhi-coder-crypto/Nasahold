import logoLeft from "@assets/WhatsApp_Image_2026-01-07_at_10.23.23-removebg-preview_1767762385457.png";
import logoRight from "@assets/WhatsApp_Image_2026-01-07_at_10.23.22-removebg-preview_1767762430087.png";
import { Link, useLocation } from "wouter";

export function Header() {
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <header className="w-full py-2 px-6 md:px-12 flex justify-between items-center fixed top-0 left-0 right-0 z-50 bg-[#0047AB] md:bg-[#0047AB] max-md:bg-transparent">
      <div className="flex-1 flex items-center justify-center md:justify-start pt-2 md:pt-0">
        {isHome ? null : (
          <Link href="/">
            <div className="relative group cursor-pointer translate-x-4 translate-y-3 md:translate-x-0 md:translate-y-0">
              <img
                src={logoLeft}
                alt="Nasohold Logo"
                className="h-8 md:h-16 object-contain brightness-0 invert"
              />
            </div>
          </Link>
        )}
      </div>
      <div className="flex items-center pt-2 md:pt-0">
        <img
          src={logoRight}
          alt="Aristo Logo"
          className="h-6 md:h-12 object-contain brightness-0 invert translate-x-4 translate-y-2 md:translate-x-0 md:translate-y-0"
        />
      </div>
    </header>
  );
}
