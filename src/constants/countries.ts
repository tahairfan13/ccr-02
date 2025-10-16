export interface Country {
  name: string;
  code: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  // North America
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },

  // Europe
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "Belgium", code: "+32", flag: "🇧🇪" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭" },
  { name: "Austria", code: "+43", flag: "🇦🇹" },
  { name: "Sweden", code: "+46", flag: "🇸🇪" },
  { name: "Norway", code: "+47", flag: "🇳🇴" },
  { name: "Denmark", code: "+45", flag: "🇩🇰" },
  { name: "Finland", code: "+358", flag: "🇫🇮" },
  { name: "Poland", code: "+48", flag: "🇵🇱" },
  { name: "Czech Republic", code: "+420", flag: "🇨🇿" },
  { name: "Greece", code: "+30", flag: "🇬🇷" },
  { name: "Portugal", code: "+351", flag: "🇵🇹" },
  { name: "Ireland", code: "+353", flag: "🇮🇪" },
  { name: "Romania", code: "+40", flag: "🇷🇴" },
  { name: "Hungary", code: "+36", flag: "🇭🇺" },

  // Middle East (GCC & Levant)
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Jordan", code: "+962", flag: "🇯🇴" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧" },
  { name: "Israel", code: "+972", flag: "🇮🇱" },
  { name: "Palestine", code: "+970", flag: "🇵🇸" },

  // North Africa & Eastern Mediterranean
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "Tunisia", code: "+216", flag: "🇹🇳" },
  { name: "Cyprus", code: "+357", flag: "🇨🇾" },

  // South Asia

  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "Maldives", code: "+960", flag: "🇲🇻" },

  // East Asia
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "Hong Kong", code: "+852", flag: "🇭🇰" },
  { name: "Taiwan", code: "+886", flag: "🇹🇼" },

  // Southeast Asia
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },

  // Oceania
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿" },

  // Eastern Europe & Caucasus
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "Ukraine", code: "+380", flag: "🇺🇦" },
  { name: "Kazakhstan", code: "+7", flag: "🇰🇿" },
  { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
  { name: "Armenia", code: "+374", flag: "🇦🇲" },
  { name: "Georgia", code: "+995", flag: "🇬🇪" },
  { name: "Uzbekistan", code: "+998", flag: "🇺🇿" },
  { name: "Turkmenistan", code: "+993", flag: "🇹🇲" },

  // South America
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "Chile", code: "+56", flag: "🇨🇱" },
  { name: "Colombia", code: "+57", flag: "🇨🇴" },
  { name: "Peru", code: "+51", flag: "🇵🇪" },
  { name: "Venezuela", code: "+58", flag: "🇻🇪" },
  { name: "Uruguay", code: "+598", flag: "🇺🇾" },

  // Sub-Saharan Africa
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Ethiopia", code: "+251", flag: "🇪🇹" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
];
