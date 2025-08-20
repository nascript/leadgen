'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface UploadAreaProps {
  onDataSubmit: (data: { keyword?: string; urls?: string[]; csvData?: string }) => void;
  isLoading?: boolean;
}

export default function UploadArea({ onDataSubmit, isLoading }: UploadAreaProps) {
  const [activeTab, setActiveTab] = useState<'keyword' | 'urls' | 'csv'>('keyword');
  const [keyword, setKeyword] = useState('');
  const [urls, setUrls] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = async () => {
    if (activeTab === 'keyword' && keyword.trim()) {
      onDataSubmit({ keyword: keyword.trim() });
    } else if (activeTab === 'urls' && urls.trim()) {
      const urlList = urls.split('\n').map(url => url.trim()).filter(Boolean);
      onDataSubmit({ urls: urlList });
    } else if (activeTab === 'csv' && csvFile) {
      const csvData = await csvFile.text();
      onDataSubmit({ csvData });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const isSubmitDisabled = () => {
    if (isLoading) return true;
    
    switch (activeTab) {
      case 'keyword':
        return !keyword.trim();
      case 'urls':
        return !urls.trim();
      case 'csv':
        return !csvFile;
      default:
        return true;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 backdrop-blur-sm">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Generate Leads</h2>
        </div>
        <p className="text-gray-600 text-lg">
          Choose your preferred method to generate high-quality leads
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-50 p-2 rounded-xl mb-8 border border-gray-100">
        {[
          { id: 'keyword', label: 'Keyword Search', icon: '🔍', desc: 'Search by keywords' },
          { id: 'urls', label: 'URL List', icon: '🔗', desc: 'Scrape from URLs' },
          { id: 'csv', label: 'CSV Upload', icon: '📄', desc: 'Upload existing data' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'keyword' | 'csv')}
            className={`flex-1 flex flex-col items-center justify-center space-y-2 py-4 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-md border border-blue-200 transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="font-semibold">{tab.label}</span>
            <span className="text-xs opacity-75">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'keyword' && (
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Search Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., SaaS startup, fintech company, AI startup"
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white text-black placeholder-black"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm font-medium">
                💡 Tip: Be specific with your keywords for better results. Include location, industry, or company size.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'urls' && (
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              URLs to Scrape
            </label>
            <div className="relative">
              <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="Enter URLs, one per line:\nhttps://example.com/about\nhttps://another-site.com/team\nhttps://company.com/contact"
                rows={8}
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none text-black placeholder-black"
              />
              <div className="absolute top-4 right-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm font-medium">
                🎯 Best practices: Include company about pages, team pages, and contact pages for maximum lead extraction.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'csv' && (
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Upload CSV File
            </label>
            <div 
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 group",
                isDragOver 
                  ? "border-blue-500 bg-blue-100 scale-105" 
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-lg text-gray-700">
                    <span className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      Click to upload
                    </span>
                    <span className="text-gray-500"> or drag and drop your CSV file</span>
                  </div>
                  <p className="text-sm text-gray-500">Supports CSV files with lead data</p>
                  {csvFile && (
                    <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-green-800 font-semibold">
                          {csvFile.name} ready to upload
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            className={cn(
              'w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 transform',
              isSubmitDisabled()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Processing your request...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Leads</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}