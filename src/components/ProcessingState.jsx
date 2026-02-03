import React from 'react';
import { RefreshCw, Rss, Globe } from 'lucide-react';

function ProcessingState({ type }) {
  const isRssFeed = type === 'feed';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Icon */}
        <div className="relative">
          <div className="animate-spin">
            <RefreshCw className="w-8 h-8 text-blue-600" />
          </div>
          <div className="absolute -bottom-1 -right-1">
            {isRssFeed ? (
              <Rss className="w-4 h-4 text-orange-500 bg-white rounded-full" />
            ) : (
              <Globe className="w-4 h-4 text-gray-500 bg-white rounded-full" />
            )}
          </div>
        </div>

        {/* Processing Message */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isRssFeed ? 'Processing RSS Feed...' : 'Resolving URL...'}
          </h3>
          <p className="text-sm text-gray-600">
            {isRssFeed
              ? 'Parsing feed and resolving all article URLs. This may take a moment.'
              : 'Following redirects to find the original article source.'
            }
          </p>
        </div>

        {/* Progress Steps */}
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Fetching</span>
            {isRssFeed && <span>Parsing</span>}
            <span>Resolving</span>
            <span>Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-4 w-full max-w-md">
          <p className="text-xs text-blue-700">
            💡 <strong>Tip:</strong>{' '}
            {isRssFeed
              ? 'RSS feeds are processed in batches of up to 50 articles for optimal performance.'
              : 'Some URLs may require multiple redirect hops to reach the final destination.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProcessingState;