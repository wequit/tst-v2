'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface KPIDashboardProps {
  language: string;
  specialistData: {
    name: string;
    id: string;
    region: string;
    assignedCases: number;
    completedToday: number;
    averageProcessingTime: number;
    qualityScore: number;
  };
}

export default function KPIDashboard({ language, specialistData }: KPIDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Performance data
  const weeklyPerformance = [
    { name: language === 'ru' ? 'Пн' : 'Mon', processed: 8, approved: 6, rejected: 2 },
    { name: language === 'ru' ? 'Вт' : 'Tue', processed: 12, approved: 10, rejected: 2 },
    { name: language === 'ru' ? 'Ср' : 'Wed', processed: 15, approved: 12, rejected: 3 },
    { name: language === 'ru' ? 'Чт' : 'Thu', processed: 10, approved: 8, rejected: 2 },
    { name: language === 'ru' ? 'Пт' : 'Fri', processed: 14, approved: 11, rejected: 3 },
    { name: language === 'ru' ? 'Сб' : 'Sat', processed: 6, approved: 5, rejected: 1 },
    { name: language === 'ru' ? 'Вс' : 'Sun', processed: 4, approved: 3, rejected: 1 }
  ];

  const decisionBreakdown = [
    { name: language === 'ru' ? 'Одобрено' : 'Approved', value: 68, color: '#10b981' },
    { name: language === 'ru' ? 'Отклонено' : 'Rejected', value: 18, color: '#ef4444' },
    { name: language === 'ru' ? 'Требует доработки' : 'Needs Review', value: 14, color: '#f59e0b' }
  ];

  const qualityMetrics = [
    {
      metric: language === 'ru' ? 'Скорость обработки' : 'Processing Speed',
      score: 94,
      target: 90,
      trend: 'up'
    },
    {
      metric: language === 'ru' ? 'Точность решений' : 'Decision Accuracy',
      score: 96,
      target: 95,
      trend: 'up'
    },
    {
      metric: language === 'ru' ? 'Соблюдение сроков' : 'Deadline Compliance',
      score: 89,
      target: 92,
      trend: 'down'
    },
    {
      metric: language === 'ru' ? 'Полнота документации' : 'Documentation Completeness',
      score: 98,
      target: 95,
      trend: 'up'
    }
  ];

  const workloadDistribution = [
    { category: language === 'ru' ? 'Новые заявки' : 'New Applications', count: 12, percentage: 35 },
    { category: language === 'ru' ? 'На проверке' : 'Under Review', count: 8, percentage: 24 },
    { category: language === 'ru' ? 'Ожидают документы' : 'Awaiting Documents', count: 6, percentage: 18 },
    { category: language === 'ru' ? 'Полевые проверки' : 'Field Inspections', count: 4, percentage: 12 },
    { category: language === 'ru' ? 'Готовы к решению' : 'Ready for Decision', count: 4, percentage: 11 }
  ];

  const getScoreColor = (score: number, target: number) => {
    if (score >= target) return 'text-green-600';
    if (score >= target * 0.9) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          {language === 'ru' ? 'Личная аналитика производительности' : 'Personal Performance Analytics'}
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['day', 'week', 'month'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap cursor-pointer ${
                selectedPeriod === period
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {language === 'ru' ? 
                (period === 'day' ? 'День' : period === 'week' ? 'Неделя' : 'Месяц') :
                (period === 'day' ? 'Day' : period === 'week' ? 'Week' : 'Month')
              }
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-semibold mb-4">
            {language === 'ru' ? 'Обработка заявок по дням' : 'Daily Application Processing'}
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="processed" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="approved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
              <Area type="monotone" dataKey="rejected" stackId="3" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Decision Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-semibold mb-4">
            {language === 'ru' ? 'Распределение решений' : 'Decision Distribution'}
          </h4>
          <div className="flex items-center">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={decisionBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {decisionBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3">
              {decisionBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h4 className="text-lg font-semibold mb-6">
          {language === 'ru' ? 'Метрики качества работы' : 'Quality Performance Metrics'}
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualityMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke={metric.score >= metric.target ? "#10b981" : metric.score >= metric.target * 0.9 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(metric.score / 100) * 220} 220`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xl font-bold ${getScoreColor(metric.score, metric.target)}`}>
                    {metric.score}%
                  </span>
                </div>
              </div>
              <h5 className="font-medium text-gray-900 mb-1">{metric.metric}</h5>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-500">
                  {language === 'ru' ? 'Цель' : 'Target'}: {metric.target}%
                </span>
                <i className={`ri-arrow-${metric.trend}-line text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}></i>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Workload Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h4 className="text-lg font-semibold mb-6">
          {language === 'ru' ? 'Текущее распределение рабочей нагрузки' : 'Current Workload Distribution'}
        </h4>
        <div className="space-y-4">
          {workloadDistribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-blue-600">{item.count}</span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{item.category}</h5>
                  <div className="w-40 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{item.percentage}%</div>
                <div className="text-sm text-gray-500">
                  {language === 'ru' ? 'от общей нагрузки' : 'of total workload'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">
          <i className="ri-lightbulb-line mr-2"></i>
          {language === 'ru' ? 'Рекомендации по улучшению' : 'Performance Improvement Recommendations'}
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-yellow-600"></i>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-1">
                  {language === 'ru' ? 'Улучшить соблюдение сроков' : 'Improve Deadline Compliance'}
                </h5>
                <p className="text-sm text-gray-600">
                  {language === 'ru' 
                    ? 'Попробуйте обрабатывать высокоприоритетные заявки в первой половине дня'
                    : 'Try processing high-priority applications in the morning hours'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-check-double-line text-green-600"></i>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-1">
                  {language === 'ru' ? 'Отличное качество решений' : 'Excellent Decision Quality'}
                </h5>
                <p className="text-sm text-gray-600">
                  {language === 'ru' 
                    ? 'Ваша точность решений выше целевого показателя. Продолжайте!'
                    : 'Your decision accuracy is above target. Keep it up!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}