/**
 * IP Whitelist Security Middleware
 * 
 * Ensures that API requests are only processed when originating from whitelisted IPs.
 * This adds an extra layer of security by preventing unauthorized access even if
 * someone obtains the API endpoint URLs.
 */

// Whitelisted IP addresses (configure these based on your deployment)
const WHITELISTED_IPS = (process.env.WHITELISTED_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean);

// Additional localhost IPs for development
const LOCALHOST_IPS = ['127.0.0.1', '::1', 'localhost'];

// Enable/disable whitelist (can be controlled via environment variable)
const IP_WHITELIST_ENABLED = process.env.IP_WHITELIST_ENABLED === 'true'; // Disabled by default for development

/**
 * Extract the real client IP from request headers
 * Handles various proxy scenarios (Nginx, CloudFlare, etc.)
 */
export function extractClientIP(request: Request): string {
  // Try different header formats
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // CloudFlare
  
  // x-forwarded-for can contain multiple IPs (client, proxy1, proxy2, ...)
  // The first IP is the original client
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    return ips[0];
  }
  
  // Single IP from reverse proxy
  if (realIP) {
    return realIP;
  }
  
  // CloudFlare specific header
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

/**
 * Check if an IP address is whitelisted
 */
export function isIPWhitelisted(ip: string): boolean {
  // If whitelist is disabled, allow all
  if (!IP_WHITELIST_ENABLED) {
    console.warn('[Security] IP whitelist is DISABLED. All IPs are allowed.');
    return true;
  }
  
  // Allow localhost for development
  if (process.env.NODE_ENV === 'development' && LOCALHOST_IPS.includes(ip)) {
    return true;
  }
  
  // Check against whitelist
  const isAllowed = WHITELISTED_IPS.includes(ip);
  
  // Log for security monitoring
  if (!isAllowed) {
    console.warn(`[Security] Blocked request from non-whitelisted IP: ${ip}`);
    console.warn(`[Security] Whitelisted IPs: ${WHITELISTED_IPS.join(', ')}`);
  }
  
  return isAllowed;
}

/**
 * Validate request origin against whitelist
 * Returns error message if blocked, or null if allowed
 */
export function validateIPWhitelist(request: Request): string | null {
  // If whitelist is disabled, allow all requests
  if (!IP_WHITELIST_ENABLED) {
    return null;
  }
  
  const clientIP = extractClientIP(request);
  
  // Allow unknown IPs if whitelist is disabled
  if (clientIP === 'unknown') {
    console.warn('[Security] Unable to determine client IP address');
    return IP_WHITELIST_ENABLED ? 'Unable to verify request origin' : null;
  }
  
  if (!isIPWhitelisted(clientIP)) {
    return `Access denied. Your IP (${clientIP}) is not authorized to access this service.`;
  }
  
  return null; // No error, request is allowed
}

/**
 * Get current whitelist configuration (for debugging)
 */
export function getWhitelistConfig() {
  return {
    enabled: IP_WHITELIST_ENABLED,
    whitelistedIPs: WHITELISTED_IPS,
    environment: process.env.NODE_ENV,
  };
}
