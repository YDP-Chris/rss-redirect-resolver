# RSS Redirect Resolver

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YDP-Chris/rss-redirect-resolver)

**Stop wrestling with RSS redirect URLs.** Instantly decode Google News RSS feeds and resolve redirect URLs to their original article sources. Perfect for automation workflows and data scraping.

![RSS Redirect Resolver Screenshot](https://via.placeholder.com/800x400?text=Screenshot+Coming+Soon)

## 🎯 The Problem

Google News RSS feeds use encoded redirect URLs that break automation tools:

```
❌ https://news.google.com/rss/articles/CBMiUmh0dHBzOi8vd3d3...
✅ https://techcrunch.com/2024/01/15/actual-article-url
```

Instead of direct article links, you get wrapped URLs that require manual decoding and redirect following. This breaks N8N workflows, Zapier automations, and scraping projects.

## ⚡ The Solution

**Paste. Process. Done.**

- 🔗 **Single URLs**: Decode individual Google News redirect URLs instantly
- 📜 **RSS Feeds**: Process entire feeds and resolve all article links at once
- 📱 **Mobile-Ready**: Works perfectly on desktop and mobile devices
- 🚀 **Zero Setup**: No API keys, no signup, no configuration required
- 📊 **Export Ready**: Copy all URLs or export as JSON for automation

## 🛠 Perfect For

- **Data Analysts**: Clean RSS data for N8N, Zapier, and automation workflows
- **Developers**: Bypass redirect URLs in scraping and monitoring projects
- **Researchers**: Extract original sources from RSS aggregators
- **Content Teams**: Track media coverage and find direct article links

## 🚀 Quick Start

### Try It Live
👉 **[rss-redirect-resolver.vercel.app](https://rss-redirect-resolver.vercel.app)**

### Use the API
```javascript
const response = await fetch('/api/resolve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://news.google.com/rss/articles/CBMi...',
    type: 'single' // or 'feed'
  })
});

const result = await response.json();
console.log(result.resolved); // Clean article URL
```

### Self-Host
```bash
git clone https://github.com/YDP-Chris/rss-redirect-resolver
cd rss-redirect-resolver
npm install
npm run dev
```

## 🔧 How It Works

1. **URL Detection**: Automatically detects single URLs vs. RSS feeds
2. **Google News Decoding**: Extracts original URLs from encoded Google News links
3. **Redirect Following**: Follows HTTP redirects to final destinations
4. **Bulk Processing**: Handles up to 50 articles per RSS feed
5. **Error Handling**: Graceful fallback for failed resolutions

## 📖 Use Cases

### N8N Automation
```json
{
  "nodes": [
    {
      "name": "RSS Feed",
      "type": "n8n-nodes-base.rssFeedRead"
    },
    {
      "name": "Resolve URLs",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "parameters": {
        "url": "https://rss-redirect-resolver.vercel.app/api/resolve",
        "method": "POST"
      }
    }
  ]
}
```

### Python Scraping
```python
import requests

def resolve_google_news_url(url):
    response = requests.post('https://rss-redirect-resolver.vercel.app/api/resolve',
                           json={'url': url, 'type': 'single'})
    return response.json()['resolved']

# Clean article URL ready for scraping
article_url = resolve_google_news_url('https://news.google.com/rss/articles/CBMi...')
```

## 🏗 Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **RSS Processing**: RSS-Parser
- **Deployment**: GitHub + Vercel

## 🤝 Contributing

This tool is open source and contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Open source under the MIT License. Feel free to use and modify for your projects.

## 🙏 Built With Love

Created by [Yadkin Data Partners](https://ydp-portfolio.vercel.app) as a free tool for the developer community.

**Need custom automation solutions?** We help data teams build workflows that actually work.

---

⭐ **Found this helpful?** Star the repo and share with fellow developers who've wrestled with RSS feeds!