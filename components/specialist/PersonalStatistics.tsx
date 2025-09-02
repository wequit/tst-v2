'use client';

import { useState, useEffect } from 'react';

interface PersonalStatisticsProps {
  language: string;
}

export default function PersonalStatistics({ language }: PersonalStatisticsProps) {
  const [isClient, setIsClient] = useState(false);
  const [timeFilter, setTimeFilter] = useState('today');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Mock personal statistics data
  const todayStats = {
    casesProcessed: 12,
    monthlyProcessed: 247,
    approvalRate: 87,
    avgProcessingTime: 2.4,
    qualityScore: 94
  };

  const quickCounters = [
    {
      label: language === 'ru' ? 'Новые заявки' : 'New Applications',
      value: 12,
      icon: 'ri-file-add-line',
      color: 'blue',
      trend: '+3'
    },
    {
      label: language === 'ru' ? 'На рассмотрении' : 'In Review',
      value: 8,
      icon: 'ri-time-line',
      color: 'yellow',
      trend: '-2'
    },
    {
      label: language === 'ru' ? 'Ожидают решения' : 'Pending Decisions',
      value: 5,
      icon: 'ri-question-line',
      color: 'orange',
      trend: '+1'
    },
    {
      label: language === 'ru' ? 'Полевые проверки' : 'Field Inspections',
      value: 3,
      icon: 'ri-map-pin-line',
      color: 'purple',
      trend: '0'
    }
  ];

  const personalMetrics = [
    {
      title: language === 'ru' ? 'Обработано сегодня' : 'Processed Today',
      value: `${todayStats.casesProcessed}`,
      subtitle: language === 'ru' ? 'заявок' : 'cases',
      icon: 'ri-file-check-line',
      color: 'bg-blue-50 text-blue-600',
      change: '+15%'
    },
    {
      title: language === 'ru' ? 'Обработано в месяце' : 'Monthly Processed',
      value: `${todayStats.monthlyProcessed}`,
      subtitle: language === 'ru' ? 'заявок' : 'cases',
      icon: 'ri-calendar-check-line',
      color: 'bg-green-50 text-green-600',
      change: '+8%'
    },
    {
      title: language === 'ru' ? 'Процент одобрений' : 'Approval Rate',
      value: `${todayStats.approvalRate}%`,
      subtitle: language === 'ru' ? 'одобрено' : 'approved',
      icon: 'ri-check-double-line',
      color: 'bg-emerald-50 text-emerald-600',
      change: '+2%'
    },
    {
      title: language === 'ru' ? 'Среднее время' : 'Average Time',
      value: `${todayStats.avgProcessingTime}`,
      subtitle: language === 'ru' ? 'дня' : 'days',
      icon: 'ri-timer-line',
      color: 'bg-purple-50 text-purple-600',
      change: '-0.3'
    },
    {
      title: language === 'ru' ? 'Качество работы' : 'Quality Score',
      value: `${todayStats.qualityScore}%`,
      subtitle: language === 'ru' ? 'оценка' : 'score',
      icon: 'ri-star-line',
      color: 'bg-yellow-50 text-yellow-600',
      change: '+1%'
    }
  ];

  const getCounterColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-green-600';
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          {language === 'ru' ? 'Личная статистика' : 'Personal Statistics'}
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['today', 'week', 'month'].map(filter => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap cursor-pointer ${
                timeFilter === filter
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {language === 'ru' ? 
                (filter === 'today' ? 'Сегодня' : filter === 'week' ? 'Неделя' : 'Месяц') :
                (filter === 'today' ? 'Today' : filter === 'week' ? 'Week' : 'Month')
              }
            </button>
          ))}
        </div>
      </div>

      {/* Personal Performance Metrics */}
      <div className="grid grid-cols-5 gap-4">
        {personalMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.color}`}>
                <i className={`${metric.icon} text-xl`}></i>
              </div>
              <span className={`text-sm font-medium ${getTrendColor(metric.change)}`}>
                {metric.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-600">{metric.subtitle}</div>
            <div className="text-xs text-gray-500 mt-2">{metric.title}</div>
          </div>
        ))}
      </div>

      {/* Quick Counters Grid */}
      <div className="grid grid-cols-4 gap-4">
        {quickCounters.map((counter, index) => (
          <div key={index} className={`rounded-lg p-4 border ${getCounterColor(counter.color)}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center`}>
                <i className={`${counter.icon} text-lg text-gray-700`}></i>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white ${getTrendColor(counter.trend)}`}>
                {counter.trend}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{counter.value}</div>
            <div className="text-sm font-medium">{counter.label}</div>
          </div>
        ))}
      </div>

      {/* Priority Alerts Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            <i className="ri-alarm-warning-line mr-2 text-red-600"></i>
            {language === 'ru' ? 'Приоритетные уведомления' : 'Priority Alerts'}
          </h4>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">
            {language === 'ru' ? 'Все уведомления' : 'View All'}
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-red-600"></i>
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-red-800">
                {language === 'ru' ? 'Просроченные заявки' : 'Overdue Applications'}
              </h5>
              <p className="text-sm text-red-700">APP-2025-032, APP-2025-028</p>
            </div>
            <button className="text-red-700 hover:text-red-800 text-sm font-medium cursor-pointer">
              {language === 'ru' ? 'Обработать' : 'Process'}
            </button>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-alert-line text-yellow-600"></i>
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-yellow-800">
                {language === 'ru' ? 'Высокий риск мошенничества' : 'High Fraud Risk'}
              </h5>
              <p className="text-sm text-yellow-700">APP-2025-051 - {language === 'ru' ? 'Риск 89%' : 'Risk 89%'}</p>
            </div>
            <button className="text-yellow-700 hover:text-yellow-800 text-sm font-medium cursor-pointer">
              {language === 'ru' ? 'Проверить' : 'Review'}
            </button>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-message-line text-blue-600"></i>
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-blue-800">
                {language === 'ru' ? 'Запросы от руководителя' : 'Supervisor Requests'}
              </h5>
              <p className="text-sm text-blue-700">{language === 'ru' ? '2 новых запроса' : '2 new requests'}</p>
            </div>
            <button className="text-blue-700 hover:text-blue-800 text-sm font-medium cursor-pointer">
              {language === 'ru' ? 'Открытьфф' : 'Open'}
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Widget */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            <i className="ri-calendar-line mr-2 text-blue-600"></i>
            {language === 'ru' ? 'Календарь мероприятий' : 'Calendar Widget'}
          </h4>
          <div className="text-sm text-gray-500" suppressHydrationWarning={true}>
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-2 h-8 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-gray-900">09:00 - {language === 'ru' ? 'Полевая проверка' : 'Field Inspection'}</h5>
              <p className="text-sm text-gray-600">{language === 'ru' ? 'Семья Абдуллаевых - Чуйская область' : 'Abdullaev Family - Chui Region'}</p>
            </div>
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
              {language === 'ru' ? 'Срочно' : 'Urgent'}
            </span>
          </div>

          <div className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-gray-900">14:00 - {language === 'ru' ? 'Совещание отдела' : 'Department Meeting'}</h5>
              <p className="text-sm text-gray-600">{language === 'ru' ? 'Еженедельный отчет по заявкам' : 'Weekly applications report'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-2 h-8 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-gray-900">16:00 - {language === 'ru' ? 'Дедлайн' : 'Deadline'}</h5>
              <p className="text-sm text-gray-600">{language === 'ru' ? 'Завершить обзор 5 заявок' : 'Complete review of 5 applications'}</p>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
              {language === 'ru' ? 'Напоминание' : 'Reminder'}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium cursor-pointer">
            <i className="ri-add-line mr-2"></i>
            {language === 'ru' ? 'Добавить в календарь' : 'Add to Calendar'}
          </button>
        </div>
      </div>
    </div>
  );
}