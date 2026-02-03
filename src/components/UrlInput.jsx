import React, { useState } from 'react';
import { Send, Globe, Rss } from 'lucide-react';

function UrlInput({ onSubmit, isProcessing, onTypeChange, inputType }) {
  const [url, setUrl] = useState('');
  const [detectedType, setDetectedType] = useState('single');

  const detectUrlType = (inputUrl) => {
    const trimmed = inputUrl.trim().toLowerCase();

    // Check for RSS feed indicators
    if (trimmed.includes('/rss') ||
        trimmed.includes('/feed') ||
        trimmed.includes('.xml') ||
        trimmed.includes('rss.xml') ||
        trimmed.includes('feed.xml')) {
      return 'feed';
    }

    return 'single';
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    if (newUrl.trim()) {
      const type = detectUrlType(newUrl);
      setDetectedType(type);
      onTypeChange(type);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) {
      return;
    }

    // Validate URL format
    try {
      new URL(url.trim());
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    onSubmit(url.trim(), inputType);
  };

  const handleTypeChange = (type) => {
    setDetectedType(type);
    onTypeChange(type);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
          Enter URL to resolve
        </label>

        <div className="relative">
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://news.google.com/rss/articles/... or RSS feed URL"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={isProcessing}
            required
          />

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {detectedType === 'feed' ? (
              <Rss className="w-5 h-5 text-orange-500" />
            ) : (
              <Globe className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Type Selection */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Process as:</span>

        <label className="inline-flex items-center">
          <input
            type="radio"
            name="url-type"
            value="single"
            checked={inputType === 'single'}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <span className="ml-2 text-sm text-gray-700 flex items-center">
            <Globe className="w-4 h-4 mr-1" />
            Single URL
          </span>
        </label>

        <label className="inline-flex items-center">
          <input
            type="radio"
            name="url-type"
            value="feed"
            checked={inputType === 'feed'}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <span className="ml-2 text-sm text-gray-700 flex items-center">
            <Rss className="w-4 h-4 mr-1" />
            RSS Feed
          </span>
        </label>
      </div>

      {detectedType !== inputType && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 This looks like {detectedType === 'feed' ? 'an RSS feed' : 'a single URL'}.
            Consider selecting "{detectedType === 'feed' ? 'RSS Feed' : 'Single URL'}" for better results.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!url.trim() || isProcessing}
        className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            Processing...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Resolve URLs
          </>
        )}
      </button>
    </form>
  );
}

export default UrlInput;