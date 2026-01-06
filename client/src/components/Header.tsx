import logoLeft from "@assets/image_1767675603658.png";
import aristoLogo from "@assets/image_1767681703993.png";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="w-full py-2 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 bg-[#0047AB]">
      <Link href="/">
        <div className="relative group cursor-pointer">
          <img
            src={logoLeft}
            alt="Nasohold Logo"
            className="h-8 md:h-12 object-contain"
          />
        </div>
      </Link>
      <div className="flex items-center">
        <img
          src={aristoLogo}
          alt="Aristo Logo"
          className="h-10 md:h-16 object-contain"
        />
      </div>
    </header>
  );
}
