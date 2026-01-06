import logoLeft from "@assets/image_1767675603658.png";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="w-full py-1 md:py-2 px-6 md:px-12 flex justify-start items-center sticky top-0 z-50 bg-[#0047AB]">
      <Link href="/">
        <div className="relative group cursor-pointer bg-[#0047AB]">
          <img
            src={logoLeft}
            alt="Nasohold Logo"
            className="h-8 md:h-12 object-contain"
          />
        </div>
      </Link>
    </header>
  );
}
