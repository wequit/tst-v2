'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface WorkloadDistributionProps {
  language: string;
}

export default function WorkloadDistribution({ language }: WorkloadDistributionProps) {
  const [viewType, setViewType] = useState('current');

  // Mock data for workload distribution
  const currentWorkload = [
    { specialist: 'Nurbekоv N.', cases: 24, efficiency: 94, region: 'Chui' },
    { specialist: 'Kasymova A.', cases: 19, efficiency: 98, region: 'Naryn' },
    { specialist: 'Tashiеv O.', cases: 31, efficiency: 89, region: 'Batken' },
    { specialist: 'Sultanova G.', cases: 22, efficiency: 92, region: 'Osh' },
    { specialist: 'Mamatov B.', cases: 27, efficiency: 87, region: 'Jalal-Abad' }
  ];

  const weeklyTrends = [
    { week: 'W1', newCases: 45, completed: 38, pending: 7 },
    { week: 'W2', newCases: 52, completed: 41, pending: 18 },
    { week: 'W3', newCases: 38, completed: 44, pending: 12 },
    { week: 'W4', newCases: 49, completed: 39, pending: 22 }
  ];

  const caseComplexity = [
    { type: language === 'ru' ? 'Простые' : 'Simple', count: 15, avgTime: 1.2 },
    { type: language === 'ru' ? 'Средние' : 'Medium', count: 8, avgTime: 2.8 },
    { type: language === 'ru' ? 'Сложные' : 'Complex', count: 3, avgTime: 4.5 },
    { type: language === 'ru' ? 'Расследования' : 'Investigations', count: 2, avgTime: 7.2 }
  ];

  const upcomingSchedule = [
    { time: '09:00', activity: language === 'ru' ? 'Полевая проверка - Семья Абдуллаевых' : 'Field Inspection - Abdullaev Family', type: 'field', priority: 'high' },
    { time: '11:30', activity: language === 'ru' ? 'Рассмотрение дела APP-2025-045' : 'Case Review APP-2025-045', type: 'review', priority: 'normal' },
    { time: '14:00', activity: language === 'ru' ? 'Совещание с руководителем' : 'Supervisor Meeting', type: 'meeting', priority: 'normal' },
    { time: '15:30', activity: language === 'ru' ? 'Документооборот - 5 заявок' : 'Document Processing - 5 Applications', type: 'admin', priority: 'low' }
  ];

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-600 bg-green-50';
    if (efficiency >= 90) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      normal: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      field: 'ri-map-pin-line',
      review: 'ri-file-text-line',
      meeting: 'ri-team-line',
      admin: 'ri-file-copy-line'
    };
    return icons[type as keyof typeof icons] || 'ri-calendar-line';
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          {language === 'ru' ? 'Управление рабочей нагрузкой' : 'Workload Management'}
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['current', 'trends', 'schedule'].map(view => (
            <button
              key={view}
              onClick={() => setViewType(view)}
              className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap cursor-pointer ${
                viewType === view
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {language === 'ru' ? 
                (view === 'current' ? 'Текущее' : view === 'trends' ? 'Тренды' : 'Расписание') :
                (view === 'current' ? 'Current' : view === 'trends' ? 'Trends' : 'Schedule')
              }
            </button>
          ))}
        </div>
      </div>

      {viewType === 'current' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Team Workload Comparison */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Сравнение нагрузки команды' : 'Team Workload Comparison'}
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentWorkload}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="specialist" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cases" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Case Complexity Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Распределение по сложности' : 'Case Complexity Distribution'}
            </h4>
            <div className="space-y-4">
              {caseComplexity.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-blue-600">{item.count}</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{item.type}</h5>
                      <div className="text-sm text-gray-500">
                        {language === 'ru' ? 'Среднее время' : 'Avg time'}: {item.avgTime}h
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(item.count / 28) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewType === 'trends' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Case Flow */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Еженедельный поток заявок' : 'Weekly Case Flow'}
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="newCases" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Efficiency Tracking */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Отслеживание эффективности' : 'Efficiency Tracking'}
            </h4>
            <div className="space-y-3">
              {currentWorkload.map((specialist, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">{specialist.specialist}</h5>
                    <div className="text-sm text-gray-500">{specialist.region}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">{specialist.cases} cases</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getEfficiencyColor(specialist.efficiency)}`}>
                        {specialist.efficiency}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewType === 'schedule' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">
                {language === 'ru' ? 'Расписание на сегодня' : 'Today\'s Schedule'}
              </h4>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('ru-RU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            <div className="space-y-4">
              {upcomingSchedule.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className={`${getActivityIcon(item.type)} text-blue-600`}></i>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-500">{item.time}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    <h5 className="font-medium text-gray-900 mb-1">{item.activity}</h5>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        <i className="ri-edit-line mr-1"></i>
                        {language === 'ru' ? 'Редактировать' : 'Edit'}
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm">
                        <i className="ri-more-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center whitespace-nowrap cursor-pointer">
                <i className="ri-add-line mr-2"></i>
                {language === 'ru' ? 'Добавить задачу' : 'Add Task'}
              </button>
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Priority Alerts */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h4 className="text-lg font-semibold mb-4 text-red-600">
                <i className="ri-alert-line mr-2"></i>
                {language === 'ru' ? 'Срочные уведомления' : 'Priority Alerts'}
              </h4>
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <i className="ri-time-line text-red-600 mt-1"></i>
                    <div>
                      <h5 className="font-medium text-red-800 text-sm">
                        {language === 'ru' ? 'Просрочена проверка' : 'Overdue Inspection'}
                      </h5>
                      <p className="text-red-700 text-xs">APP-2025-032</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <i className="ri-flag-line text-yellow-600 mt-1"></i>
                    <div>
                      <h5 className="font-medium text-yellow-800 text-sm">
                        {language === 'ru' ? 'Высокий риск' : 'High Risk Case'}
                      </h5>
                      <p className="text-yellow-700 text-xs">APP-2025-051</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <i className="ri-message-line text-blue-600 mt-1"></i>
                    <div>
                      <h5 className="font-medium text-blue-800 text-sm">
                        {language === 'ru' ? 'Запрос документов' : 'Document Request'}
                      </h5>
                      <p className="text-blue-700 text-xs">APP-2025-038</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Быстрые действия' : 'Quick Actions'}
              </h4>
              <div className="space-y-3">
                <button className="w-full bg-green-100 text-green-700 px-4 py-3 rounded-lg hover:bg-green-200 transition-colors inline-flex items-center whitespace-nowrap cursor-pointer">
                  <i className="ri-check-double-line mr-2"></i>
                  {language === 'ru' ? 'Массовое одобрение' : 'Bulk Approve'}
                </button>
                <button className="w-full bg-blue-100 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-200 transition-colors inline-flex items-center whitespace-nowrap cursor-pointer">
                  <i className="ri-file-download-line mr-2"></i>
                  {language === 'ru' ? 'Экспорт отчетов' : 'Export Reports'}
                </button>
                <button className="w-full bg-purple-100 text-purple-700 px-4 py-3 rounded-lg hover:bg-purple-200 transition-colors inline-flex items-center whitespace-nowrap cursor-pointer">
                  <i className="ri-calendar-check-line mr-2"></i>
                  {language === 'ru' ? 'Планировщик проверок' : 'Schedule Inspections'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}