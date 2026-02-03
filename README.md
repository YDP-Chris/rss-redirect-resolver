# RSS Redirect Resolver

A simple web tool that resolves Google News RSS redirect URLs to their original article sources. Perfect for automation workflows, data scraping, and bypassing encoded redirect links.

## 🚀 Features

- **Single URL Resolution**: Decode individual Google News redirect URLs
- **RSS Feed Processing**: Parse entire RSS feeds and resolve all article links
- **Instant Results**: Fast processing with real-time feedback
- **Copy & Export**: One-click copying and JSON export functionality
- **Mobile-Friendly**: Responsive design that works on all devices
- **Zero Setup**: No API keys or configuration required

## 🛠 How It Works

1. **Paste URL**: Enter a Google News redirect URL or RSS feed URL
2. **Auto-Detection**: Tool automatically detects URL type (single or feed)
3. **Processing**: Decodes Google URLs and follows redirects to original sources
4. **Results**: Get clean, direct URLs ready for use in your projects

## 📋 Use Cases

- **Data Analysts**: Clean RSS data for automation workflows
- **Developers**: Bypass redirect URLs in scraping projects
- **Researchers**: Get direct article links for analysis
- **Content Creators**: Find original sources behind RSS feeds

## 🔧 Technical Details

### Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Parsing**: RSS-Parser library
- **Deployment**: Vercel

### API Endpoint
```
POST /api/resolve
{
  "url": "https://news.google.com/rss/articles/...",
  "type": "single" | "feed"
}
```

### URL Resolution Process
1. **Google News Decoding**: Extracts original URLs from encoded Google News links
2. **Redirect Following**: Follows HTTP redirects to final destinations
3. **Error Handling**: Graceful fallback for failed resolutions

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Deployment

This project is configured for Vercel deployment:

1. Push to GitHub repository
2. Connect to Vercel
3. Deploy automatically

## 🤝 Contributing

Built by [Yadkin Data Partners](https://ydp-portfolio.vercel.app) as a free tool for the developer community.

## 📝 License

Open source - feel free to use and modify for your projects.

---

**Need help with data automation?** Check out [Yadkin Data Partners](https://ydp-portfolio.vercel.app) for custom solutions.