/**
 * Domain & Origin Security Middleware
 * 
 * This middleware protects your ZeroGPT API key by ensuring requests to your API routes
 * come from your own application/domain, not from external sources.
 * 
 * IMPORTANT: This does NOT check end-user IPs (visitors can have any IP).
 * Instead, it verifies that requests originate from YOUR domain/application.
 * 
 * Your Next.js API always runs on YOUR VPS (138.197.80.103), so all ZeroGPT API calls
 * will automatically come from your server IP - protecting your API key.
 */

// Your allowed domain(s) - requests must come from these origins
const ALLOWED_DOMAINS = (process.env.ALLOWED_DOMAINS || 'localhost:3000').split(',').map(d => d.trim());

// Your VPS server IP (for reference and optional strict validation)
const SERVER_IP = process.env.SERVER_IP || '138.197.80.103';

// Additional localhost IPs for development
const LOCALHOST_IPS = ['127.0.0.1', '::1', 'localhost'];

// Enable/disable domain validation (can be controlled via environment variable)
const DOMAIN_VALIDATION_ENABLED = process.env.DOMAIN_VALIDATION_ENABLED === 'true'; // Disabled by default for development

/**
 * Extract the domain/origin from request headers
 * This checks where the request is coming FROM (your website domain)
 */
export function extractRequestOrigin(request: Request): string | null {
  // Try different header formats
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  
  // Origin header (most reliable for API calls)
  if (origin) {
    return origin;
  }
  
  // Referer header (for page navigations)
  if (referer) {
    try {
      const url = new URL(referer);
      return `${url.protocol}//${url.host}`;
    } catch {
      return referer;
    }
  }
  
  // Host header as fallback
  if (host) {
    // In production, this will be your domain
    // In development, this will be localhost:3000
    return host;
  }
  
  return null;
}

/**
 * Extract the real client IP from request headers (for rate limiting only)
 * NOT used for API key protection - just for rate limiting per IP
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
 * Check if a request origin (domain) is allowed
 * This is what actually protects your API key!
 */
export function isOriginAllowed(origin: string | null): boolean {
  // If validation is disabled (development), allow all
  if (!DOMAIN_VALIDATION_ENABLED) {
    console.warn('[Security] Domain validation is DISABLED. All origins are allowed.');
    return true;
  }
  
  // No origin means direct API call (suspicious)
  if (!origin) {
    console.warn('[Security] Request has no origin/referer header');
    return false;
  }
  
  // Check if origin matches any allowed domain
  const isAllowed = ALLOWED_DOMAINS.some(domain => {
    // Handle both full URLs and just domain names
    const normalizedOrigin = origin.toLowerCase();
    const normalizedDomain = domain.toLowerCase();
    
    // Check if origin contains the allowed domain
    return normalizedOrigin.includes(normalizedDomain) || 
           normalizedOrigin === `http://${normalizedDomain}` ||
           normalizedOrigin === `https://${normalizedDomain}`;
  });
  
  // Log for security monitoring
  if (!isAllowed) {
    console.warn(`[Security] Blocked request from unauthorized origin: ${origin}`);
    console.warn(`[Security] Allowed domains: ${ALLOWED_DOMAINS.join(', ')}`);
  } else {
    console.log(`[Security] ✓ Allowed request from: ${origin}`);
  }
  
  return isAllowed;
}

/**
 * Validate request origin against allowed domains
 * Returns error message if blocked, or null if allowed
 * 
 * THIS IS THE MAIN SECURITY CHECK!
 */
export function validateIPWhitelist(request: Request): string | null {
  // If validation is disabled (development), allow all requests
  if (!DOMAIN_VALIDATION_ENABLED) {
    return null;
  }
  
  const origin = extractRequestOrigin(request);
  
  // Allow requests without origin in development
  if (!origin && process.env.NODE_ENV === 'development') {
    return null;
  }
  
  if (!isOriginAllowed(origin)) {
    return `Access denied. Requests must originate from authorized domain. Please visit the website to use this service.`;
  }
  
  return null; // No error, request is allowed
}

/**
 * Get current security configuration (for debugging)
 */
export function getWhitelistConfig() {
  return {
    enabled: DOMAIN_VALIDATION_ENABLED,
    allowedDomains: ALLOWED_DOMAINS,
    serverIP: SERVER_IP,
    environment: process.env.NODE_ENV,
  };
}
