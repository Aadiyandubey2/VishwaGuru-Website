import fs from 'fs';
import path from 'path';

function generateSitemap() {
  try {
    console.log('Generating sitemap...');
    
    const baseUrl = 'https://www.vishwaguru.site';
    const pages = [
      // Main Routes
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/personal-support', changefreq: 'monthly', priority: '0.8' },
      
      // Main Sections (using hash fragments for single-page navigation)
      { url: '/#numerology-calculator', changefreq: 'daily', priority: '0.9' },
      { url: '/#numerology-results', changefreq: 'daily', priority: '0.9' },
      { url: '/#language-selector', changefreq: 'monthly', priority: '0.7' }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
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
