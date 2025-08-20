'use client';

import { LeadStats } from '@/types/lead';
import { formatNumber } from '@/lib/utils';

interface QuickStatsProps {
  stats: LeadStats;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const validPercentage = stats.total > 0 ? (stats.validFormat / stats.total * 100) : 0


  const statItems = [
    {
      label: 'Total Leads',
      value: formatNumber(stats.total),
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      label: 'Valid Emails',
      value: formatNumber(stats.validFormat),
      percentage: validPercentage,
      icon: '✅',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      label: 'Invalid Format',
      value: formatNumber(stats.invalidFormat),
      percentage: stats.total > 0 ? (stats.invalidFormat / stats.total * 100) : 0,
      icon: '❌',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      label: 'No MX Record',
      value: formatNumber(stats.noMx),
      percentage: stats.total > 0 ? (stats.noMx / stats.total * 100) : 0,
      icon: '⚠️',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      label: 'Duplicates',
      value: formatNumber(stats.duplicates),
      percentage: stats.total > 0 ? (stats.duplicates / stats.total * 100) : 0,
      icon: '🔄',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      label: 'Avg Score',
      value: `${stats.avgScore}/100`,
      icon: '📊',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    }
  ];

  if (stats.total === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500">No leads data available</p>
          <p className="text-sm text-gray-400 mt-1">Generate or upload leads to see statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Lead Analytics</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((item, index) => (
          <div key={index} className={`${item.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{item.icon}</div>
              <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center shadow-sm`}>
                <span className="text-white font-bold text-lg">📈</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className={`text-3xl font-bold ${item.textColor}`}>
                {item.value}
              </div>
              <div className="text-gray-600 font-medium">{item.label}</div>
              
              {item.percentage !== undefined && (
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-semibold ${item.textColor}`}>
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      
      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <span>📈 Lead quality: <strong className="text-gray-800">{stats.avgScore >= 70 ? 'Excellent' : stats.avgScore >= 50 ? 'Good' : 'Needs improvement'}</strong></span>
          <span>•</span>
          <span>🎯 Conversion potential: <strong className="text-gray-800">{validPercentage >= 80 ? 'High' : validPercentage >= 60 ? 'Medium' : 'Low'}</strong></span>
        </div>
      </div>
    </div>
  );
}