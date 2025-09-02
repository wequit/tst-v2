
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PersonalStatistics from '@/components/specialist/PersonalStatistics';
import ApplicationQueue from '@/components/specialist/ApplicationQueue';
import KPIDashboard from '@/components/specialist/KPIDashboard';
import WorkloadDistribution from '@/components/specialist/WorkloadDistribution';
import CaseReviewWorkspace from '@/components/specialist/CaseReviewWorkspace';
import InspectionModule from '@/components/specialist/InspectionModule';

export default function SpecialistDashboard() {
  const [language, setLanguage] = useState('ru');
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className="ri-government-line text-3xl text-white"></i>
          </div>
          <div className="text-gray-600 text-lg">Загрузка рабочего места специалиста...</div>
        </div>
      </div>
    );
  }

  // Enhanced specialist data for comprehensive dashboard
  const specialistData = {
    name: language === 'ru' ? 'Айгүл Жумагуловна Касымова' : 'Aigul Zhumaqulovna Kasymova',
    id: 'SPEC-2025-014',
    position: language === 'ru' ? 'Старший специалист МТСР' : 'Senior MTSM Specialist',
    region: language === 'ru' ? 'г. Бишкек' : 'Bishkek city',
    department: language === 'ru' ? 'Отдел семейных пособий' : 'Family Benefits Department',
    assignedCases: 47,
    completedToday: 8,
    completedThisMonth: 156,
    averageProcessingTime: 2.8,
    qualityScore: 96,
    approvalRate: 78
  };

  // Enhanced workload counters with priority alerts
  const workloadCounters = {
    new: 12,
    inReview: 8,
    pendingDecision: 5,
    scheduledInspections: 3,
    supervisorQueue: 2,
    overdueApplications: 4,
    urgentReviews: 6,
    nearDeadline: 9
  };

  const tabs = [
    { id: 'overview', name: language === 'ru' ? 'Панель управления' : 'Dashboard Overview', icon: 'ri-dashboard-3-line' },
    { id: 'queue', name: language === 'ru' ? 'Очередь заявок' : 'Application Queue', icon: 'ri-file-list-3-line' },
    { id: 'review', name: language === 'ru' ? 'Рассмотрение дел' : 'Case Review', icon: 'ri-search-2-line' },
    { id: 'inspection', name: language === 'ru' ? 'Полевые проверки' : 'Field Inspections', icon: 'ri-map-pin-2-line' },
    { id: 'communication', name: language === 'ru' ? 'Коммуникации' : 'Communications', icon: 'ri-message-3-line' },
    { id: 'analytics', name: language === 'ru' ? 'Аналитика' : 'Analytics', icon: 'ri-bar-chart-2-line' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="ri-government-line text-3xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {language === 'ru' ? 'Кабинет специалиста МТСР' : 'MTSM Specialist Cabinet'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {language === 'ru' ? 'Профессиональная рабочая среда для обработки заявок "Үй-бүлөгө көмөк"' : 'Professional workspace for "Үй-бүлөгө көмөк" application processing'}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-red-600 font-medium">
                      УБК-Система v2.0
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: {specialistData.id}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-600" suppressHydrationWarning={true}>{specialistData.completedToday}</div>
                  <div className="text-gray-500">{language === 'ru' ? 'Сегодня' : 'Today'}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-600">{specialistData.assignedCases}</div>
                  <div className="text-gray-500">{language === 'ru' ? 'В работе' : 'Active'}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-600">{specialistData.qualityScore}%</div>
                  <div className="text-gray-500">{language === 'ru' ? 'Качество' : 'Quality'}</div>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <i className="ri-user-3-line text-xl text-white"></i>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{specialistData.name}</div>
                  <div className="text-sm text-gray-600">{specialistData.position}</div>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-2 text-sm rounded font-medium cursor-pointer transition-all ${language === 'ru' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  Русский
                </button>
                <button
                  onClick={() => setLanguage('ky')}
                  className={`px-3 py-2 text-sm rounded font-medium cursor-pointer transition-all ${language === 'ky' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  Кыргызча
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Enhanced Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-3 whitespace-nowrap cursor-pointer transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600 bg-red-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${tab.icon} mr-2 text-lg`}></i>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Performance Metrics Dashboard */}
                <div className="grid lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold opacity-90">
                          {language === 'ru' ? 'Обработано сегодня' : 'Processed Today'}
                        </h3>
                        <div className="text-3xl font-bold mt-2" suppressHydrationWarning={true}>{specialistData.completedToday}</div>
                        <div className="text-sm opacity-75 mt-1">
                          {language === 'ru' ? `За месяц: ${specialistData.completedThisMonth}` : `This month: ${specialistData.completedThisMonth}`}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <i className="ri-file-check-line text-2xl"></i>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold opacity-90">
                          {language === 'ru' ? 'Процент одобрения' : 'Approval Rate'}
                        </h3>
                        <div className="text-3xl font-bold mt-2">{specialistData.approvalRate}%</div>
                        <div className="text-sm opacity-75 mt-1">
                          {language === 'ru' ? 'Выше среднего' : 'Above average'}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <i className="ri-thumb-up-line text-2xl"></i>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold opacity-90">
                          {language === 'ru' ? 'Время обработки' : 'Processing Time'}
                        </h3>
                        <div className="text-3xl font-bold mt-2">{specialistData.averageProcessingTime}</div>
                        <div className="text-sm opacity-75 mt-1">
                          {language === 'ru' ? 'дня в среднем' : 'days average'}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <i className="ri-time-line text-2xl"></i>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold opacity-90">
                          {language === 'ru' ? 'Оценка качества' : 'Quality Score'}
                        </h3>
                        <div className="text-3xl font-bold mt-2">{specialistData.qualityScore}%</div>
                        <div className="text-sm opacity-75 mt-1">
                          {language === 'ru' ? 'Отличный уровень' : 'Excellent level'}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        <i className="ri-medal-line text-2xl"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workload Counters & Priority Alerts */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      <i className="ri-stack-line mr-2 text-blue-600"></i>
                      {language === 'ru' ? 'Текущая нагрузка' : 'Current Workload'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <i className="ri-file-add-line text-white"></i>
                          </div>
                          <div>
                            <div className="font-semibold text-blue-900">{language === 'ru' ? 'Новые' : 'New'}</div>
                            <div className="text-sm text-blue-600">{language === 'ru' ? 'заявки' : 'applications'}</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{workloadCounters.new}</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <i className="ri-search-line text-white"></i>
                          </div>
                          <div>
                            <div className="font-semibold text-yellow-900">{language === 'ru' ? 'На рассмотрении' : 'In Review'}</div>
                            <div className="text-sm text-yellow-600">{language === 'ru' ? 'активные' : 'active'}</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-yellow-600">{workloadCounters.inReview}</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                            <i className="ri-hourglass-line text-white"></i>
                          </div>
                          <div>
                            <div className="font-semibold text-orange-900">{language === 'ru' ? 'Ожидают решения' : 'Pending Decision'}</div>
                            <div className="text-sm text-orange-600">{language === 'ru' ? 'готовые' : 'ready'}</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">{workloadCounters.pendingDecision}</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <i className="ri-map-pin-line text-white"></i>
                          </div>
                          <div>
                            <div className="font-semibold text-purple-900">{language === 'ru' ? 'Проверки' : 'Inspections'}</div>
                            <div className="text-sm text-purple-600">{language === 'ru' ? 'запланированы' : 'scheduled'}</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">{workloadCounters.scheduledInspections}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      <i className="ri-alert-line mr-2 text-red-600"></i>
                      {language === 'ru' ? 'Приоритетные уведомления' : 'Priority Alerts'}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <div className="flex items-center space-x-3">
                          <i className="ri-time-line text-red-500 text-xl"></i>
                          <div>
                            <div className="font-semibold text-red-900">{language === 'ru' ? 'Просроченные дела' : 'Overdue Cases'}</div>
                            <div className="text-sm text-red-600">{language === 'ru' ? 'Требуют немедленного внимания' : 'Require immediate attention'}</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-red-600">{workloadCounters.overdueApplications}</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <div className="flex items-center space-x-3">
                          <i className="ri-alarm-warning-line text-orange-500 text-xl"></i>
                          <div>
                            <div className="font-semibold text-orange-900">{language === 'ru' ? 'Срочные проверки' : 'Urgent Reviews'}</div>
                            <div className="text-sm text-orange-600">{language === 'ru' ? 'Высокий приоритет' : 'High priority'}</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-orange-600">{workloadCounters.urgentReviews}</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex items-center space-x-3">
                          <i className="ri-calendar-check-line text-yellow-500 text-xl"></i>
                          <div>
                            <div className="font-semibold text-yellow-900">{language === 'ru' ? 'Близкие дедлайны' : 'Near Deadline'}</div>
                            <div className="text-sm text-yellow-600">{language === 'ru' ? 'Завершить в течение 2 дней' : 'Complete within 2 days'}</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-yellow-600">{workloadCounters.nearDeadline}</div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center space-x-3">
                          <i className="ri-user-settings-line text-blue-500 text-xl"></i>
                          <div>
                            <div className="font-semibold text-blue-900">{language === 'ru' ? 'Очередь руководителя' : 'Supervisor Queue'}</div>
                            <div className="text-sm text-blue-600">{language === 'ru' ? 'Ожидают утверждения' : 'Awaiting approval'}</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-blue-600">{workloadCounters.supervisorQueue}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    <i className="ri-rocket-line mr-2 text-green-600"></i>
                    {language === 'ru' ? 'Быстрые действия' : 'Quick Actions'}
                  </h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <button onClick={() => setActiveTab('queue')} className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                        <i className="ri-file-list-3-line text-xl text-white"></i>
                      </div>
                      <div className="text-sm font-medium text-blue-900 text-center">
                        {language === 'ru' ? 'Очередь заявок' : 'Application Queue'}
                      </div>
                    </button>

                    <button onClick={() => setActiveTab('review')} className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                        <i className="ri-search-2-line text-xl text-white"></i>
                      </div>
                      <div className="text-sm font-medium text-green-900 text-center">
                        {language === 'ru' ? 'Рассмотрение дел' : 'Case Review'}
                      </div>
                    </button>

                    <button onClick={() => setActiveTab('inspection')} className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                        <i className="ri-map-pin-2-line text-xl text-white"></i>
                      </div>
                      <div className="text-sm font-medium text-purple-900 text-center">
                        {language === 'ru' ? 'Полевые проверки' : 'Field Inspections'}
                      </div>
                    </button>

                    <button onClick={() => setActiveTab('communication')} className="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-3">
                        <i className="ri-message-3-line text-xl text-white"></i>
                      </div>
                      <div className="text-sm font-medium text-yellow-900 text-center">
                        {language === 'ru' ? 'Коммуникации' : 'Communications'}
                      </div>
                    </button>

                    <button className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-3">
                        <i className="ri-file-download-line text-xl text-white"></i>
                      </div>
                      <div className="text-sm font-medium text-red-900 text-center">
                        {language === 'ru' ? 'Экспорт отчетов' : 'Export Reports'}
                      </div>
                    </button>

                    <button onClick={() => setActiveTab('analytics')} className="flex flex-col items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-3">
                        <i className="ri-bar-chart-2-line text-xl text-white"></i>
                      </div>
                      <div className="text-sm font-medium text-indigo-900 text-center">
                        {language === 'ru' ? 'Аналитика' : 'Analytics'}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'queue' && <ApplicationQueue language={language} />}
            {activeTab === 'review' && <CaseReviewWorkspace language={language} applicationId="УБК-2025-001" />}
            {activeTab === 'inspection' && <InspectionModule language={language} />}
            {activeTab === 'communication' && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <i className="ri-message-3-line text-4xl text-yellow-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ru' ? 'Модуль коммуникаций' : 'Communications Module'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'ru' ? 'SMS/email шаблоны, инструменты связи с заявителями, внутренние сообщения' : 'SMS/email templates, applicant communication tools, internal messaging'}
                </p>
                <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                    <i className="ri-mail-line mr-2"></i>
                    {language === 'ru' ? 'Отправить SMS' : 'Send SMS'}
                  </button>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    <i className="ri-file-text-line mr-2"></i>
                    {language === 'ru' ? 'Запросить документы' : 'Request Documents'}
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'analytics' && <KPIDashboard language={language} specialistData={specialistData} />}
          </div>
        </div>
      </div>
    </div>
  );
}
