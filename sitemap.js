import fs from 'fs';
import path from 'path';

function generateSitemap() {
  try {
    console.log('Generating sitemap...');
    
    const baseUrl = 'https://www.vishwaguru.site';
    const pages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/about', changefreq: 'monthly', priority: '0.8' },
      { url: '/contact', changefreq: 'monthly', priority: '0.8' },
      { url: '/numerology', changefreq: 'weekly', priority: '0.9' }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

    // Write the sitemap to a file
    fs.writeFileSync('public/sitemap.xml', sitemap);
    console.log('Sitemap generated successfully at public/sitemap.xml');
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }
}

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

generateSitemap();
