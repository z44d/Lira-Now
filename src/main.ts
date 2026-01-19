import {
  type Currency,
  type ExchangeRateApiResponse,
  SUPPORTED_CURRENCIES,
  type ThemeMode,
  translations,
} from "./utils";

const currentCity = "damascus";
let currentLang: "ar" | "en" = "ar";
let currentTheme: ThemeMode = "system";
let currenciesData: Currency[] = [];
const API_URL = "https://syp.z44d.com/rates";

async function fetchRates() {
  updateUIText();
  const dashboard = document.querySelector("#dashboard");
  if (dashboard)
    dashboard.innerHTML = `<p class="loading">${translations[currentLang].loading}</p>`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");

    const json: ExchangeRateApiResponse = await response.json();
    if (json.result === "success") {
      const rates: Currency[] = [];

      Object.entries(SUPPORTED_CURRENCIES).forEach(([code, meta]) => {
        const rateToSyp = json.conversion_rates[code];
        if (rateToSyp) {
          const newPrice = 1 / rateToSyp;
          const oldPrice = newPrice * 100;

          rates.push({
            code: code,
            slug: code.toLowerCase(),
            name: meta.name_en,
            name_ar: meta.name_ar,
            symbol: meta.symbol || "",
            flag: meta.flag,
            updated_at: json.time_last_update_utc,
            cities: {
              "damascus": {
                buy: oldPrice,
                sell: oldPrice,
                change: 0,
                prev_close: oldPrice,
                day_high: oldPrice,
                day_low: oldPrice,
                change_week: 0,
                change_month: 0,
                change_year: 0,
              },
            },
          });
        }
      });

      currenciesData = rates;
      renderDashboard();
    }
  } catch (e) {
    console.error(e);
    if (dashboard)
      dashboard.innerHTML = `<p class="error">${translations[currentLang].error}</p>`;
  }
}

function updateUIText() {
  const t = translations[currentLang];
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  document.querySelector("#app-title")!.textContent = t.title;
  document.querySelector("#app-subtitle")!.textContent = t.subtitle;
  document.querySelector("#dev-text")!.textContent = t.developedBy;

  const langLabel = document.querySelector("#label-lang");
  if (langLabel)
    langLabel.textContent = currentLang === "ar" ? "English" : "العربية";

  updateThemeUI();
}

function updateThemeUI() {
  const t = translations[currentLang];
  const themeLabel = document.querySelector("#label-theme");
  const icons = {
    system: document.getElementById("icon-system"),
    light: document.getElementById("icon-sun"),
    dark: document.getElementById("icon-moon"),
  };

  Object.values(icons).forEach((icon) => {
    if (icon) icon.style.display = "none";
  });

  if (icons[currentTheme]) {
    icons[currentTheme]!.style.display = "block";
  }
  if (themeLabel) {
    if (currentTheme === "system") themeLabel.textContent = t.themeSystem;
    else if (currentTheme === "light")
      themeLabel.textContent = t.themeLight;
    else if (currentTheme === "dark") themeLabel.textContent = t.themeDark;
  }
}

function applyTheme() {
  if (currentTheme === "system") {
    const isDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );

    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } else {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }
  updateThemeUI();
}

function formatNumber(num: number): string {
  return num.toLocaleString(currentLang === "ar" ? "ar-SY" : "en-US");
}

function getTwemojiUrl(emoji: string): string {
  const code = [...emoji]
    .map((char) => char.codePointAt(0)?.toString(16))
    .join("-");
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${code}.svg`;
}

function renderDashboard() {
  const dashboard = document.querySelector("#dashboard");
  if (!dashboard) return;

  dashboard.innerHTML = "";
  const t = translations[currentLang];

  currenciesData.forEach((currency) => {
    const rate = currency.cities[currentCity];
    if (!rate) return;

    const card = document.createElement("div");
    card.className = "card";

    const newBuy = rate.buy / 100;
    const newSell = rate.sell / 100;

    const twemojiUrl = getTwemojiUrl(currency.flag);

    card.innerHTML = `
      <div class="card-header">
        <div class="currency-info">
          <img src="${twemojiUrl}" class="flag-img" alt="${currency.flag}" draggable="false" />
          <div>
            <div class="currency-code">${currency.code}</div>
            <div class="currency-name">${currentLang === "ar" ? currency.name_ar : currency.name}</div>
          </div>
        </div>
      </div>

      <!-- New Price (Always Visible) -->
      <div class="price-section">
        <div class="price-title new-price">${t.newPriceTitle}</div>
        <div class="rate-row">
          <span class="rate-label">${t.buy}</span>
          <span class="rate-value new-price">${formatNumber(newBuy)}</span>
        </div>
        <div class="rate-row">
          <span class="rate-label">${t.sell}</span>
          <span class="rate-value new-price">${formatNumber(newSell)}</span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Collapsible Details (Old Price) -->
      <div class="card-details">
        <div class="price-section">
          <div class="price-title">${t.oldPriceTitle}</div>
          <div class="rate-row">
            <span class="rate-label">${t.buy}</span>
            <span class="rate-value">${formatNumber(rate.buy)}</span>
          </div>
          <div class="rate-row">
            <span class="rate-label">${t.sell}</span>
            <span class="rate-value">${formatNumber(rate.sell)}</span>
          </div>
        </div>
      </div>

      <!-- Expand Button (Mobile Only) -->
      <button class="expand-btn" onclick="toggleCard(this)" aria-label="Toggle Details">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    `;

    dashboard.appendChild(card);
  });
}

(window as any).toggleCard = (btn: HTMLElement) => {
  const card = btn.closest(".card");
  card?.classList.toggle("expanded");
};

(window as any).toggleLanguage = () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  updateUIText();
  renderDashboard();
};

window.addEventListener("DOMContentLoaded", () => {
  fetchRates();
  applyTheme();

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (currentTheme === "system") applyTheme();
    });
});

(window as any).toggleTheme = () => {
  if (currentTheme === "system") currentTheme = "light";
  else if (currentTheme === "light") currentTheme = "dark";
  else currentTheme = "system";

  applyTheme();
};
