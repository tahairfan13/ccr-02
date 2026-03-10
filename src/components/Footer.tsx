"use client";

export default function Footer() {
  return (
    <footer className="w-full py-6 md:py-8 px-5 md:px-8 lg:px-12 bg-[#f7f7f6] flex-shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-neutral-500">
          &copy; 2026 Tecaudex &mdash; Transforming Startups
        </p>
        <div className="flex items-center gap-5 text-xs text-neutral-500">
          <a href="mailto:sales@tecaudex.com" className="transition-colors hover:text-[#ED1A3B]">
            sales@tecaudex.com
          </a>
          <a href="https://www.tecaudex.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#ED1A3B]">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
