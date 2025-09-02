
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockApplications, mockFamilies } from '@/lib/mockData';
import { calculateBenefit } from '@/lib/benefitCalculator';

interface CaseReviewWorkspaceProps {
  language: string;
  applicationId: string;
}

export default function CaseReviewWorkspace({ language, applicationId }: CaseReviewWorkspaceProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [isClient, setIsClient] = useState(false);
  const [incomeBreakdown, setIncomeBreakdown] = useState({
    employment: 18000,   // I. Employment (salary, pension, benefits)
    education: 2500,     // II. Education (scholarships, grants)
    business: 8000,      // III. Business activity (IP income, patents)
    agriculture: 4500,   // IV. Agriculture (irrigated, rain-fed)
    land: 1200,          // V. Land ownership (rent, sales)
    livestock: 3800,     // VI. Livestock (cattle, poultry, products)
    banking: 800,        // VII. Banking services (deposits, interest)
    other: 1200          // VIII. Other income (alimony, assistance)
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const application = mockApplications.find(app => app.id === applicationId);
  const family = mockFamilies.find(f => f.familyHead === application?.familyHead);

  if (!application || !family) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <i className="ri-file-search-line text-4xl text-red-600"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {language === 'ru' ? 'Заявка не найдена' : 'Application not found'}
        </h3>
        <p className="text-gray-600 mb-6">
          {language === 'ru' ? 'Заявка с ID ' + applicationId + ' не существует в системе УБК' : 'Application with ID ' + applicationId + ' does not exist in the УБК system'}
        </p>
        <Link href="/specialist/dashboard" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-flex items-center font-medium cursor-pointer">
          <i className="ri-arrow-left-line mr-2"></i>
          {language === 'ru' ? 'Вернуться к панели' : 'Return to Dashboard'}
        </Link>
      </div>
    );
  }

  const totalIncome = Object.values(incomeBreakdown).reduce((sum, val) => sum + val, 0);
  const perCapitaIncome = totalIncome / family.members.length;
  const gmdThreshold = 4500; // ГМД threshold in soms
  const isEligible = perCapitaIncome < gmdThreshold;

  // 8-category income breakdown for CCDS calculation
  const incomeCategories = [
    { 
      key: 'employment', 
      label: language === 'ru' ? 'I. Трудовая деятельность' : 'I. Employment Activity',
      subcategories: [
        language === 'ru' ? 'Заработная плата наемных работников' : 'Employee wages',
        language === 'ru' ? 'Пенсии и пособия' : 'Pensions and benefits',
        language === 'ru' ? 'Государственные выплаты' : 'Government payments'
      ],
      color: 'blue'
    },
    { 
      key: 'education', 
      label: language === 'ru' ? 'II. Образование' : 'II. Education',
      subcategories: [
        language === 'ru' ? 'Стипендии' : 'Scholarships',
        language === 'ru' ? 'Образовательные гранты' : 'Educational grants',
        language === 'ru' ? 'Доходы от обучения' : 'Teaching income'
      ],
      color: 'green'
    },
    { 
      key: 'business', 
      label: language === 'ru' ? 'III. Предпринимательская деятельность' : 'III. Business Activity',
      subcategories: [
        language === 'ru' ? 'Доходы ИП' : 'Individual entrepreneur income',
        language === 'ru' ? 'Патентные доходы' : 'Patent income',
        language === 'ru' ? 'Лицензионные платежи' : 'License fees'
      ],
      color: 'purple'
    },
    { 
      key: 'agriculture', 
      label: language === 'ru' ? 'IV. Сельское хозяйство' : 'IV. Agriculture',
      subcategories: [
        language === 'ru' ? 'Орошаемое земледелие' : 'Irrigated farming',
        language === 'ru' ? 'Богарное земледелие' : 'Rain-fed farming',
        language === 'ru' ? 'Продажа урожая' : 'Crop sales'
      ],
      color: 'yellow'
    },
    { 
      key: 'land', 
      label: language === 'ru' ? 'V. Землепользование' : 'V. Land Ownership',
      subcategories: [
        language === 'ru' ? 'Аренда земли' : 'Land rent',
        language === 'ru' ? 'Продажа земли' : 'Land sales',
        language === 'ru' ? 'Доходы от недвижимости' : 'Real estate income'
      ],
      color: 'orange'
    },
    { 
      key: 'livestock', 
      label: language === 'ru' ? 'VI. Животноводство' : 'VI. Livestock',
      subcategories: [
        language === 'ru' ? 'Продажа скота' : 'Livestock sales',
        language === 'ru' ? 'Молочная продукция' : 'Dairy products',
        language === 'ru' ? 'Птицеводство' : 'Poultry farming'
      ],
      color: 'red'
    },
    { 
      key: 'banking', 
      label: language === 'ru' ? 'VII. Банковские услуги' : 'VII. Banking Services',
      subcategories: [
        language === 'ru' ? 'Депозитные проценты' : 'Deposit interest',
        language === 'ru' ? 'Инвестиционные доходы' : 'Investment income',
        language === 'ru' ? 'Дивиденды' : 'Dividends'
      ],
      color: 'indigo'
    },
    { 
      key: 'other', 
      label: language === 'ru' ? 'VIII. Прочие доходы' : 'VIII. Other Income',
      subcategories: [
        language === 'ru' ? 'Алименты' : 'Alimony',
        language === 'ru' ? 'Семейная помощь' : 'Family assistance',
        language === 'ru' ? 'Разовые доходы' : 'One-time income'
      ],
      color: 'gray'
    }
  ];

  // External verification systems for comprehensive data checks
  const externalSystems = [
    { 
      system: 'Tunduk', 
      status: 'verified', 
      lastCheck: '2025-01-21 10:30', 
      icon: 'ri-shield-check-line',
      data: language === 'ru' ? 'Личность подтверждена, ПИН валиден' : 'Identity confirmed, PIN valid'
    },
    { 
      system: language === 'ru' ? 'Центр занятости' : 'Employment Center', 
      status: 'verified', 
      lastCheck: '2025-01-20 15:45', 
      icon: 'ri-briefcase-line',
      data: language === 'ru' ? 'Статус безработного, пособие не получает' : 'Unemployed status, no benefits received'
    },
    { 
      system: language === 'ru' ? 'Налоговая служба' : 'Tax Service', 
      status: 'warning', 
      lastCheck: '2025-01-19 09:15', 
      icon: 'ri-file-list-line',
      data: language === 'ru' ? 'Задолженность по налогам отсутствует, ИП не зарегистрирован' : 'No tax debts, no IP registration'
    },
    { 
      system: language === 'ru' ? 'Госкадастр' : 'State Cadastre', 
      status: 'verified', 
      lastCheck: '2025-01-18 14:20', 
      icon: 'ri-home-line',
      data: language === 'ru' ? 'Собственность: 1 квартира 65 м²' : 'Property: 1 apartment 65 m²'
    },
    { 
      system: language === 'ru' ? 'Банковская система' : 'Banking System', 
      status: 'verified', 
      lastCheck: '2025-01-17 11:00', 
      icon: 'ri-bank-line',
      data: language === 'ru' ? '2 счета, общий остаток 45,000 сом' : '2 accounts, total balance 45,000 som'
    },
    { 
      system: language === 'ru' ? 'Медкомиссия' : 'Medical Commission', 
      status: 'verified', 
      lastCheck: '2025-01-16 13:30', 
      icon: 'ri-hospital-line',
      data: language === 'ru' ? 'Инвалидность не установлена' : 'No disability status'
    },
    { 
      system: language === 'ru' ? 'Служба пробации' : 'Probation Service', 
      status: 'verified', 
      lastCheck: '2025-01-15 16:45', 
      icon: 'ri-shield-line',
      data: language === 'ru' ? 'Судимость отсутствует' : 'No criminal record'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      verified: 'text-green-600 bg-green-50 border-green-200',
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      warning: 'text-orange-600 bg-orange-50 border-orange-200',
      error: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      verified: 'ri-check-line',
      pending: 'ri-time-line',
      warning: 'ri-alert-line',
      error: 'ri-close-line'
    };
    return icons[status as keyof typeof icons] || 'ri-question-line';
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      gray: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const sections = [
    { id: 'profile', name: language === 'ru' ? 'Профиль семьи' : 'Family Profile', icon: 'ri-group-line' },
    { id: 'income', name: language === 'ru' ? 'Анализ доходов (ССДС)' : 'Income Analysis (CCDS)', icon: 'ri-money-dollar-line' },
    { id: 'external', name: language === 'ru' ? 'Внешние проверки' : 'External Verification', icon: 'ri-links-line' },
    { id: 'documents', name: language === 'ru' ? 'Документы' : 'Documents', icon: 'ri-file-list-3-line' },
    { id: 'decision', name: language === 'ru' ? 'Принятие решения' : 'Decision Making', icon: 'ri-gavel-line' }
  ];

  return (
    <div className="space-y-6">
      {/* Application Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <i className="ri-file-text-line text-3xl text-white"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{applicationId}</h2>
              <div className="text-red-100 mt-1">
                {language === 'ru' ? 'Заявка на получение пособия "Үй-бүлөгө көмөк"' : 'Application for "Үй-бүлөгө көмөк" benefit'}
              </div>
              <div className="flex items-center space-x-4 mt-2 text-sm text-red-100">
                <span><i className="ri-user-line mr-1"></i>{application.familyHead}</span>
                <span><i className="ri-map-pin-line mr-1"></i>{application.region}</span>
                <span><i className="ri-calendar-line mr-1"></i>{application.submissionDate}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold" suppressHydrationWarning={true}>
              {application.monthlyBenefit.toLocaleString()}
            </div>
            <div className="text-red-100">{language === 'ru' ? 'сомов в месяц' : 'soms per month'}</div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-3 whitespace-nowrap cursor-pointer transition-all ${
                  activeSection === section.id
                    ? 'border-red-600 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className={`${section.icon} mr-2 text-lg`}></i>
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Family Profile Panel with Enhanced 14-digit PIN */}
          {activeSection === 'profile' && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200">
                  <div className="w-28 h-28 bg-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <i className="ri-user-3-line text-5xl text-blue-600"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">{application.familyHead}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-center items-center space-x-2 p-3 bg-white rounded-lg">
                      <i className="ri-id-card-line text-blue-600"></i>
                      <span className="font-bold">ПИН: 12345678901234</span>
                    </div>
                    <div className="flex justify-center items-center space-x-2 p-2">
                      <i className="ri-map-pin-line text-blue-600"></i>
                      <span>{application.region}</span>
                    </div>
                    <div className="flex justify-center items-center space-x-2 p-2">
                      <i className="ri-calendar-line text-blue-600"></i>
                      <span>{language === 'ru' ? 'Подана' : 'Submitted'}: {application.submissionDate}</span>
                    </div>
                    <div className="flex justify-center items-center space-x-2 p-2">
                      <i className="ri-time-line text-blue-600"></i>
                      <span>{language === 'ru' ? 'Обновлено' : 'Updated'}: {application.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <h4 className="text-xl font-bold mb-6 flex items-center">
                  <i className="ri-group-line mr-2 text-blue-600"></i>
                  {language === 'ru' ? 'Состав семьи с детьми до 16 лет' : 'Family Composition with Children Under 16'}
                </h4>
                <div className="space-y-4">
                  {family.members.map((member, index) => (
                    <div key={index} className={`flex items-center justify-between p-6 rounded-xl border-2 ${member.age < 16 ? 'bg-yellow-50 border-yellow-300 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${member.age < 16 ? 'bg-yellow-200' : 'bg-gray-200'}`}>
                          <i className={`ri-${member.age < 16 ? 'bear-smile' : 'user'}-line text-2xl ${member.age < 16 ? 'text-yellow-600' : 'text-gray-600'}`}></i>
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900 text-lg">{member.name}</h5>
                          <div className="text-sm text-gray-600 flex items-center space-x-4">
                            <span>{member.relation}</span>
                            <span className="font-medium">{member.age} {language === 'ru' ? 'лет' : 'years old'}</span>
                            {member.age < 16 && (
                              <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                                {language === 'ru' ? 'РЕБЕНОК ДО 16' : 'CHILD UNDER 16'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-xl" suppressHydrationWarning={true}>
                          {member.income.toLocaleString()} сом
                        </div>
                        <div className="text-xs text-gray-500">
                          {language === 'ru' ? 'месячный доход' : 'monthly income'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced 8-Category Income Analysis with CCDS */}
          {activeSection === 'income' && (
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold mb-6 flex items-center">
                    <i className="ri-pie-chart-line mr-2 text-purple-600"></i>
                    {language === 'ru' ? '8-категорийный анализ доходов' : '8-Category Income Breakdown'}
                  </h4>
                  <div className="space-y-4">
                    {incomeCategories.map((category) => (
                      <div key={category.key} className={`border-2 rounded-xl p-6 ${getCategoryColor(category.color)}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-bold text-lg">{category.label}</h5>
                          <div className="flex items-center space-x-3">
                            <input
                              type="number"
                              value={incomeBreakdown[category.key as keyof typeof incomeBreakdown]}
                              onChange={(e) => setIncomeBreakdown({
                                ...incomeBreakdown,
                                [category.key]: parseInt(e.target.value) || 0
                              })}
                              className="w-28 px-3 py-2 text-sm font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
                            />
                            <span className="text-sm font-medium">сом</span>
                          </div>
                        </div>
                        <div className="text-sm opacity-90 mb-3">
                          {category.subcategories.join(' • ')}
                        </div>
                        <div>
                          <div className="w-full bg-white bg-opacity-50 rounded-full h-3">
                            <div
                              className={`bg-${category.color}-500 h-3 rounded-full transition-all duration-500`}
                              style={{ 
                                width: `${totalIncome > 0 ? Math.min((incomeBreakdown[category.key as keyof typeof incomeBreakdown] / totalIncome) * 100, 100) : 0}%` 
                              }}
                            ></div>
                          </div>
                          <div className="text-xs mt-1 font-medium">
                            {totalIncome > 0 ? Math.round((incomeBreakdown[category.key as keyof typeof incomeBreakdown] / totalIncome) * 100) : 0}% от общего дохода
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-6 flex items-center">
                    <i className="ri-calculator-line mr-2 text-green-600"></i>
                    {language === 'ru' ? 'Расчет ССДС и сравнение с ГМД' : 'CCDS Calculation & GMD Comparison'}
                  </h4>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <h5 className="font-bold text-blue-900 mb-4 text-lg">
                        {language === 'ru' ? 'Общий семейный доход' : 'Total Family Income'}
                      </h5>
                      <div className="text-4xl font-bold text-blue-600 mb-2" suppressHydrationWarning={true}>
                        {totalIncome.toLocaleString()} сом
                      </div>
                      <div className="text-blue-700 text-sm">
                        {language === 'ru' ? 'Сумма всех 8 категорий доходов' : 'Sum of all 8 income categories'}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <h5 className="font-bold text-purple-900 mb-4 text-lg">
                        {language === 'ru' ? 'ССДС (Средний Совокупный Доход Семьи)' : 'CCDS (Cumulative Cash Distribution System)'}
                      </h5>
                      <div className="text-4xl font-bold text-purple-600 mb-2" suppressHydrationWarning={true}>
                        {Math.round(perCapitaIncome).toLocaleString()} сом
                      </div>
                      <div className="text-purple-700 text-sm">
                        {totalIncome.toLocaleString()} ÷ {family.members.length} {language === 'ru' ? 'человек = доход на душу населения' : 'people = per capita income'}
                      </div>
                    </div>

                    <div className={`rounded-xl p-6 border-2 ${isEligible ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300' : 'bg-gradient-to-r from-red-50 to-red-100 border-red-300'}`}>
                      <h5 className={`font-bold mb-4 text-lg ${isEligible ? 'text-green-900' : 'text-red-900'}`}>
                        {language === 'ru' ? 'Сравнение с порогом ГМД' : 'GMD Threshold Comparison'}
                      </h5>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className={`text-2xl font-bold ${isEligible ? 'text-green-600' : 'text-red-600'}`}>
                            {gmdThreshold.toLocaleString()} сом
                          </div>
                          <div className={`text-sm ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
                            {language === 'ru' ? 'Порог ГМД (Гарантированный минимальный доход)' : 'GMD Threshold (Guaranteed Minimum Income)'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${isEligible ? 'text-green-600' : 'text-red-600'}`}>
                            {isEligible ? 
                              (language === 'ru' ? '✓ ПОДХОДИТ' : '✓ ELIGIBLE') : 
                              (language === 'ru' ? '✗ НЕ ПОДХОДИТ' : '✗ NOT ELIGIBLE')
                            }
                          </div>
                          <div className={`text-sm ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
                            {Math.abs(Math.round(perCapitaIncome - gmdThreshold)).toLocaleString()} сом {isEligible ? 
                              (language === 'ru' ? 'ниже порога' : 'below threshold') : 
                              (language === 'ru' ? 'выше порога' : 'above threshold')
                            }
                          </div>
                        </div>
                      </div>
                      
                      {isEligible && (
                        <div className="bg-green-200 text-green-800 p-4 rounded-lg mt-4">
                          <div className="flex items-center">
                            <i className="ri-check-double-line text-xl mr-2"></i>
                            <div className="font-medium">
                              {language === 'ru' ? 'Семья имеет право на получение пособия "Үй-бүлөгө көмөк"' : 'Family is eligible for "Үй-бүлөгө көмөк" benefit'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comprehensive External Data Verification */}
          {activeSection === 'external' && (
            <div>
              <h4 className="text-xl font-bold mb-6 flex items-center">
                <i className="ri-shield-check-line mr-2 text-green-600"></i>
                {language === 'ru' ? 'Комплексная проверка внешних данных' : 'Comprehensive External Data Verification'}
              </h4>
              <div className="grid lg:grid-cols-2 gap-6">
                {externalSystems.map((system, index) => (
                  <div key={index} className={`border-2 rounded-xl p-6 ${getStatusColor(system.status)}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <i className={`${system.icon} text-xl text-gray-700`}></i>
                        </div>
                        <div>
                          <h5 className="font-bold text-lg">{system.system}</h5>
                          <div className="text-xs opacity-75">
                            {language === 'ru' ? 'Последняя проверка' : 'Last check'}: {system.lastCheck}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <i className={`${getStatusIcon(system.status)} text-2xl`}></i>
                        <button className="text-sm font-medium hover:underline cursor-pointer bg-white px-3 py-1 rounded-lg shadow-sm">
                          <i className="ri-refresh-line mr-1"></i>
                          {language === 'ru' ? 'Обновить' : 'Refresh'}
                        </button>
                      </div>
                    </div>
                    <div className="text-sm bg-white bg-opacity-50 p-4 rounded-lg">
                      <strong>{language === 'ru' ? 'Данные:' : 'Data:'}</strong> {system.data}
                    </div>
                    <div className="mt-3 text-xs font-medium">
                      {system.status === 'verified' && (language === 'ru' ? '✓ Данные подтверждены и актуальны' : '✓ Data verified and current')}
                      {system.status === 'pending' && (language === 'ru' ? '⏳ Ожидает проверки системы' : '⏳ Pending system verification')}
                      {system.status === 'warning' && (language === 'ru' ? '⚠️ Обнаружены расхождения, требует внимания' : '⚠️ Discrepancies detected, needs attention')}
                      {system.status === 'error' && (language === 'ru' ? '❌ Ошибка подключения к системе' : '❌ System connection error')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents section and Decision section would continue with similar enhanced styling */}
          {(activeSection === 'documents' || activeSection === 'decision') && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <i className={`${sections.find(s => s.id === activeSection)?.icon} text-4xl text-gray-400`}></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {sections.find(s => s.id === activeSection)?.name}
              </h3>
              <p className="text-gray-600">
                {language === 'ru' ? 'Данный раздел находится в разработке для полной системы УБК' : 'This section is under development for the complete УБК system'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
