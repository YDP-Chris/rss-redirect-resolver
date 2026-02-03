const Parser = require('rss-parser');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; RSS Redirect Resolver/1.0)'
  }
});

// Decode Google News URLs
function decodeGoogleNewsUrl(url) {
  try {
    // Handle different Google News URL patterns
    if (url.includes('news.google.com/rss/articles/')) {
      // Extract the encoded part after 'articles/'
      const match = url.match(/articles\/([^?]+)/);
      if (match) {
        const encoded = match[1];
        // Try base64 decoding
        try {
          const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
          // Look for URL patterns in decoded string
          const urlMatch = decoded.match(/https?:\/\/[^\s"'<>]+/);
          if (urlMatch) {
            return urlMatch[0];
          }
        } catch (e) {
          // Base64 decoding failed, try other methods
        }
      }
    }

    // Handle Google redirect URLs
    if (url.includes('google.com/url?')) {
      const urlParams = new URL(url).searchParams;
      const directUrl = urlParams.get('url') || urlParams.get('q');
      if (directUrl) {
        return directUrl;
      }
    }

    return url;
  } catch (error) {
    console.error('Error decoding Google News URL:', error);
    return url;
  }
}

// Follow redirects to get final URL
async function resolveRedirects(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Redirect Resolver/1.0)'
      }
    });

    clearTimeout(timeoutId);
    return response.url;
  } catch (error) {
    console.error('Error resolving redirects:', error);
    return url;
  }
}

async function resolveSingleUrl(url) {
  try {
    // First decode if it's a Google News URL
    let resolvedUrl = decodeGoogleNewsUrl(url);

    // Then follow any redirects
    if (resolvedUrl !== url) {
      resolvedUrl = await resolveRedirects(resolvedUrl);
    }

    return {
      original: url,
      resolved: resolvedUrl,
      success: true
    };
  } catch (error) {
    return {
      original: url,
      resolved: url,
      success: false,
      error: error.message
    };
  }
}

async function processFeed(feedUrl) {
  try {
    const feed = await parser.parseURL(feedUrl);

    const results = await Promise.all(
      feed.items.slice(0, 50).map(async (item) => {
        const resolved = await resolveSingleUrl(item.link);
        return {
          title: item.title,
          pubDate: item.pubDate,
          ...resolved
        };
      })
    );

    return {
      feedTitle: feed.title,
      feedDescription: feed.description,
      items: results,
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, type } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    if (type === 'single') {
      const result = await resolveSingleUrl(url);
      return res.json(result);
    }

    if (type === 'feed') {
      const result = await processFeed(url);
      return res.json(result);
    }

    return res.status(400).json({ error: 'Type must be "single" or "feed"' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}