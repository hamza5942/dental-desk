"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showBadge?: boolean;
  theme?: "dark" | "light";
}

export default function Logo({ className = "", showBadge = false, theme = "dark" }: LogoProps) {
  const logoSrc = theme === "dark" ? "/media/dentaldesk-logo-darkbg.png" : "/media/dentaldesk-full-logo.png";

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Official DentalDesk Full Transparent Logo */}
      <div className="relative flex items-center transition-transform duration-300 group-hover:scale-[1.02]">
        <Image
          src={logoSrc}
          alt="DentalDesk"
          width={180}
          height={48}
          className="h-8 sm:h-9 w-auto object-contain drop-shadow-sm"
          priority
        />
      </div>

      {showBadge && (
        <span
          className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            theme === "dark"
              ? "bg-white/10 text-cyan-300 border-white/15"
              : "bg-sky-50 text-sky-700 border-sky-200"
          }`}
        >
          AI 24/7
        </span>
      )}
    </Link>
  );
}
