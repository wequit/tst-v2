
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockApplications } from '@/lib/mockData';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

function SpecialistDashboard() {
  const [language, setLanguage] = useState('ru');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [specialistName, setSpecialistName] = useState('Нурбек Жумабеков');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const t = translations[language as keyof typeof translations];

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

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.familyHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-800',
      inReview: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      ru: {
        submitted: 'Подана',
        inReview: 'На рассмотрении',
        approved: 'Одобрена',
        rejected: 'Отклонена'
      },
      ky: {
        submitted: 'Берилди',
        inReview: 'Карап жатат',
        approved: 'Бекитилди',
        rejected: 'Четке кагылды'
      }
    };
    return statusTexts[language as keyof typeof statusTexts]?.[status as keyof typeof statusTexts.ru] || status;
  };

  const toggleApplicationSelection = (applicationId: string) => {
    setSelectedApplications(prev =>
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const toggleAllApplications = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const stats = {
    pending: mockApplications.filter(app => app.status === 'inReview').length,
    processed: mockApplications.filter(app => ['approved', 'rejected'].includes(app.status)).length,
    approvalRate: Math.round((mockApplications.filter(app => app.status === 'approved').length / mockApplications.filter(app => ['approved', 'rejected'].includes(app.status)).length) * 100) || 0,
    avgTime: '2.5'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b-2 border-red-600">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <i className="ri-government-line text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{t.specialistDashboard}</h1>
                  <p className="text-sm text-gray-600">Үй-бүлөгө көмөк</p>
                </div>
              </Link>

              <div className="flex items-center space-x-3 ml-6">
                <Link
                  href="/citizen"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 inline-flex items-center text-sm whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-user-line mr-2"></i>
                  {language === 'ru' ? 'Портал граждан' : 'Жарандардын порталы'}
                </Link>
                
                <Link
                  href="/citizen/new-application"
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 inline-flex items-center text-sm whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-file-add-line mr-2"></i>
                  {language === 'ru' ? 'Форма заявки' : 'Арыз формасы'}
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-gray-600"></i>
                </div>
                <span suppressHydrationWarning={true}>Специалист: {specialistName}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-file-list-3-line text-2xl text-yellow-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'На рассмотрении' : 'Карап жатат'}
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
                <div className="text-2xl font-bold text-gray-900">{stats.processed}</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'Всего обработано' : 'Жалпы иштетилди'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-percent-line text-2xl text-blue-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.approvalRate}%</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'Процент одобрений' : 'Бекитүү пайызы'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-time-line text-2xl text-purple-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.avgTime}д</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'Среднее время' : 'Орточо убакыт'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'ru' ? 'Управление заявками' : 'Арыздарды башкаруу'}
              </h3>
              <div className="flex space-x-3">
                <Link 
                  href="/specialist/dashboard" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center text-sm whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-dashboard-line mr-2"></i>
                  {language === 'ru' ? 'Расширенная панель' : 'Advanced Dashboard'}
                </Link>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-8"
                >
                  <option value="all">{language === 'ru' ? 'Все статусы' : 'Бардык абалдар'}</option>
                  <option value="submitted">{language === 'ru' ? 'Поданные' : 'Берилгендер'}</option>
                  <option value="inReview">{language === 'ru' ? 'На рассмотрении' : 'Карап жаткандар'}</option>
                  <option value="approved">{language === 'ru' ? 'Одобренные' : 'Бекитилгендер'}</option>
                  <option value="rejected">{language === 'ru' ? 'Отклоненные' : 'Четке кагылгандар'}</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder={language === 'ru' ? 'Поиск по заявке или имени...' : 'Арыз же ысым боюнча издөө...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {selectedApplications.length > 0 && (
            <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {language === 'ru' 
                    ? `Выбрано заявок: ${selectedApplications.length}`
                    : `Тандалган арыздар: ${selectedApplications.length}`}
                </span>
                <div className="flex space-x-3">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center text-sm whitespace-nowrap cursor-pointer">
                    {language === 'ru' ? 'Массовое одобрение' : 'Массалык бекитүү'}
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 inline-flex items-center text-sm whitespace-nowrap cursor-pointer">
                    {language === 'ru' ? 'Массовое отклонение' : 'Массалык четке кагуу'}
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center text-sm whitespace-nowrap cursor-pointer">
                    {language === 'ru' ? 'Передать другому специалисту' : 'Башка адиске берүү'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                      onChange={toggleAllApplications}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {language === 'ru' ? 'Заявка' : 'Арыз'}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {language === 'ru' ? 'Семья' : 'Үй-бүлө'}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {language === 'ru' ? 'Регион' : 'Аймак'}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {language === 'ru' ? 'Дети' : 'Балдар'}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {language === 'ru' ? 'Пособие' : 'Жөлөкпул'}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {language === 'ru' ? 'Статус' : 'Абал'}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    {language === 'ru' ? 'Действия' : 'Аракеттер'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => toggleApplicationSelection(application.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{application.id}</div>
                      <div className="text-sm text-gray-500">{application.submissionDate}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{application.familyHead}</div>
                      <div className="text-sm text-gray-500">{application.specialist}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700">{application.region}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">{application.childrenCount}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-green-600" suppressHydrationWarning={true}>
                        {application.monthlyBenefit.toLocaleString()} сом
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Link 
                          href={`/specialist/application/${application.id}`}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-200 whitespace-nowrap cursor-pointer"
                        >
                          {language === 'ru' ? 'Открыть' : 'Ачуу'}
                        </Link>
                        {application.status === 'inReview' && (
                          <>
                            <button className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm hover:bg-green-200 whitespace-nowrap cursor-pointer">
                              {language === 'ru' ? 'Одобрить' : 'Бекитүү'}
                            </button>
                            <button className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 whitespace-nowrap cursor-pointer">
                              {language === 'ru' ? 'Отклонить' : 'Четке кагуу'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'ru' ? 'Быстрые действия' : 'Тез аракеттер'}
        </h3>
        <div className="space-y-3">
          <Link href="/specialist/dashboard" className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer">
            <i className="ri-dashboard-line mr-2"></i>
            {language === 'ru' ? 'Панель управления' : 'Башкаруу панели'}
          </Link>
        </div>
      </div>
      <header className="bg-white shadow-sm border-b-2 border-red-600">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <i className="ri-user-settings-line text-2xl text-white"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {language === 'ru' ? 'Кабинет специалиста' : 'Адистин кабинети'}
                </h1>
                <p className="text-sm text-gray-600">
                  {language === 'ru' ? 'Управление заявками на семейные пособия' : 'Үй-бүлөлүк жөлөкпулдарга арыздарды башкаруу'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-gray-600"></i>
                </div>
                <span suppressHydrationWarning={true}>Специалист: {specialistName}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default SpecialistDashboard;
