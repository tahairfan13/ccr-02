interface TopGlowProps {
  className?: string;
}

export default function TopGlow({ className = "" }: TopGlowProps) {
  return (
    <div
      className={`pointer-events-none absolute top-0 left-1/2 z-0 hidden h-[320px] w-[710px] max-w-[710px] -translate-x-1/2 md:block ${className}`}
      aria-hidden="true"
    >
      <svg
        width="710"
        height="320"
        viewBox="0 0 900 370"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <g filter="url(#glow1)">
          <path
            d="M471.491 -250.808C437.517 -290.231 368.222 -369.462 362.837 -371C276.299 -275.487 101.876 -81.9615 96.491 -71.9615C89.7603 -59.4615 185.914 265.538 194.568 273.231C203.222 280.923 483.991 156.885 489.76 153.038C494.376 149.962 512.196 57.5257 520.529 11.6924C467.965 -4.65381 361.491 -38.1153 356.106 -41.1923C350.722 -44.2692 430.786 -182.218 471.491 -250.808Z"
            fill="#ED1A3B"
            fillOpacity="0.08"
          />
        </g>
        <g filter="url(#glow2)">
          <path
            d="M724.376 -340.84C721.491 -344.686 567.645 -315.84 557.068 -313.917C558.991 -258.468 561.683 -146.032 557.068 -139.878C552.453 -133.724 489.76 -100.776 458.991 -85.0704C480.786 -28.6601 524.183 85.5065 523.414 90.8911C522.645 96.2758 558.35 151.468 576.299 178.391C611.555 128.712 685.337 29.3527 698.414 29.3527C711.491 29.3527 773.735 8.83987 803.222 -1.41653C777.901 -113.276 726.683 -337.763 724.376 -340.84Z"
            fill="#ED1A3B"
            fillOpacity="0.06"
          />
        </g>
        <defs>
          <filter id="glow1" x="0" y="-467" width="617" height="837" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="bg" />
            <feBlend in="SourceGraphic" in2="bg" result="shape" />
            <feGaussianBlur stdDeviation="48" result="blur" />
          </filter>
          <filter id="glow2" x="363" y="-437" width="537" height="712" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="bg" />
            <feBlend in="SourceGraphic" in2="bg" result="shape" />
            <feGaussianBlur stdDeviation="48" result="blur" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
