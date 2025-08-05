
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [language, setLanguage] = useState('ru');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = {
    ru: {
      title: 'Үй-бүлөгө көмөк',
      subtitle: 'Программа "Үй-бүлөгө көмөк" - Помощь семьям Кыргызстана',
      description: 'Система управления семейными пособиями для граждан Кыргызской Республики',
      citizenPortal: 'Портал граждан',
      citizenDesc: 'Подача заявления на получение пособия',
      specialistDashboard: 'Кабинет специалиста',
      specialistDesc: 'Рассмотрение и обработка заявлений',
      adminPanel: 'Админ панель',
      adminDesc: 'Управление системой и отчетность',
      benefits: 'Преимущества системы',
      feature1: 'Автоматический расчет пособий',
      feature2: 'Региональные коэффициенты',
      feature3: 'Интеграция с государственными базами',
      feature4: 'Мобильная версия',
      activeApplications: 'Активных заявлений',
      perChild: 'Сом на ребенка',
      regions: 'Областей',
      accuracy: 'Точность расчетов'
    },
    ky: {
      title: 'Үй-бүлөгө көмөк',
      subtitle: 'Программа "Үй-бүлөгө көмөк" - Кыргызстандын үй-бүлөлөрүнө жардам',
      description: 'Кыргыз Республикасынын жарандары үчүн үй-бүлөлүк жөлөкпулдарды башкаруу системасы',
      citizenPortal: 'Жарандардын порталы',
      citizenDesc: 'Жөлөкпул алуу үчүн арыз берүү',
      specialistDashboard: 'Адистин кабинети',
      specialistDesc: 'Арыздарды карап чыгуу жана иштетүү',
      adminPanel: 'Администрациялык панель',
      adminDesc: 'Системаны башкаруу жана отчетттук',
      benefits: 'Системанын артыкчылыктары',
      feature1: 'Жөлөкпулдардын автоматтык эсептөө',
      feature2: 'Аймактык коэффициенттер',
      feature3: 'Мамлекеттик базалар менен интеграция',
      feature4: 'Мобилдик версия',
      activeApplications: 'Активдүү арыздар',
      perChild: 'Балага сом',
      regions: 'Облустар',
      accuracy: 'Эсептөөлөрдүн тактыгы'
    }
  };

  const t = content[language as keyof typeof content];

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-red-600">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <i className="ri-government-line text-2xl text-white"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
                <p className="text-sm text-gray-600">Кыргызская Республика</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                    language === 'ru'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  suppressHydrationWarning={true}
                >
                  Русский
                </button>
                <button
                  onClick={() => setLanguage('ky')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                    language === 'ky'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  suppressHydrationWarning={true}
                >
                  Кыргызча
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative py-20 px-6"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Beautiful%20mountainous%20landscape%20of%20Kyrgyzstan%20with%20traditional%20yurt%20settlements%2C%20snow-capped%20Tien%20Shan%20mountains%20in%20background%2C%20green%20valleys%20with%20flowing%20rivers%2C%20clear%20blue%20sky%2C%20peaceful%20rural%20family%20scene%20with%20children%20playing%2C%20warm%20golden%20lighting%2C%20photorealistic%20style%2C%20government%20official%20backdrop%20feel%2C%20patriotic%20atmosphere&width=1400&height=600&seq=kyrgyz-hero-1&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-yellow-900/60"></div>
        <div className="relative container mx-auto text-center text-white">
          <h2 className="text-5xl font-bold mb-6" suppressHydrationWarning={true}>
            {t.subtitle}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90" suppressHydrationWarning={true}>
            {t.description}
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* <Link href="/citizen" className="group">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="ri-user-heart-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" suppressHydrationWarning={true}>
                  {t.citizenPortal}
                </h3>
                <p className="text-gray-600" suppressHydrationWarning={true}>
                  {t.citizenDesc}
                </p>
              </div>
            </Link> */}

            <Link href="/specialist" className="group">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="ri-user-settings-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" suppressHydrationWarning={true}>
                  {t.specialistDashboard}
                </h3>
                <p className="text-gray-600" suppressHydrationWarning={true}>
                  {t.specialistDesc}
                </p>
              </div>
            </Link>

            <Link href="/admin" className="group">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-red-800 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="ri-shield-user-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" suppressHydrationWarning={true}>
                  {t.adminPanel}
                </h3>
                <p className="text-gray-600" suppressHydrationWarning={true}>
                  {t.adminDesc}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900" suppressHydrationWarning={true}>
            {t.benefits}
          </h3>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-calculator-line text-2xl text-red-600"></i>
              </div>
              <h4 className="text-lg font-semibold mb-2" suppressHydrationWarning={true}>
                {t.feature1}
              </h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-map-pin-line text-2xl text-yellow-600"></i>
              </div>
              <h4 className="text-lg font-semibold mb-2" suppressHydrationWarning={true}>
                {t.feature2}
              </h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-database-2-line text-2xl text-red-600"></i>
              </div>
              <h4 className="text-lg font-semibold mb-2" suppressHydrationWarning={true}>
                {t.feature3}
              </h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-smartphone-line text-2xl text-yellow-600"></i>
              </div>
              <h4 className="text-lg font-semibold mb-2" suppressHydrationWarning={true}>
                {t.feature4}
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-2">45,672</div>
              <div className="text-gray-600" suppressHydrationWarning={true}>
                {t.activeApplications}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-yellow-600 mb-2">1,200</div>
              <div className="text-gray-600" suppressHydrationWarning={true}>
                {t.perChild}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-2">7</div>
              <div className="text-gray-600" suppressHydrationWarning={true}>
                {t.regions}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-yellow-600 mb-2">98.5%</div>
              <div className="text-gray-600" suppressHydrationWarning={true}>
                {t.accuracy}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="container mx-auto text-center">
          <p className="mb-2"> 2025 Министерство труда и социального развития КР</p>
          <p className="text-gray-400 text-sm">Система "Үй-бүлөгө көмөк"</p>
        </div>
      </footer>
    </div>
  );
}
