'use client';

import { useState } from 'react';
import { FilterOptions } from '@/types/lead';
import { cn } from '@/lib/utils';

interface FiltersBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalLeads: number;
  filteredLeads: number;
}

export default function FiltersBar({ onFilterChange, totalLeads, filteredLeads }: FiltersBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [seniorRolesOnly, setSeniorRolesOnly] = useState(false);
  const [goodTldsOnly, setGoodTldsOnly] = useState(false);
  const [minScore, setMinScore] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const filters: FilterOptions = {
      searchTerm,
      seniorRolesOnly,
      goodTldsOnly,
      minScore,
      ...newFilters
    };
    onFilterChange(filters);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    handleFilterChange({ searchTerm: value });
  };

  const handleSeniorRolesChange = (checked: boolean) => {
    setSeniorRolesOnly(checked);
    handleFilterChange({ seniorRolesOnly: checked });
  };

  const handleGoodTldsChange = (checked: boolean) => {
    setGoodTldsOnly(checked);
    handleFilterChange({ goodTldsOnly: checked });
  };

  const handleMinScoreChange = (value: number) => {
    setMinScore(value);
    handleFilterChange({ minScore: value });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSeniorRolesOnly(false);
    setGoodTldsOnly(false);
    setMinScore(0);
    handleFilterChange({
      searchTerm: '',
      seniorRolesOnly: false,
      goodTldsOnly: false,
      minScore: 0
    });
  };

  const hasActiveFilters = searchTerm || seniorRolesOnly || goodTldsOnly || minScore > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Smart Filters</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200">
            <span className="text-blue-700 font-semibold">
              {filteredLeads} of {totalLeads} leads
            </span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="🔍 Search by name, company, email, domain, or role..."
            className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl leading-5 bg-gray-50 text-black placeholder-black focus:outline-none focus:placeholder-gray-600 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 hover:bg-white"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 cursor-pointer">
            <input
              type="checkbox"
              checked={seniorRolesOnly}
              onChange={(e) => handleSeniorRolesChange(e.target.checked)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-lg font-semibold text-blue-700">👔 Senior roles only</span>
          </label>

          <label className="flex items-center bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 cursor-pointer">
            <input
              type="checkbox"
              checked={goodTldsOnly}
              onChange={(e) => handleGoodTldsChange(e.target.checked)}
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-lg font-semibold text-purple-700">🌟 Good TLDs (.com, .io, .ai)</span>
          </label>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-3 text-lg text-emerald-600 hover:text-emerald-800 font-semibold flex items-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200"
          >
            ⚙️ Advanced filters
            <svg
              className={cn(
                'ml-2 h-5 w-5 transition-transform',
                showAdvanced ? 'rotate-180' : ''
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Score: {minScore}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={minScore}
                onChange={(e) => handleMinScoreChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            {/* Score Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Score Filters
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleMinScoreChange(70)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-full border transition-colors',
                    minScore === 70
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  )}
                >
                  Hot Leads (70+)
                </button>
                <button
                  onClick={() => handleMinScoreChange(40)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-full border transition-colors',
                    minScore === 40
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  )}
                >
                  Warm Leads (40+)
                </button>
                <button
                  onClick={() => handleMinScoreChange(0)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-full border transition-colors',
                    minScore === 0
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  )}
                >
                  All Leads
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: &quot;{searchTerm}&quot;
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {seniorRolesOnly && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Senior roles
                <button
                  onClick={() => handleSeniorRolesChange(false)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {goodTldsOnly && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Good TLDs
                <button
                  onClick={() => handleGoodTldsChange(false)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {minScore > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Min score: {minScore}
                <button
                  onClick={() => handleMinScoreChange(0)}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}