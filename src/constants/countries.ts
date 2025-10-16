export interface Country {
  name: string;
  code: string;
  flag: string;
  hourlyRate: number; // Base rate in USD
  currency: string; // Currency symbol ($ | £ | €)
  displayRate: number; // Rate in local currency
}

// European countries that use EUR (excluding UK)
const EU_COUNTRIES = [
  "Austria", "Belgium", "Cyprus", "Finland", "France", "Germany", "Greece",
  "Ireland", "Italy", "Netherlands", "Portugal", "Spain"
];

// Currency conversion rates (as of common standards)
const USD_TO_GBP = 0.79;
const USD_TO_EUR = 0.92;

// Helper function to determine currency and display rate
function getCountryData(name: string, code: string, flag: string, baseRateUSD: number): Country {
  if (name === "United Kingdom") {
    return {
      name,
      code,
      flag,
      hourlyRate: baseRateUSD,
      currency: "£",
      displayRate: Math.round(baseRateUSD * USD_TO_GBP)
    };
  }

  if (EU_COUNTRIES.includes(name)) {
    return {
      name,
      code,
      flag,
      hourlyRate: baseRateUSD,
      currency: "€",
      displayRate: Math.round(baseRateUSD * USD_TO_EUR)
    };
  }

  return {
    name,
    code,
    flag,
    hourlyRate: baseRateUSD,
    currency: "$",
    displayRate: baseRateUSD
  };
}

export const COUNTRIES: Country[] = [
  // Alphabetically ordered
  getCountryData("Algeria", "+213", "🇩🇿", 30),
  getCountryData("Argentina", "+54", "🇦🇷", 30),
  getCountryData("Armenia", "+374", "🇦🇲", 30),
  getCountryData("Australia", "+61", "🇦🇺", 30),
  getCountryData("Austria", "+43", "🇦🇹", 35),
  getCountryData("Azerbaijan", "+994", "🇦🇿", 30),
  getCountryData("Bahrain", "+973", "🇧🇭", 30),
  getCountryData("Belgium", "+32", "🇧🇪", 35),
  getCountryData("Brazil", "+55", "🇧🇷", 30),
  getCountryData("Canada", "+1", "🇨🇦", 30),
  getCountryData("Chile", "+56", "🇨🇱", 30),
  getCountryData("China", "+86", "🇨🇳", 30),
  getCountryData("Colombia", "+57", "🇨🇴", 30),
  getCountryData("Cyprus", "+357", "🇨🇾", 35),
  getCountryData("Czech Republic", "+420", "🇨🇿", 30),
  getCountryData("Denmark", "+45", "🇩🇰", 30),
  getCountryData("Egypt", "+20", "🇪🇬", 30),
  getCountryData("Ethiopia", "+251", "🇪🇹", 30),
  getCountryData("Finland", "+358", "🇫🇮", 35),
  getCountryData("France", "+33", "🇫🇷", 35),
  getCountryData("Georgia", "+995", "🇬🇪", 30),
  getCountryData("Germany", "+49", "🇩🇪", 35),
  getCountryData("Ghana", "+233", "🇬🇭", 30),
  getCountryData("Greece", "+30", "🇬🇷", 35),
  getCountryData("Hong Kong", "+852", "🇭🇰", 30),
  getCountryData("Hungary", "+36", "🇭🇺", 30),
  getCountryData("Ireland", "+353", "🇮🇪", 35),
  getCountryData("Israel", "+972", "🇮🇱", 30),
  getCountryData("Italy", "+39", "🇮🇹", 35),
  getCountryData("Japan", "+81", "🇯🇵", 30),
  getCountryData("Jordan", "+962", "🇯🇴", 30),
  getCountryData("Kazakhstan", "+7", "🇰🇿", 30),
  getCountryData("Kenya", "+254", "🇰🇪", 30),
  getCountryData("Kuwait", "+965", "🇰🇼", 30),
  getCountryData("Lebanon", "+961", "🇱🇧", 30),
  getCountryData("Malaysia", "+60", "🇲🇾", 30),
  getCountryData("Maldives", "+960", "🇲🇻", 30),
  getCountryData("Mexico", "+52", "🇲🇽", 30),
  getCountryData("Morocco", "+212", "🇲🇦", 30),
  getCountryData("Netherlands", "+31", "🇳🇱", 35),
  getCountryData("New Zealand", "+64", "🇳🇿", 30),
  getCountryData("Nigeria", "+234", "🇳🇬", 30),
  getCountryData("Norway", "+47", "🇳🇴", 30),
  getCountryData("Oman", "+968", "🇴🇲", 30),
  getCountryData("Pakistan", "+92", "🇵🇰", 30),
  getCountryData("Palestine", "+970", "🇵🇸", 30),
  getCountryData("Peru", "+51", "🇵🇪", 30),
  getCountryData("Poland", "+48", "🇵🇱", 30),
  getCountryData("Portugal", "+351", "🇵🇹", 35),
  getCountryData("Qatar", "+974", "🇶🇦", 30),
  getCountryData("Romania", "+40", "🇷🇴", 30),
  getCountryData("Russia", "+7", "🇷🇺", 30),
  getCountryData("Saudi Arabia", "+966", "🇸🇦", 30),
  getCountryData("Singapore", "+65", "🇸🇬", 30),
  getCountryData("South Africa", "+27", "🇿🇦", 30),
  getCountryData("South Korea", "+82", "🇰🇷", 30),
  getCountryData("Spain", "+34", "🇪🇸", 35),
  getCountryData("Sweden", "+46", "🇸🇪", 30),
  getCountryData("Switzerland", "+41", "🇨🇭", 30),
  getCountryData("Taiwan", "+886", "🇹🇼", 30),
  getCountryData("Tanzania", "+255", "🇹🇿", 30),
  getCountryData("Tunisia", "+216", "🇹🇳", 30),
  getCountryData("Turkey", "+90", "🇹🇷", 30),
  getCountryData("Turkmenistan", "+993", "🇹🇲", 30),
  getCountryData("Uganda", "+256", "🇺🇬", 30),
  getCountryData("Ukraine", "+380", "🇺🇦", 30),
  getCountryData("United Arab Emirates", "+971", "🇦🇪", 30),
  getCountryData("United Kingdom", "+44", "🇬🇧", 35),
  getCountryData("United States", "+1", "🇺🇸", 45),
  getCountryData("Uruguay", "+598", "🇺🇾", 30),
  getCountryData("Uzbekistan", "+998", "🇺🇿", 30),
  getCountryData("Venezuela", "+58", "🇻🇪", 30),
];
