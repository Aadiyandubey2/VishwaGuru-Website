import fs from 'fs';
import path from 'path';

function generateSitemap() {
  try {
    console.log('Generating sitemap...');
    
    const baseUrl = 'https://www.vishwaguru.site';
    const pages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/numerology', changefreq: 'daily', priority: '1.0' },
      { url: '/palm-reading', changefreq: 'daily', priority: '1.0' },
      { url: '/dashboard', changefreq: 'daily', priority: '0.9' },
      { url: '/login', changefreq: 'weekly', priority: '0.8' },
      { url: '/signup', changefreq: 'weekly', priority: '0.8' }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
                            http://www.google.com/schemas/sitemap-image/1.1
                            http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    // Write the sitemap to the root directory
    fs.writeFileSync('sitemap.xml', sitemap);
    console.log('Sitemap generated successfully at sitemap.xml');
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }
}

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

generateSitemap();
