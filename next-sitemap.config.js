/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ments.app', // Updated with your domain
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/', // Allow all pages to be crawled
      },
    ],
  },
  exclude: ['/server-sitemap.xml'],
  generateIndexSitemap: true,
  // Additional options for better SEO
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  autoLastmod: true,
}
