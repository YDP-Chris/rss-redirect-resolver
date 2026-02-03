import React, { useState } from 'react';
import { Link, RefreshCw, AlertCircle, CheckCircle, Copy, Download } from 'lucide-react';
import UrlInput from './components/UrlInput';
import ResultList from './components/ResultList';
import ProcessingState from './components/ProcessingState';

function App() {
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [inputType, setInputType] = useState('single'); // 'single' or 'feed'

  const processUrl = async (url, type) => {
    setIsProcessing(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('/api/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          type: type
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process URL');
      }

      if (type === 'single') {
        setResults([data]);
      } else if (type === 'feed') {
        if (data.success) {
          setResults(data.items || []);
        } else {
          throw new Error(data.error || 'Failed to process RSS feed');
        }
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportResults = () => {
    const exportData = results.map(result => ({
      title: result.title || 'N/A',
      original: result.original,
      resolved: result.resolved,
      success: result.success
    }));

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rss-resolved-urls.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyAllUrls = async () => {
    const urls = results
      .filter(r => r.success)
      .map(r => r.resolved)
      .join('\\n');

    try {
      await navigator.clipboard.writeText(urls);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy URLs:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Link className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">RSS Redirect Resolver</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Instantly resolve Google News RSS redirect URLs to their original sources.
            Perfect for automation workflows and data scraping.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <UrlInput
            onSubmit={processUrl}
            isProcessing={isProcessing}
            onTypeChange={setInputType}
            inputType={inputType}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && <ProcessingState type={inputType} />}

        {/* Results Section */}
        {results.length > 0 && !isProcessing && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Resolved URLs ({results.length})
              </h2>

              {results.length > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={copyAllUrls}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy All
                  </button>
                  <button
                    onClick={exportResults}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export JSON
                  </button>
                </div>
              )}
            </div>

            <ResultList results={results} />
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to use</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <p>
              <strong>Single URL:</strong> Paste a Google News redirect URL to resolve it to the original article source.
            </p>
            <p>
              <strong>RSS Feed:</strong> Paste an RSS feed URL to process all article links and resolve them in bulk.
            </p>
            <p>
              <strong>Example Google News URL:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                https://news.google.com/rss/articles/CBMi...
              </code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Built with ❤️ by <a href="https://ydp-portfolio.vercel.app" className="text-blue-600 hover:text-blue-700">Yadkin Data Partners</a></p>
          <p className="mt-1">Free tool for developers and data analysts</p>
        </div>
      </div>
    </div>
  );
}

export default App;