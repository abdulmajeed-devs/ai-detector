import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/api/*',
          '/_next/',
          '/node_modules/',
          '/.git/',
          '/coverage/',
        ],
      },
    ],
    sitemap: 'https://aidetectorfree.app/sitemap.xml',
  };
}
