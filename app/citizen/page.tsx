
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockApplications } from '@/lib/mockData';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function CitizenPortal() {
  const [language, setLanguage] = useState('ru');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const t = translations[language as keyof typeof translations];

  const filteredApplications = mockApplications.filter(app =>
    app.familyHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      inReview: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paymentProcessing: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      ru: {
        draft: 'Черновик',
        submitted: 'Подана',
        inReview: 'На рассмотрении',
        approved: 'Одобрена',
        rejected: 'Отклонена',
        paymentProcessing: 'Обработка платежа'
      },
      ky: {
        draft: 'Долбоор',
        submitted: 'Берилди',
        inReview: 'Карап жатат',
        approved: 'Бекитилди',
        rejected: 'Четке кагылды',
        paymentProcessing: 'Төлөмдү иштетүү'
      }
    };
    return statusTexts[language as keyof typeof statusTexts]?.[status as keyof typeof statusTexts.ru] || status;
  };

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
                  <h1 className="text-xl font-bold text-gray-900">{t.citizenPortal}</h1>
                  <p className="text-sm text-gray-600">Үй-бүлөгө көмөк</p>
                </div>
              </Link>
            </div>

            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-yellow-600 rounded-xl text-white p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'ru' ? 'Добро пожаловать' : 'Кош келиңиз'}
          </h2>
          <p className="text-lg mb-6 opacity-90">
            {language === 'ru' 
              ? 'Подавайте заявления на получение семейных пособий и отслеживайте их статус' 
              : 'Үй-бүлөлүк жөлөкпул алуу үчүн арыз бериңиз жана алардын абалын көзөмөлдөңүз'}
          </p>
          <Link href="/citizen/new-application" className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center whitespace-nowrap cursor-pointer">
            <i className="ri-add-line mr-2"></i>
            {language === 'ru' ? 'Оформить заявку' : 'Жаңы арыз берүү'}
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-file-list-3-line text-2xl text-blue-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'Всего заявок' : 'Бардык арыздар'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-checkbox-circle-line text-2xl text-green-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'Одобрено' : 'Бекитилген'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-time-line text-2xl text-yellow-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">1</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'На рассмотрении' : 'Карап жатат'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <i className="ri-money-dollar-circle-line text-2xl text-red-600"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">8,020</div>
                <div className="text-sm text-gray-600">
                  {language === 'ru' ? 'Сом в месяц' : 'Айына сом'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'ru' ? 'Мои заявки' : 'Менин арыздарым'}
              </h3>
              <Link href="/citizen/new-application" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center whitespace-nowrap cursor-pointer">
                <i className="ri-add-line mr-2"></i>
                {language === 'ru' ? 'Новая заявка' : 'Жаңы арыз'}
              </Link>
            </div>

            {/* Search */}
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder={language === 'ru' ? 'Поиск по номеру заявки или имени...' : 'Арыз номери же ысым боюнча издөө...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {application.id}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">
                          {language === 'ru' ? 'Глава семьи:' : 'Үй-бүлө башчысы:'}
                        </span>
                        <br />
                        {application.familyHead}
                      </div>
                      <div>
                        <span className="font-medium">
                          {language === 'ru' ? 'Регион:' : 'Аймак:'}
                        </span>
                        <br />
                        {application.region}
                      </div>
                      <div>
                        <span className="font-medium">
                          {language === 'ru' ? 'Детей до 16:' : '16 жашка чейин балдар:'}
                        </span>
                        <br />
                        {application.childrenCount}
                      </div>
                      <div>
                        <span className="font-medium">
                          {language === 'ru' ? 'Пособие:' : 'Жөлөкпул:'}
                        </span>
                        <br />
                        <span className="text-lg font-bold text-green-600" suppressHydrationWarning={true}>
                          {application.monthlyBenefit.toLocaleString()} сом
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <Link href={`/citizen/application/${application.id}`} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors inline-flex items-center whitespace-nowrap cursor-pointer">
                      <i className="ri-eye-line mr-2"></i>
                      {language === 'ru' ? 'Просмотр' : 'Көрүү'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
