import React, { useState } from 'react';
import { Copy, ExternalLink, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

function ResultList({ results }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  const truncateUrl = (url, maxLength = 60) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No results to display</p>
      </div>
    );
  }

  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success).length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      {results.length > 1 && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              <strong>{results.length}</strong> URLs processed
            </span>
            <div className="flex items-center gap-4">
              {successCount > 0 && (
                <span className="text-green-700 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {successCount} resolved
                </span>
              )}
              {errorCount > 0 && (
                <span className="text-red-700 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errorCount} failed
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 transition-all ${
              result.success
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            {/* Title and Date (for RSS items) */}
            {result.title && (
              <div className="mb-3">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                  {result.title}
                </h3>
                {result.pubDate && (
                  <p className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(result.pubDate)}
                  </p>
                )}
              </div>
            )}

            {/* URLs */}
            <div className="space-y-3">
              {/* Original URL */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Original URL
                </label>
                <div className="flex items-center gap-2 p-2 bg-white border rounded text-sm">
                  <code className="flex-1 text-gray-600 break-all">
                    {truncateUrl(result.original)}
                  </code>
                </div>
              </div>

              {/* Resolved URL */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {result.success ? 'Resolved URL' : 'Error'}
                </label>
                <div className={`flex items-center gap-2 p-2 border rounded text-sm ${
                  result.success ? 'bg-white' : 'bg-red-25'
                }`}>
                  {result.success ? (
                    <>
                      <code className="flex-1 text-gray-900 break-all">
                        {truncateUrl(result.resolved)}
                      </code>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => copyToClipboard(result.resolved, index)}
                          className={`p-1.5 rounded transition-colors ${
                            copiedIndex === index
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                          title="Copy resolved URL"
                        >
                          {copiedIndex === index ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <a
                          href={result.resolved}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </>
                  ) : (
                    <span className="flex-1 text-red-700">
                      {result.error || 'Failed to resolve URL'}
                    </span>
                  )}
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-between text-xs">
                <span className={`flex items-center ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.success ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Successfully resolved
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Resolution failed
                    </>
                  )}
                </span>

                {result.success && result.resolved !== result.original && (
                  <span className="text-blue-600">
                    URL was redirected
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultList;