export type JwtExpiresIn = number | `${number}${'s' | 'm' | 'h' | 'd'}`;
export function parseJwtExpiresIn(
  raw: string | undefined,
  fallback: JwtExpiresIn = '15m',
): JwtExpiresIn {
  if (!raw) {
    return fallback;
  }
  const value = raw.trim().toLowerCase();
  if (!value) {
    return fallback;
  }
  // "3600" -> 3600 (seconds)
  if (/^\d+$/.test(value)) {
    return +value;
  }
  // "15m", "10s", "1h", "7d"
  const match = /^(\d+)([smhd])$/.exec(value);
  if (match) {
    const amount = Number(match[1]);
    const unit = match[2] as 's' | 'm' | 'h' | 'd';
    return `${amount}${unit}`;
  }
  throw new Error(
    `Invalid JWT_EXPIRES_IN="${raw}". Expected e.g. "15m", "10s", "1h", "7d" or "3600".`,
  );
}
