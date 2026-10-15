// In-memory rate limiter per IP address
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;
const ipSubmissions = new Map();

/**
 * Periodically purge stale IP entries to prevent memory leaks
 */
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [ip, record] of ipSubmissions.entries()) {
    if (now - record.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
      ipSubmissions.delete(ip);
    }
  }
}

/**
 * Checks whether an IP has exceeded the allowed submission threshold.
 * @param {string} ip
 * @returns {boolean} True if rate limited (blocked), false if allowed
 */
export function checkRateLimit(ip) {
  cleanupRateLimitStore();
  const safeIp = ip || '127.0.0.1';
  const now = Date.now();
  const record = ipSubmissions.get(safeIp);

  if (!record) {
    ipSubmissions.set(safeIp, { count: 1, firstRequestTime: now });
    return false;
  }

  if (now - record.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
    ipSubmissions.set(safeIp, { count: 1, firstRequestTime: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}
