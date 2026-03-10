"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        w-full py-3 md:py-4 px-5 md:px-8 lg:px-12 sticky top-0 z-50 flex-shrink-0
        transition-all duration-300
        ${scrolled
          ? "bg-white/85 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_1px_0_rgba(0,0,0,0.04),0_4px_20px_rgba(0,0,0,0.04)]"
          : "bg-white"
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://cdn.prod.website-files.com/659fb2624108883f9bb2a031/659fb4d7e951322f2486304f_logo-tecaudex-02%201.svg"
            alt="Tecaudex Logo"
            width={140}
            height={40}
            className="h-6 md:h-9 w-auto"
            priority
          />
          <div className="hidden sm:block w-px h-5 md:h-6 bg-neutral-100" />
          <span className="hidden sm:block text-xs md:text-sm text-neutral-400 font-medium">
            Cost Calculator
          </span>
        </Link>
        <a
          href="https://www.tecaudex.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs md:text-sm text-neutral-400 font-medium rounded-full px-4 py-2 transition-colors duration-200 hover:bg-[#ED1A3B]/[0.04] hover:text-[#ED1A3B]"
        >
          tecaudex.com
        </a>
      </div>
    </header>
  );
}
