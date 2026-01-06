import logoLeft from "@assets/image_1767675603658.png";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="w-full py-4 px-6 md:px-12 flex justify-center items-center sticky top-0 z-50 bg-white/50 backdrop-blur-sm border-b border-white/20">
      <Link href="/">
        <div className="relative group cursor-pointer">
          <img
            src={logoLeft}
            alt="Nasohold Logo"
            className="h-12 md:h-16 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
    </header>
  );
}
