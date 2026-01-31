export const formatSmartValue = (value: string | number): string => {
  if (typeof value !== "string" || typeof value !== "number") return "N/A";

  const str = String(value).trim();

  if (/[a-zA-Z₹$€£/]/.test(str)) {
    return str.replace(/\s+/g, " ");
  }

  const num = parseFloat(str);
  if (isNaN(num)) return str;

  const formatted = num.toFixed(2).replace(/\.?0+$/, "");
  return formatted;
};

export function extractNumericValue(price: string): number {
  if (!price) return 0;

  const numericString = price.replace(/[^0-9०-९]/g, "");

  if (!numericString) return 0;

  const englishDigits = numericString.replace(/[०-९]/g, (digit) =>
    String("०१२३४५६७८९".indexOf(digit))
  );

  const num = Number(englishDigits);

  return isNaN(num) ? 0 : num;
}