"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="w-full py-3 md:py-6 px-4 md:px-6 bg-black text-white flex-shrink-0 hidden md:block"
    >
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-xs md:text-sm text-gray-400">
          © 2025 Tecaudex - Transforming Startups | All Rights Reserved
        </p>
      </div>
    </motion.footer>
  );
}
