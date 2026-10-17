// Turns 0712 345 678, +254 712 345 678 or 254712345678 into 254712345678.
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '');
  return digits.length === 10 && digits.startsWith('0') ? `254${digits.slice(1)}` : digits;
}

export function isValidKenyanPhone(raw: string): boolean {
  return /^254[17][0-9]{8}$/.test(normalizePhone(raw));
}