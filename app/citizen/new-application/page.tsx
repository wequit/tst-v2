
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { incomeCategories, regions, externalIntegrations } from '@/lib/mockData';
import { calculateBenefit, FamilyMember, simulateExternalCheck } from '@/lib/benefitCalculator';
import { translations } from '@/lib/translations';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function NewApplication() {
  const [language, setLanguage] = useState('ru');
  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedApplicationId, setGeneratedApplicationId] = useState('');
  const [tundukAuthenticated, setTundukAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const [externalChecks, setExternalChecks] = useState<Record<string, any>>({});
  const [dataProcessingConsent, setDataProcessingConsent] = useState(false);
  const router = useRouter();

  // Form data - Pre-filled from Tunduk
  const [citizenData, setCitizenData] = useState({
    fullName: 'Айжан Сулайманова Абдуллаевна',
    personalId: '12345678901234',
    address: 'г. Бишкек, ул. Манаса 45, кв. 12',
    phone: '+996 555 123-456',
    email: 'aizhana.s@mail.kg'
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { name: citizenData.fullName, age: 32, relation: 'Мать', income: 0 }
  ]);
  const [selectedRegion, setSelectedRegion] = useState('bishkek');
  const [incomes, setIncomes] = useState<Record<string, number>>({});
  const [documents, setDocuments] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const t = translations[language as keyof typeof translations];

  const steps = [
    { id: 1, name: language === 'ru' ? 'Аутентификация Tunduk' : 'Tunduk аутентификациясы' },
    { id: 2, name: language === 'ru' ? 'Проверка данных' : 'Маалыматты текшерүү' },
    { id: 3, name: language === 'ru' ? 'Состав семьи' : 'Үй-бүлөнүн курамы' },
    { id: 4, name: language === 'ru' ? 'Оценка доходов (8 категорий)' : 'Кирешелерди баалоо (8 категория)' },
    { id: 5, name: language === 'ru' ? 'Документы' : 'Документтер' },
    { id: 6, name: language === 'ru' ? 'Согласие на обработку' : 'Иштетүүгө макулдук' },
    { id: 7, name: language === 'ru' ? 'Автоматическая проверка' : 'Автоматтык текшерүү' },
    { id: 8, name: language === 'ru' ? 'Подача заявки' : 'Арыз берүү' }
  ];

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  const handleTundukAuth = async () => {
    setIsProcessingAuth(true);
    // Simulate Tunduk authentication
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Pre-fill citizen data from Tunduk
    setCitizenData({
      fullName: 'Айжан Сулайманова Абдуллаевна',
      personalId: '12345678901234',
      address: 'г. Бишкек, ул. Манаса 45, кв. 12',
      phone: '+996 555 123-456',
      email: 'aizhana.s@mail.kg'
    });
    
    // Update family member with authenticated data
    setFamilyMembers([
      { name: 'Айжан Сулайманова Абдуллаевна', age: 32, relation: 'Мать', income: 0 }
    ]);
    
    setTundukAuthenticated(true);
    setIsProcessingAuth(false);
    setShowAuthModal(false);
    setCurrentStep(2);
  };

  const performExternalChecks = async () => {
    const checks: Record<string, any> = {};
    for (const integration of externalIntegrations) {
      checks[integration.id] = await simulateExternalCheck(integration.id, citizenData);
    }
    setExternalChecks(checks);
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: '', age: 0, relation: '', income: 0 }]);
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: string | number) => {
    const updated = [...familyMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFamilyMembers(updated);
  };

  const removeFamilyMember = (index: number) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setFileInputKey(prev => prev + 1);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Байт';
    const k = 1024;
    const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalIncome = Object.values(incomes).reduce((sum, income) => sum + income, 0);

  const benefitCalculation = selectedRegion && familyMembers.length > 0 && familyMembers[0].name
    ? calculateBenefit(familyMembers, selectedRegion, totalIncome)
    : null;

  const handleSubmitApplication = async () => {
    if (!benefitCalculation || !benefitCalculation.eligible) {
      alert(language === 'ru' ? 'Заявка не может быть подана - семья не имеет права на пособие' : 'Арыз берилбейт - үй-бүлөнүн жөлөкпулга укугу жок');
      return;
    }

    if (uploadedFiles.length === 0) {
      alert(language === 'ru' ? 'Пожалуйста, загрузите необходимые документы' : 'Керектүү документтерди жүктөңүз');
      return;
    }

    if (!dataProcessingConsent) {
      alert(language === 'ru' ? 'Необходимо дать согласие на обработку данных' : 'Маалыматтарды иштетүүгө макулдук керек');
      return;
    }

    setIsSubmitting(true);

    // Simulate submission to territorial office
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newApplicationId = `APP-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setGeneratedApplicationId(newApplicationId);
    setShowSuccessModal(true);
    setIsSubmitting(false);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/citizen');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-red-600">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/citizen" className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <i className="ri-government-line text-2xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {language === 'ru' ? 'Новая заявка на пособие' : 'Жөлөкпулга жаңы арыз'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {language === 'ru' ? '8-шаговый процесс подачи' : '8 кадамдуу берүү процесси'}
                  </p>
                </div>
              </Link>
            </div>

            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between overflow-x-auto pb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id ? 'bg-red-600 border-red-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                    {currentStep > step.id ? (
                      <i className="ri-check-line text-lg"></i>
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className={`text-xs font-medium ${currentStep >= step.id ? 'text-red-600' : 'text-gray-400'}`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 min-w-[20px] ${currentStep > step.id ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            {/* Step 1: Tunduk Authentication */}
            {currentStep === 1 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <i className="ri-shield-check-line text-4xl text-red-600"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {language === 'ru' ? 'Аутентификация через Tunduk' : 'Tunduk аркылуу аутентификация'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {language === 'ru' 
                    ? 'Для подачи заявления необходимо пройти аутентификацию через государственную систему Tunduk'
                    : 'Арыз берүү үчүн Tunduk мамлекеттик системасы аркылуу аутентификациядан өтүү керек'}
                </p>
                
                {!tundukAuthenticated ? (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center text-lg font-semibold whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-shield-user-line mr-3 text-xl"></i>
                    {language === 'ru' ? 'Войти через Tunduk' : 'Tunduk аркылуу кирүү'}
                  </button>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-check-line text-2xl text-green-600"></i>
                      </div>
                    </div>
                    <h4 className="font-semibold text-green-800 mb-2">
                      {language === 'ru' ? 'Успешная аутентификация' : 'Ийгиликтүү аутентификация'}
                    </h4>
                    <p className="text-green-700 text-sm mb-4">
                      {language === 'ru' 
                        ? 'Ваши данные получены из системы Tunduk'
                        : 'Сиздин маалыматтар Tunduk системасынан алынды'}
                    </p>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap cursor-pointer"
                    >
                      {language === 'ru' ? 'Продолжить' : 'Улантуу'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Pre-filled Data Verification */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  {language === 'ru' ? 'Проверка предзаполненных данных' : 'Алдын ала толтурулган маалыматтарды текшерүү'}
                </h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <i className="ri-information-line text-blue-600 mr-3"></i>
                    <h4 className="font-semibold text-blue-800">
                      {language === 'ru' ? 'Данные получены из Tunduk' : 'Tunduk системасынан алынган маалыматтар'}
                    </h4>
                  </div>
                  <p className="text-blue-700 text-sm">
                    {language === 'ru'
                      ? 'Проверьте правильность автоматически заполненных данных и при необходимости внесите изменения'
                      : 'Автоматтык толтурулган маалыматтардын туура экендигин текшериңиз жана керек болсо өзгөртүүлөрдү киргизиңиз'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Полное имя' : 'Толук аты'}
                      </label>
                      <input
                        type="text"
                        value={citizenData.fullName}
                        onChange={(e) => setCitizenData({...citizenData, fullName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Личный номер' : 'Жеке номер'}
                      </label>
                      <input
                        type="text"
                        value={citizenData.personalId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Адрес проживания' : 'Жашаган дареги'}
                      </label>
                      <textarea
                        value={citizenData.address}
                        onChange={(e) => setCitizenData({...citizenData, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Номер телефона' : 'Телефон номери'}
                      </label>
                      <input
                        type="tel"
                        value={citizenData.phone}
                        onChange={(e) => setCitizenData({...citizenData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Электронная почта' : 'Электрондук почта'}
                      </label>
                      <input
                        type="email"
                        value={citizenData.email}
                        onChange={(e) => setCitizenData({...citizenData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ru' ? 'Регион проживания' : 'Жашаган аймак'}
                      </label>
                      <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-8"
                      >
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Family Composition */}
            {currentStep === 3 && (
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  {language === 'ru' ? 'Декларация состава семьи' : 'Үй-бүлөнүн курамын декларациялоо'}
                </h3>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      {language === 'ru' ? 'Состав семьи' : 'Үй-бүлөнүн курамы'}
                    </label>
                    <button
                      onClick={addFamilyMember}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-add-line mr-2"></i>
                      {language === 'ru' ? 'Добавить члена семьи' : 'Үй-бүлө мүчөсүн кошуу'}
                    </button>
                  </div>

                  {familyMembers.map((member, index) => (
                    <div key={`member-${index}`} className="grid md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {language === 'ru' ? 'ФИО' : 'Аты-жөнү'}
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                          placeholder={language === 'ru' ? 'Введите ФИО' : 'Аты-жөнүн жазыңыз'}
                          readOnly={index === 0}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {language === 'ru' ? 'Возраст' : 'Жаш'}
                        </label>
                        <input
                          type="number"
                          value={member.age || ''}
                          onChange={(e) => updateFamilyMember(index, 'age', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {language === 'ru' ? 'Родственная связь' : 'Туугандык байланыш'}
                        </label>
                        <select
                          value={member.relation}
                          onChange={(e) => updateFamilyMember(index, 'relation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm pr-8"
                        >
                          <option value="">
                            {language === 'ru' ? 'Выберите' : 'Тандаңыз'}
                          </option>
                          <option value="Мать">{language === 'ru' ? 'Мать' : 'Эне'}</option>
                          <option value="Отец">{language === 'ru' ? 'Отец' : 'Ата'}</option>
                          <option value="Сын">{language === 'ru' ? 'Сын' : 'Уул'}</option>
                          <option value="Дочь">{language === 'ru' ? 'Дочь' : 'Кыз'}</option>
                          <option value="Бабушка">{language === 'ru' ? 'Бабушка' : 'Чоң эне'}</option>
                          <option value="Дедушка">{language === 'ru' ? 'Дедушка' : 'Чоң ата'}</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        {familyMembers.length > 1 && index > 0 && (
                          <button
                            onClick={() => removeFamilyMember(index)}
                            className="w-full bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors inline-flex items-center justify-center whitespace-nowrap cursor-pointer"
                          >
                            <i className="ri-delete-bin-line mr-2"></i>
                            {language === 'ru' ? 'Удалить' : 'Жок кылуу'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Income Assessment (8 Categories) */}
            {currentStep === 4 && (
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  {language === 'ru' ? 'Оценка доходов по 8 категориям' : '8 категория боюнча кирешелерди баалоо'}
                </h3>

                <div className="space-y-6">
                  {/* I. Primary Income */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <i className="ri-money-dollar-circle-line mr-3"></i>
                      I. {language === 'ru' ? 'Основной доход' : 'Негизги киреше'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Заработная плата' : 'Эмгек акы'}
                        </label>
                        <input
                          type="number"
                          value={incomes['salary'] || ''}
                          onChange={(e) => setIncomes({...incomes, salary: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Пенсия' : 'Пенсия'}
                        </label>
                        <input
                          type="number"
                          value={incomes['pension'] || ''}
                          onChange={(e) => setIncomes({...incomes, pension: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* II. Education */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <i className="ri-book-line mr-3"></i>
                      II. {language === 'ru' ? 'Образование' : 'Билим берүү'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Стипендии' : 'Стипендиялар'}
                        </label>
                        <input
                          type="number"
                          value={incomes['scholarship'] || ''}
                          onChange={(e) => setIncomes({...incomes, scholarship: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Плата за обучение' : 'Окуу төлөмү'}
                        </label>
                        <input
                          type="number"
                          value={incomes['tuition'] || ''}
                          onChange={(e) => setIncomes({...incomes, tuition: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* III. Other Income */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                      <i className="ri-heart-line mr-3"></i>
                      III. {language === 'ru' ? 'Прочие доходы' : 'Башка кирешелер'}
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Алименты' : 'Алименттер'}
                        </label>
                        <input
                          type="number"
                          value={incomes['alimony'] || ''}
                          onChange={(e) => setIncomes({...incomes, alimony: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Дивиденды' : 'Дивиденддер'}
                        </label>
                        <input
                          type="number"
                          value={incomes['dividends'] || ''}
                          onChange={(e) => setIncomes({...incomes, dividends: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Помощь' : 'Жардам'}
                        </label>
                        <input
                          type="number"
                          value={incomes['assistance'] || ''}
                          onChange={(e) => setIncomes({...incomes, assistance: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* IV. Business Activity */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                      <i className="ri-briefcase-line mr-3"></i>
                      IV. {language === 'ru' ? 'Предпринимательская деятельность' : 'Ишкердик ишмердүүлүк'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Предпринимательство' : 'Ишкердик'}
                        </label>
                        <input
                          type="number"
                          value={incomes['business'] || ''}
                          onChange={(e) => setIncomes({...incomes, business: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Патенты' : 'Патенттер'}
                        </label>
                        <input
                          type="number"
                          value={incomes['patents'] || ''}
                          onChange={(e) => setIncomes({...incomes, patents: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* V. Land Ownership */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                      <i className="ri-plant-line mr-3"></i>
                      V. {language === 'ru' ? 'Землевладение' : 'Жер ээлик'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Орошаемое земледелие' : 'Сугарылган айыл чарба'}
                        </label>
                        <input
                          type="number"
                          value={incomes['irrigated_agriculture'] || ''}
                          onChange={(e) => setIncomes({...incomes, irrigated_agriculture: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Богарное земледелие' : 'Жамгырчыл айыл чарба'}
                        </label>
                        <input
                          type="number"
                          value={incomes['rain_fed_agriculture'] || ''}
                          onChange={(e) => setIncomes({...incomes, rain_fed_agriculture: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* VI. Subsidiary Farming */}
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-teal-900 mb-4 flex items-center">
                      <i className="ri-home-garden-line mr-3"></i>
                      VI. {language === 'ru' ? 'Подсобное хозяйство' : 'Жардамчы чарба'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Животноводство' : 'Мал чарба'}
                        </label>
                        <input
                          type="number"
                          value={incomes['livestock'] || ''}
                          onChange={(e) => setIncomes({...incomes, livestock: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Личное хозяйство' : 'Жеке чарба'}
                        </label>
                        <input
                          type="number"
                          value={incomes['personal_farming'] || ''}
                          onChange={(e) => setIncomes({...incomes, personal_farming: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* VII. Bank Deposits and Investments */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                      <i className="ri-bank-line mr-3"></i>
                      VII. {language === 'ru' ? 'Банковские депозиты и инвестиции' : 'Банк депозиттери жана инвестициялар'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Банковские депозиты' : 'Банк депозиттери'}
                        </label>
                        <input
                          type="number"
                          value={incomes['deposits'] || ''}
                          onChange={(e) => setIncomes({...incomes, deposits: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'ru' ? 'Инвестиции' : 'Инвестициялар'}
                        </label>
                        <input
                          type="number"
                          value={incomes['investments'] || ''}
                          onChange={(e) => setIncomes({...incomes, investments: parseInt(e.target.value) || 0})}
                          placeholder={language === 'ru' ? 'Сумма в сомах' : 'Сомдо сумма'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* VIII. Total Family Income */}
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <i className="ri-calculator-line mr-3"></i>
                      VIII. {language === 'ru' ? 'Общий семейный доход' : 'Жалпы үй-бүлөлүк киреше'}
                    </h4>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>{language === 'ru' ? 'Общий месячный доход:' : 'Жалпы айлык киреше:'}</span>
                        <span className="text-red-600" suppressHydrationWarning={true}>
                          {totalIncome.toLocaleString()} сом
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2" suppressHydrationWarning={true}>
                        {language === 'ru' 
                          ? `Доход на человека: ${familyMembers.length > 0 ? (totalIncome / familyMembers.length).toLocaleString() : 0} сом`
                          : `Адамга киреше: ${familyMembers.length > 0 ? (totalIncome / familyMembers.length).toLocaleString() : 0} сом`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Document Upload */}
            {currentStep === 5 && (
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  {language === 'ru' ? 'Загрузка и верификация документов' : 'Документтерди жүктөө жана текшерүү'}
                </h3>

                <div className="space-y-6">
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <i className="ri-upload-cloud-2-line text-2xl text-gray-400"></i>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {language === 'ru' ? 'Загрузите документы' : 'Документтерди жүктөңүз'}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {language === 'ru'
                        ? 'Перетащите файлы сюда или нажмите для выбора'
                        : 'Файлдарды бул жерге сүйрөңүз же тандоо үчүн басыңыз'}
                    </p>
                    <input
                      key={fileInputKey}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer inline-block"
                    >
                      {language === 'ru' ? 'Выбрать файлы' : 'Файлдарды тандоо'}
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      {language === 'ru'
                        ? 'Поддерживаются файлы: PDF, JPG, PNG, DOC, DOCX (максимум 10 МБ)'
                        : 'Колдоого алынган файлдар: PDF, JPG, PNG, DOC, DOCX (эң көп 10 МБ)'}
                    </p>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">
                        {language === 'ru' ? 'Загруженные файлы:' : 'Жүктөлгөн файлдар:'}
                      </h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={`file-${index}-${file.name}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <i className="ri-file-3-line text-red-600"></i>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-500">{getFileSize(file.size)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <i className="ri-check-line text-green-600 text-sm"></i>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors cursor-pointer"
                              >
                                <i className="ri-close-line text-red-600 text-sm"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Required Documents List */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4 text-blue-900">
                      {language === 'ru' ? 'Необходимые документы:' : 'Керектүү документтер:'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <i className="ri-user-3-line text-blue-600 text-sm"></i>
                          </div>
                          <div>
                            <p className="font-medium text-blue-900">
                              {language === 'ru' ? 'Паспорт главы семьи' : 'Үй-бүлө башчысынын паспорту'}
                            </p>
                            <p className="text-sm text-blue-700">
                              {language === 'ru' ? 'Копия всех заполненных страниц' : 'Толтурулган бардык барактардын көчүрмөсү'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <i className="ri-baby-line text-blue-600 text-sm"></i>
                          </div>
                          <div>
                            <p className="font-medium text-blue-900">
                              {language === 'ru' ? 'Свидетельства о рождении детей' : 'Балдардын туулган күбөлүктөрү'}
                            </p>
                            <p className="text-sm text-blue-700">
                              {language === 'ru' ? 'Для всех детей до 16 лет' : '16 жашка чейинки бардык балдар үчүн'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <i className="ri-money-dollar-circle-line text-blue-600 text-sm"></i>
                          </div>
                          <div>
                            <p className="font-medium text-blue-900">
                              {language === 'ru' ? 'Справки о доходах' : 'Кирешелер жөнүндө справкалар'}
                            </p>
                            <p className="text-sm text-blue-700">
                              {language === 'ru' ? 'За последние 3 месяца' : 'Акыркы 3 ай үчүн'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <i className="ri-home-heart-line text-blue-600 text-sm"></i>
                          </div>
                          <div>
                            <p className="font-medium text-blue-900">
                              {language === 'ru' ? 'Справка о составе семьи' : 'Үй-бүлөнүн курамы жөнүндө справка'}
                            </p>
                            <p className="text-sm text-blue-700">
                              {language === 'ru' ? 'Из местной администрации' : 'Жергиликтүү администрациядан'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Data Processing Consent */}
            {currentStep === 6 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <i className="ri-shield-check-line text-3xl text-blue-600"></i>
                </div>
                <h3 className="text-2xl font-bold mb-6">
                  {language === 'ru' ? 'Согласие на обработку данных' : 'Маалыматтарды иштетүүгө макулдук'}
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-6 text-left max-w-2xl mx-auto mb-6">
                  <h4 className="font-semibold mb-4">
                    {language === 'ru' ? 'Обработка персональных данных включает:' : 'Жеке маалыматтарды иштетүү төмөнкүлөрдү камтыйт:'}
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <i className="ri-check-line text-green-600 mt-0.5"></i>
                      <span>
                        {language === 'ru' 
                          ? 'Проверка данных через внешние системы (Tunduk, налоговая служба, банки)'
                          : 'Тышкы системалар аркылуу маалыматтарды текшерүү (Tunduk, салык кызматы, банктар)'}
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="ri-check-line text-green-600 mt-0.5"></i>
                      <span>
                        {language === 'ru' 
                          ? 'Хранение документов в электронном виде'
                          : 'Документтерди электрондук түрдө сактоо'}
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="ri-check-line text-green-600 mt-0.5"></i>
                      <span>
                        {language === 'ru' 
                          ? 'Автоматический расчет размера пособия'
                          : 'Жөлөкпулдун өлчөмүн автоматтык эсептөө'}
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="ri-check-line text-green-600 mt-0.5"></i>
                      <span>
                        {language === 'ru' 
                          ? 'Передача данных в территориальные органы для рассмотрения'
                          : 'Карап чыгуу үчүн аймактык органдарга маалыматтарды өткөрүү'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-center space-x-3 mb-8">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={dataProcessingConsent}
                    onChange={(e) => setDataProcessingConsent(e.target.checked)}
                    className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
                  />
                  <label htmlFor="consent" className="text-lg font-medium text-gray-900 cursor-pointer">
                    {language === 'ru' 
                      ? 'Я согласен(а) на обработку моих персональных данных'
                      : 'Мен өзүмдүн жеке маалыматтарымды иштетүүгө макулмун'}
                  </label>
                </div>

                {dataProcessingConsent && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-center justify-center mb-2">
                      <i className="ri-check-line text-green-600 mr-2"></i>
                      <span className="font-semibold text-green-800">
                        {language === 'ru' ? 'Согласие получено' : 'Макулдук алынды'}
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      {language === 'ru' 
                        ? 'Вы можете отозвать согласие в любое время'
                        : 'Сиз каалаган убакта макулдукту кайтарып ала аласыз'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 7: Automatic Eligibility Assessment */}
            {currentStep === 7 && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-center">
                  {language === 'ru' ? 'Автоматическая проверка соответствия' : 'Автоматтык дал келүүнү текшерүү'}
                </h3>

                <div className="space-y-6">
                  {/* External System Checks */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <i className="ri-links-line mr-3 text-blue-600"></i>
                      {language === 'ru' ? 'Проверка внешних данных' : 'Тышкы маалыматтарды текшерүү'}
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      {externalIntegrations?.map((integration, index) => (
                        <div key={integration.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <i className={`${integration.icon} text-blue-600`}></i>
                            </div>
                            <div>
                              <h5 className="font-medium">{integration.name}</h5>
                              <p className="text-xs text-gray-600">{integration.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <i className="ri-check-line text-green-600 text-sm"></i>
                            </div>
                          </div>
                        </div>
                      )) || (
                        <div className="col-span-2 text-center py-8">
                          <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <i className="ri-loader-4-line text-2xl text-blue-600 animate-spin"></i>
                          </div>
                          <p className="text-gray-600">
                            {language === 'ru' ? 'Проверка внешних систем...' : 'Тышкы системаларды текшерүү...'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Benefit Calculation */}
                  {benefitCalculation && (
                    <div className={`border-2 rounded-xl p-6 ${benefitCalculation.eligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${benefitCalculation.eligible ? 'bg-green-100' : 'bg-red-100'}`}>
                          <i className={`text-xl ${benefitCalculation.eligible ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600'}`}></i>
                        </div>
                        <h4 className={`text-lg font-semibold ${benefitCalculation.eligible ? 'text-green-800' : 'text-red-800'}`}>
                          {language === 'ru' ? 'Результат расчета пособия' : 'Жөлөкпулду эсептөө жыйынтыгы'}
                        </h4>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-700">
                                {language === 'ru' ? 'Детей до 16 лет:' : '16 жашка чейинки балдар:'}
                              </span>
                              <span className="font-semibold">{benefitCalculation.childrenUnder16}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">
                                {language === 'ru' ? 'Базовая ставка:' : 'Негизги ставка:'}
                              </span>
                              <span className="font-semibold" suppressHydrationWarning={true}>1,200 сом</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">
                                {language === 'ru' ? 'Региональный коэффициент:' : 'Аймактык коэффициент:'}
                              </span>
                              <span className="font-semibold">{benefitCalculation.regionalCoefficient}x</span>
                            </div>
                            {benefitCalculation.borderBonus > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-700">
                                  {language === 'ru' ? 'Приграничная надбавка:' : 'Чек ара кошумчасы:'}
                                </span>
                                <span className="font-semibold" suppressHydrationWarning={true}>{benefitCalculation.borderBonus.toLocaleString()} сом</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className={`text-sm font-medium mb-2 ${benefitCalculation.eligible ? 'text-green-700' : 'text-red-700'}`}>
                            {benefitCalculation.eligible
                              ? (language === 'ru' ? 'СЕМЬЯ ИМЕЕТ ПРАВО НА ПОСОБИЕ' : 'ҮЙ-БҮЛӨНҮН ЖӨЛӨКПУЛГА УКУГУ БАР')
                              : (language === 'ru' ? 'СЕМЬЯ НЕ ИМЕЕТ ПРАВА НА ПОСОБИЕ' : 'ҮЙ-БҮЛӨНҮН ЖӨЛӨКПУЛГА УКУГУ ЖОК')}
                          </div>
                          {benefitCalculation.eligible ? (
                            <div className="text-4xl font-bold text-green-600" suppressHydrationWarning={true}>
                              {benefitCalculation.totalMonthlyBenefit.toLocaleString()} сом
                            </div>
                          ) : (
                            <div className="text-2xl font-bold text-red-600">0 сом</div>
                          )}
                          <div className="text-xs text-gray-600 mt-1">
                            {language === 'ru' ? 'ежемесячно' : 'айына'}
                          </div>
                        </div>
                      </div>

                      {benefitCalculation.reason && (
                        <div className="mt-4 p-3 bg-white rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">{language === 'ru' ? 'Причина:' : 'Себеп:'}</span> {benefitCalculation.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 8: Submission */}
            {currentStep === 8 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <i className="ri-send-plane-line text-3xl text-green-600"></i>
                </div>
                <h3 className="text-2xl font-bold mb-6">
                  {language === 'ru' ? 'Подача заявки в территориальный орган' : 'Аймактык органга арыз берүү'}
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-check-line text-green-600 text-sm"></i>
                      </div>
                      <span className="text-gray-700">
                        {language === 'ru' ? 'Все данные проверены и валидированы' : 'Бардык маалыматтар текшерилди жана тастыкталды'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-check-line text-green-600 text-sm"></i>
                      </div>
                      <span className="text-gray-700">
                        {language === 'ru' ? 'Документы загружены и готовы к рассмотрению' : 'Документтер жүктөлдү жана карап чыгууга даяр'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-check-line text-green-600 text-sm"></i>
                      </div>
                      <span className="text-gray-700">
                        {language === 'ru' ? 'Согласие на обработку данных получено' : 'Маалыматтарды иштетүүгө макулдук алынды'}
                      </span>
                    </div>
                    {benefitCalculation?.eligible && (
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <i className="ri-check-line text-green-600 text-sm"></i>
                        </div>
                        <span className="text-gray-700">
                          {language === 'ru' 
                            ? `Семья имеет право на пособие: ${benefitCalculation.totalMonthlyBenefit.toLocaleString()} сом/месяц`
                            : `Үй-бүлөнүн жөлөкпулга укугу бар: ${benefitCalculation.totalMonthlyBenefit.toLocaleString()} сом/айына`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {benefitCalculation?.eligible ? (
                  <button
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting}
                    className={`px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center whitespace-nowrap cursor-pointer ${isSubmitting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line mr-3 animate-spin"></i>
                        {language === 'ru' ? 'Отправка в территориальный орган...' : 'Аймактык органга жөнөтүлүүдө...'}
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line mr-3"></i>
                        {language === 'ru' ? 'Подать заявку в территориальный орган' : 'Аймактык органга арыз берүү'}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <i className="ri-error-warning-line text-3xl text-red-600 mb-4"></i>
                    <p className="font-semibold text-red-800 mb-2">
                      {language === 'ru' ? 'Заявка не может быть подана' : 'Арыз берилбейт'}
                    </p>
                    <p className="text-red-700 text-sm">
                      {language === 'ru' 
                        ? 'Семья не соответствует критериям получения пособия'
                        : 'Үй-бүлө жөлөкпул алуу критерийлерине дал келбейт'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1 || isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center whitespace-nowrap cursor-pointer"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                {language === 'ru' ? 'Назад' : 'Артка'}
              </button>

              <div className="flex space-x-3">
                {currentStep > 1 && currentStep < 8 && (
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer">
                    {language === 'ru' ? 'Сохранить как черновик' : 'Долбоор катары сактоо'}
                  </button>
                )}

                {currentStep < 8 && (
                  <button
                    onClick={() => {
                      if (currentStep === 1 && !tundukAuthenticated) {
                        setShowAuthModal(true);
                      } else if (currentStep === 6 && !dataProcessingConsent) {
                        alert(language === 'ru' ? 'Необходимо дать согласие на обработку данных' : 'Маалыматтарды иштетүүгө макулдук керек');
                      } else if (currentStep === 7) {
                        performExternalChecks().then(() => setCurrentStep(8));
                      } else {
                        setCurrentStep(Math.min(8, currentStep + 1));
                      }
                    }}
                    disabled={(currentStep === 1 && !tundukAuthenticated) || (currentStep === 6 && !dataProcessingConsent)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center whitespace-nowrap cursor-pointer"
                  >
                    {language === 'ru' ? 'Далее' : 'Андан ары'}
                    <i className="ri-arrow-right-line ml-2"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tunduk Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <i className="ri-shield-user-line text-3xl text-red-600"></i>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'ru' ? 'Аутентификация Tunduk' : 'Tunduk аутентификациясы'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {language === 'ru'
                  ? 'Для продолжения необходимо пройти аутентификацию через государственную систему Tunduk'
                  : 'Улантуу үчүн Tunduk мамлекеттик системасы аркылуу аутентификациядан өтүү керек'}
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                >
                  {language === 'ru' ? 'Отмена' : 'Жокко чыгаруу'}
                </button>
                <button
                  onClick={handleTundukAuth}
                  disabled={isProcessingAuth}
                  className={`flex-1 px-4 py-3 rounded-lg whitespace-nowrap cursor-pointer ${isProcessingAuth ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                  {isProcessingAuth ? (
                    <>
                      <i className="ri-loader-4-line mr-2 animate-spin"></i>
                      {language === 'ru' ? 'Проверка...' : 'Текшерүү...'}
                    </>
                  ) : (
                    <>
                      <i className="ri-shield-check-line mr-2"></i>
                      {language === 'ru' ? 'Войти' : 'Кирүү'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <i className="ri-check-line text-3xl text-green-600"></i>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {language === 'ru' ? 'Заявка успешно подана в территориальный орган!' : 'Арыз аймактык органга ийгиликтүү берилди!'}
              </h3>

              <p className="text-gray-600 mb-6">
                {language === 'ru'
                  ? 'Ваша заявка направлена в территориальный орган для рассмотрения. Номер заявки:'
                  : 'Сиздин арызыңыз карап чыгуу үчүн аймактык органга жөнөтүлдү. Арыз номери:'}
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-2xl font-bold text-red-600">
                  {generatedApplicationId}
                </div>
              </div>

              <div className="space-y-4 mb-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <i className="ri-time-line text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {language === 'ru' ? 'Рассмотрение заявки' : 'Арызды карап чыгуу'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === 'ru'
                        ? 'Территориальный орган рассмотрит вашу заявку в течение 5-7 рабочих дней'
                        : 'Аймактык орган сиздин арызыңызды 5-7 жумуш күнүнүн ичинде карап чыгат'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <i className="ri-notification-line text-green-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {language === 'ru' ? 'Уведомления' : 'Билдирүүлөр'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === 'ru'
                        ? 'Вы получите SMS и email уведомления о статусе заявки'
                        : 'Сизге арыздын абалы жөнүндө SMS жана email билдирүү келет'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <i className="ri-money-dollar-circle-line text-purple-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {language === 'ru' ? 'Ожидаемая выплата' : 'Күтүлүүчү төлөм'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-green-600" suppressHydrationWarning={true}>
                        {benefitCalculation?.totalMonthlyBenefit.toLocaleString()} сом
                      </span> {language === 'ru' ? 'ежемесячно при одобрении' : 'айына бекитилгенде'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSuccessModalClose}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 whitespace-nowrap cursor-pointer"
                >
                  {language === 'ru' ? 'К моим заявкам' : 'Менин арыздарыма'}
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    // Reset form for new application
                    setCurrentStep(1);
                    setTundukAuthenticated(false);
                    setFamilyMembers([{ name: '', age: 0, relation: '', income: 0 }]);
                    setSelectedRegion('bishkek');
                    setIncomes({});
                    setUploadedFiles([]);
                    setDataProcessingConsent(false);
                    setExternalChecks({});
                  }}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 whitespace-nowrap cursor-pointer"
                >
                  {language === 'ru' ? 'Новая заявка' : 'Жаңы арыз'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
