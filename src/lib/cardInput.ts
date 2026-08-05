/** Format digits into groups of four (standard card display). */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** Auto-insert slash while typing expiry (MM/YY). */
export function formatCardExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Basic Luhn check — used on submit only, not while typing. */
export function isValidCardNumber(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 16) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i]!, 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function isValidCardExpiry(value: string): boolean {
  const m = value.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1]!, 10);
  const year = 2000 + parseInt(m[2]!, 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const exp = new Date(year, month, 0); // last day of expiry month
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
}

/** Shared input styles — no browser red invalid ring on focus. */
export const PAYMENT_INPUT_CLASS =
  "h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none transition-colors " +
  "placeholder:text-gray-400 focus:border-[#2C6E49] focus:ring-1 focus:ring-[#2C6E49] " +
  "invalid:border-gray-300 invalid:shadow-none invalid:ring-0";
