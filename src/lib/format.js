const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const currencyFormatterNoDecimals = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("es-ES", {
  style: "percent",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("es-ES");

export function formatCurrency(value, { decimals = true } = {}) {
  if (!Number.isFinite(value)) return "—";
  return decimals ? currencyFormatter.format(value) : currencyFormatterNoDecimals.format(value);
}

export function formatPercent(value) {
  if (!Number.isFinite(value)) return "—";
  return percentFormatter.format(value);
}

export function formatNumber(value) {
  if (!Number.isFinite(value)) return "—";
  return numberFormatter.format(value);
}
