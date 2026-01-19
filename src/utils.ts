interface Quote {
  buy: number;
  sell: number;
  change: number;
  prev_close: number;
  day_high: number;
  day_low: number;
  change_week: number;
  change_month: number;
  change_year: number;
}

interface CityRates {
  [city: string]: Quote;
}

interface Currency {
  code: string;
  slug: string;
  name: string;
  name_ar: string;
  symbol: string;
  flag: string;
  cities: CityRates;
  updated_at: string;
}

interface ExchangeRateApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

const SUPPORTED_CURRENCIES: Record<
  string,
  { name_ar: string; name_en: string; flag: string; symbol?: string }
> = {
  USD: {
    name_ar: "دولار أمريكي",
    name_en: "US Dollar",
    flag: "🇺🇸",
    symbol: "$",
  },
  EUR: { name_ar: "يورو", name_en: "Euro", flag: "🇪🇺", symbol: "€" },
  GBP: {
    name_ar: "جنيه إسترليني",
    name_en: "British Pound",
    flag: "🇬🇧",
    symbol: "£",
  },
  SAR: {
    name_ar: "ريال سعودي",
    name_en: "Saudi Riyal",
    flag: "🇸🇦",
    symbol: "﷼",
  },
  JOD: {
    name_ar: "دينار أردني",
    name_en: "Jordanian Dinar",
    flag: "🇯🇴",
    symbol: "JD",
  },
  AED: {
    name_ar: "درهم إماراتي",
    name_en: "UAE Dirham",
    flag: "🇦🇪",
    symbol: "د.إ",
  },
  TRY: {
    name_ar: "ليرة تركية",
    name_en: "Turkish Lira",
    flag: "🇹🇷",
    symbol: "₺",
  },
  KWD: {
    name_ar: "دينار كويتي",
    name_en: "Kuwaiti Dinar",
    flag: "🇰🇼",
    symbol: "KD",
  },
  QAR: {
    name_ar: "ريال قطري",
    name_en: "Qatari Riyal",
    flag: "🇶🇦",
    symbol: "QR",
  },
  BHD: {
    name_ar: "دينار بحريني",
    name_en: "Bahraini Dinar",
    flag: "🇧🇭",
    symbol: "BD",
  },
  OMR: {
    name_ar: "ريال عماني",
    name_en: "Omani Rial",
    flag: "🇴🇲",
    symbol: "OR",
  },
  CAD: {
    name_ar: "دولار كندي",
    name_en: "Canadian Dollar",
    flag: "🇨🇦",
    symbol: "C$",
  },
  AUD: {
    name_ar: "دولار أسترالي",
    name_en: "Australian Dollar",
    flag: "🇦🇺",
    symbol: "A$",
  },
  SEK: {
    name_ar: "كرون سويدي",
    name_en: "Swedish Krona",
    flag: "🇸🇪",
    symbol: "kr",
  },
  NOK: {
    name_ar: "كرون نرويجي",
    name_en: "Norwegian Krone",
    flag: "🇳🇴",
    symbol: "kr",
  },
  DKK: {
    name_ar: "كرون دنماركي",
    name_en: "Danish Krone",
    flag: "🇩🇰",
    symbol: "kr",
  },
  EGP: {
    name_ar: "جنيه مصري",
    name_en: "Egyptian Pound",
    flag: "🇪🇬",
    symbol: "E£",
  },
};

interface Translations {
  title: string;
  subtitle: string;
  loading: string;
  error: string;
  oldPriceTitle: string;
  newPriceTitle: string;
  buy: string;
  sell: string;
  developedBy: string;
}

const translations: Record<
  "ar" | "en",
  Translations & {
    themeSystem: string;
    themeLight: string;
    themeDark: string;
  }
> = {
  ar: {
    title: "أسعار الصرف في سوريا",
    subtitle: "أسعار لحظية من دمشق",
    loading: "جاري تحميل الأسعار...",
    error: "فشل تحميل الأسعار. يرجى المحاولة لاحقاً.",
    oldPriceTitle: "السعر (عملة قديمة)",
    newPriceTitle: "السعر (عملة جديدة)",
    buy: "شراء",
    sell: "مبيع",
    developedBy: "طُور بواسطة",
    themeSystem: "النظام",
    themeLight: "فاتح",
    themeDark: "داكن",
  },
  en: {
    title: "Syrian Exchange Rates",
    subtitle: "Live trends from Damascus",
    loading: "Loading rates...",
    error: "Failed to load rates. Please try again later.",
    oldPriceTitle: "Current Price (Old)",
    newPriceTitle: "New Price (No Zeros)",
    buy: "Buy",
    sell: "Sell",
    developedBy: "Developed by",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
  },
};

type ThemeMode = "system" | "light" | "dark";

export {
  SUPPORTED_CURRENCIES,
  translations,
  type ThemeMode,
  type ExchangeRateApiResponse,
  type Currency,
};
