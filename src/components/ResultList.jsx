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
      <div className="text-center py-8 text-slate-500">
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
        <div className="bg-slate-50 rounded-lg p-4 border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700">
              <strong>{results.length}</strong> URLs processed
            </span>
            <div className="flex items-center gap-4">
              {successCount > 0 && (
                <span className="text-success-700 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {successCount} resolved
                </span>
              )}
              {errorCount > 0 && (
                <span className="text-error-700 flex items-center">
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
                ? 'border-success-200 bg-success-50'
                : 'border-error-200 bg-error-50'
            }`}
          >
            {/* Title and Date (for RSS items) */}
            {result.title && (
              <div className="mb-3">
                <h3 className="font-medium text-slate-900 mb-1 line-clamp-2">
                  {result.title}
                </h3>
                {result.pubDate && (
                  <p className="text-xs text-slate-500 flex items-center">
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
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Original URL
                </label>
                <div className="flex items-center gap-2 p-2 bg-white border rounded text-sm">
                  <code className="flex-1 text-slate-600 break-all font-mono text-xs">
                    {truncateUrl(result.original)}
                  </code>
                </div>
              </div>

              {/* Resolved URL */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {result.success ? 'Resolved URL' : 'Error'}
                </label>
                <div className={`flex items-center gap-2 p-2 border rounded text-sm ${
                  result.success ? 'bg-white' : 'bg-error-25'
                }`}>
                  {result.success ? (
                    <>
                      <code className="flex-1 text-slate-900 break-all font-mono text-xs">
                        {truncateUrl(result.resolved)}
                      </code>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => copyToClipboard(result.resolved, index)}
                          className={`p-1.5 rounded transition-colors ${
                            copiedIndex === index
                              ? 'bg-success-100 text-success-700'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
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
                          className="p-1.5 bg-primary-100 hover:bg-primary-200 text-primary-600 rounded transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </>
                  ) : (
                    <span className="flex-1 text-error-700">
                      {result.error || 'Failed to resolve URL'}
                    </span>
                  )}
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-between text-xs">
                <span className={`flex items-center ${
                  result.success ? 'text-success-700' : 'text-error-700'
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
                  <span className="text-primary-600">
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