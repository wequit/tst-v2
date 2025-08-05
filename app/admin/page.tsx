
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockApplications, mockFamilies, regions } from '@/lib/mockData';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [language, setLanguage] = useState('ru');
  const [activeTab, setActiveTab] = useState('overview');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const t = translations[language as keyof typeof translations];

  const monthlyData = [
    { month: 'Янв', applications: 145, approved: 112, payments: 1890000 },
    { month: 'Фев', applications: 167, approved: 128, payments: 2140000 },
    { month: 'Мар', applications: 189, approved: 145, payments: 2430000 },
    { month: 'Апр', applications: 203, approved: 156, payments: 2670000 },
    { month: 'Май', applications: 234, approved: 178, payments: 2890000 },
    { month: 'Июн', applications: 247, approved: 189, payments: 3120000 }
  ];

  const regionData = [
    { name: 'Бишкек', applications: 450, approved: 340, payments: 5670000 },
    { name: 'Ош', applications: 380, approved: 295, payments: 4890000 },
    { name: 'Нарын', applications: 120, approved: 98, payments: 1650000 },
    { name: 'Баткен', applications: 95, approved: 78, payments: 1340000 },
    { name: 'Джалал-Абад', applications: 290, approved: 225, payments: 3780000 },
    { name: 'Иссык-Куль', applications: 85, approved: 67, payments: 1120000 },
    { name: 'Талас', applications: 75, approved: 58, payments: 980000 }
  ];

  const benefitTypes = [
    { name: language === 'ru' ? 'Базовое пособие' : 'Негизги жөлөкпул', value: 68, color: '#EF4444' },
    { name: language === 'ru' ? 'Горные районы' : 'Тоолуу райондор', value: 18, color: '#F59E0B' },
    { name: language === 'ru' ? 'Приграничные' : 'Чек ара', value: 14, color: '#10B981' }
  ];

  const tabs = [
    { id: 'overview', name: language === 'ru' ? 'Обзор' : 'Көрүү', icon: 'ri-dashboard-line' },
    { id: 'analytics', name: language === 'ru' ? 'Аналитика' : 'Аналитика', icon: 'ri-bar-chart-line' },
    // { id: 'users', name: language === 'ru' ? 'Пользователи' : 'Колдонуучулар', icon: 'ri-user-settings-line' },
    { id: 'payments', name: language === 'ru' ? 'Выплаты' : 'Төлөмдөр', icon: 'ri-money-dollar-circle-line' },
    { id: 'settings', name: language === 'ru' ? 'Настройки' : 'Жөндөөлөр', icon: 'ri-settings-line' }
  ];

  const mockUsers = [
    { id: 1, name: 'Нурбек Жумабеков', role: 'specialist', region: 'Бишкек', status: 'active', lastLogin: '2024-01-20 15:30' },
    { id: 2, name: 'Айгүл Касымова', role: 'specialist', region: 'Нарын', status: 'active', lastLogin: '2024-01-20 14:15' },
    { id: 3, name: 'Омурбек Ташиев', role: 'specialist', region: 'Баткен', status: 'active', lastLogin: '2024-01-20 12:45' },
    { id: 4, name: 'Жанара Сулайманова', role: 'admin', region: 'Все', status: 'active', lastLogin: '2024-01-20 16:20' }
  ];

  const mockPayments = [
    { id: 'PAY-001', family: 'Гүлнара Осмонова', amount: 4140, date: '2024-01-20', status: 'paid', region: 'Нарын' },
    { id: 'PAY-002', family: 'Жамиля Турдубекова', amount: 3880, date: '2024-01-20', status: 'paid', region: 'Баткен' },
    { id: 'PAY-003', family: 'Асель Маматова', amount: 2400, date: '2024-01-20', status: 'processing', region: 'Ош' },
    { id: 'PAY-004', family: 'Бурул Эркебекова', amount: 1380, date: '2024-01-20', status: 'paid', region: 'Бишкек' }
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="ri-government-line text-2xl text-white"></i>
          </div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-red-600">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <i className="ri-government-line text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{t.adminPanel}</h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? 'Системная панель администратора' : 'Системанын администратор панели'}
                  </p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="ri-shield-user-line text-red-600"></i>
                </div>
                <span className="text-sm font-medium">
                  {language === 'ru' ? 'Администратор' : 'Администратор'}
                </span>
              </div>
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-file-list-3-line text-2xl text-blue-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">1,495</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'Всего заявок' : 'Бардык арыздар'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-check-line text-2xl text-green-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">1,161</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'Одобрено' : 'Бекитилди'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-money-dollar-circle-line text-2xl text-yellow-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">19.4M</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'Выплачено сом' : 'Төлөнгөн сом'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-team-line text-2xl text-purple-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">8,420</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'Семей получают' : 'Үй-бүлө алат'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-user-settings-line text-2xl text-red-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">47</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'Специалистов' : 'Адистер'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-1 py-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Charts Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Monthly Trends */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'ru' ? 'Динамика по месяцам' : 'Айлык динамика'}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="applications" stackId="1" stroke="#EF4444" fill="#EF4444" name={language === 'ru' ? 'Заявки' : 'Арыздар'} />
                        <Area type="monotone" dataKey="approved" stackId="2" stroke="#10B981" fill="#10B981" name={language === 'ru' ? 'Одобрено' : 'Бекитилди'} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Regional Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'ru' ? 'По регионам' : 'Аймактар боюнча'}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={regionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="approved" fill="#EF4444" name={language === 'ru' ? 'Одобрено' : 'Бекитилди'} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Payment Trends */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'ru' ? 'Объем выплат' : 'Төлөмдөрдүн көлөмү'}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`${(value / 1000000).toFixed(1)}M сом`, language === 'ru' ? 'Выплаты' : 'Төлөмдөр']} />
                      <Legend />
                      <Line type="monotone" dataKey="payments" stroke="#F59E0B" strokeWidth={3} name={language === 'ru' ? 'Выплаты' : 'Төлөмдөр'} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {/* Benefit Types Distribution */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'ru' ? 'Распределение типов пособий' : 'Жөлөкпулдардын түрлөрүнүн бөлүштүрүлүшү'}
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={benefitTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : '0'}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {benefitTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'ru' ? 'Ключевые показатели' : 'Негизги көрсөткүчтөр'}
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-900">
                            {language === 'ru' ? 'Средний размер пособия' : 'Орточо жөлөкпул көлөмү'}
                          </span>
                          <span className="text-xl font-bold text-blue-600" suppressHydrationWarning={true}>2,347 сом</span>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-green-900">
                            {language === 'ru' ? 'Процент одобрений' : 'Бекитүү пайызы'}
                          </span>
                          <span className="text-xl font-bold text-green-600">77.7%</span>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-yellow-900">
                            {language === 'ru' ? 'Среднее время обработки' : 'Орточо иштетүү убакыты'}
                          </span>
                          <span className="text-xl font-bold text-yellow-600">3.2 дня</span>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-purple-900">
                            {language === 'ru' ? 'Детей получают пособие' : 'Балдар жөлөкпул алат'}
                          </span>
                          <span className="text-xl font-bold text-purple-600" suppressHydrationWarning={true}>14,230</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Управление пользователями' : 'Колдонуучуларды башкаруу'}
                  </h3>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 inline-flex items-center whitespace-nowrap cursor-pointer">
                    <i className="ri-user-add-line mr-2"></i>
                    {language === 'ru' ? 'Добавить пользователя' : 'Колдонуучу кошуу'}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Пользователь' : 'Колдонуучу'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Роль' : 'Роль'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Регион' : 'Аймак'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Статус' : 'Абал'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Последний вход' : 'Акыркы кирүү'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Действия' : 'Аракеттер'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <i className={`${user.role === 'admin' ? 'ri-shield-user-line' : 'ri-user-line'} text-red-600`}></i>
                              </div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'admin' 
                                ? (language === 'ru' ? 'Администратор' : 'Администратор')
                                : (language === 'ru' ? 'Специалист' : 'Адис')
                              }
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-700">{user.region}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {language === 'ru' ? 'Активен' : 'Активдүү'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-700" suppressHydrationWarning={true}>{user.lastLogin}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200 whitespace-nowrap cursor-pointer">
                                {language === 'ru' ? 'Редактировать' : 'Түзөтүү'}
                              </button>
                              <button className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 whitespace-nowrap cursor-pointer">
                                {language === 'ru' ? 'Блокировать' : 'Бөгөт коюу'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Управление выплатами' : 'Төлөмдөрдү башкаруу'}
                  </h3>
                  <div className="flex space-x-3">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center whitespace-nowrap cursor-pointer">
                      <i className="ri-download-line mr-2"></i>
                      {language === 'ru' ? 'Экспорт' : 'Экспорт'}
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 inline-flex items-center whitespace-nowrap cursor-pointer">
                      <i className="ri-money-dollar-circle-line mr-2"></i>
                      {language === 'ru' ? 'Массовая выплата' : 'Массалык төлөм'}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'ID Платежа' : 'Төлөм ID'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Семья' : 'Үй-бүлө'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Сумма' : 'Сумма'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Дата' : 'Күн'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Статус' : 'Абал'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Регион' : 'Аймак'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          {language === 'ru' ? 'Действия' : 'Аракеттер'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPayments.map((payment) => (
                        <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{payment.id}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{payment.family}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-green-600" suppressHydrationWarning={true}>
                              {payment.amount.toLocaleString()} сом
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-700">{payment.date}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status === 'paid' 
                                ? (language === 'ru' ? 'Выплачено' : 'Төлөнгөн')
                                : (language === 'ru' ? 'Обработка' : 'Иштетилүүдө')
                              }
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-700">{payment.region}</span>
                          </td>
                          <td className="py-4 px-4">
                            <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-200 whitespace-nowrap cursor-pointer">
                              {language === 'ru' ? 'Детали' : 'Чоо-жайы'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {language === 'ru' ? 'Системные настройки' : 'Системанын жөндөөлөрү'}
                </h3>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        {language === 'ru' ? 'Общие параметры' : 'Жалпы параметрлер'}
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Базовая ставка пособия' : 'Жөлөкпулдун негизги ставкасы'}
                          </label>
                          <input type="number" defaultValue="1200" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Порог ГМД' : 'ГМКнын босогосу'}
                          </label>
                          <input type="number" defaultValue="6000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'ru' ? 'Максимальный возраст ребенка' : 'Баланын максималдык жашы'}
                          </label>
                          <input type="number" defaultValue="16" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        {language === 'ru' ? 'Региональные коэффициенты' : 'Аймактык коэффициенттер'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {language === 'ru' ? 'Горные районы' : 'Тоолуу райондор'}
                          </span>
                          <input type="number" step="0.05" defaultValue="1.15" className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {language === 'ru' ? 'Приграничные зоны' : 'Чек ара аймактар'}
                          </span>
                          <input type="number" step="0.05" defaultValue="1.20" className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {language === 'ru' ? 'Приграничная надбавка' : 'Чек ара кошумча'}
                          </span>
                          <input type="number" defaultValue="1000" className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        {language === 'ru' ? 'Уведомления' : 'Билдирүүлөр'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {language === 'ru' ? 'Email уведомления' : 'Email билдирүүлөр'}
                          </span>
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                        </div>
                        {/* <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {language === 'ru' ? 'SMS уведомления' : 'SMS билдирүүлөр'}
                          </span>
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                        </div> */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {language === 'ru' ? 'Push уведомления' : 'Push билдирүүлөр'}
                          </span>
                          <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        {language === 'ru' ? 'Безопасность' : 'Коопсуздук'}
                      </h4>
                      <div className="space-y-3">
                        {/* <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {language === 'ru' ? 'Двухфакторная аутентификация' : 'Эки факторлуу аутентификация'}
                          </span>
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                        </div> */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {language === 'ru' ? 'Логирование действий' : 'Аракеттерди логдоо'}
                          </span>
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {language === 'ru' ? 'Автоматическое резервное копирование' : 'Автоматтык камдык көчүрмө'}
                          </span>
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 whitespace-nowrap cursor-pointer">
                    {language === 'ru' ? 'Сохранить настройки' : 'Жөндөөлөрдү сактоо'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
