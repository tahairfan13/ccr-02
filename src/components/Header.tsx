"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full py-2 md:py-4 px-4 md:px-6 bg-white border-b border-gray-100 sticky top-0 z-50 flex-shrink-0"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <Image
            src="https://cdn.prod.website-files.com/659fb2624108883f9bb2a031/659fb4d7e951322f2486304f_logo-tecaudex-02%201.svg"
            alt="Tecaudex Logo"
            width={140}
            height={40}
            className="h-6 md:h-10 w-auto"
            priority
          />
          <div className="hidden sm:block w-px h-6 md:h-8 bg-gray-200" />
          <p className="hidden sm:block text-xs md:text-sm text-gray-600 font-medium">
            Project Cost Calculator
          </p>
        </div>
      </div>
    </motion.header>
  );
}
