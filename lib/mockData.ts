
export const mockFamilies = [
  {
    id: 1,
    familyHead: 'Айжан Абдуллаева',
    region: 'Бишкек',
    regionType: 'urban',
    members: [
      { name: 'Айжан Абдуллаева', age: 32, relation: 'Мать', income: 15000 },
      { name: 'Талант Абдуллаев', age: 35, relation: 'Отец', income: 15000 },
      { name: 'Азиза Абдуллаева', age: 12, relation: 'Дочь', income: 0 },
      { name: 'Бакыт Абдуллаев', age: 8, relation: 'Сын', income: 0 }
    ],
    totalIncome: 30000,
    childrenUnder16: 2,
    perCapitaIncome: 7500,
    gmdThreshold: 6000,
    eligible: false,
    regionalCoefficient: 1.0,
    baseBenefit: 1200
  },
  {
    id: 2,
    familyHead: 'Гүлнара Осмонова',
    region: 'Нарын',
    regionType: 'mountainous',
    members: [
      { name: 'Гүлнара Осмонова', age: 28, relation: 'Мать', income: 12000 },
      { name: 'Нурбек Осмонов', age: 14, relation: 'Сын', income: 0 },
      { name: 'Айым Осмонова', age: 10, relation: 'Дочь', income: 0 },
      { name: 'Элмир Осмонов', age: 6, relation: 'Сын', income: 0 }
    ],
    totalIncome: 12000,
    childrenUnder16: 3,
    perCapitaIncome: 3000,
    gmdThreshold: 6000,
    eligible: true,
    regionalCoefficient: 1.15,
    baseBenefit: 1200
  },
  {
    id: 3,
    familyHead: 'Жамиля Турдубекова',
    region: 'Баткен',
    regionType: 'border',
    members: [
      { name: 'Жамиля Турдубекова', age: 30, relation: 'Мать', income: 8000 },
      { name: 'Аида Турдубекова', age: 15, relation: 'Дочь', income: 0 },
      { name: 'Данияр Турдубеков', age: 11, relation: 'Сын', income: 0 }
    ],
    totalIncome: 8000,
    childrenUnder16: 2,
    perCapitaIncome: 2667,
    gmdThreshold: 6000,
    eligible: true,
    regionalCoefficient: 1.2,
    baseBenefit: 1200,
    borderBonus: 1000
  }
];

export const mockApplications = [
  {
    id: 'APP-2025-001',
    familyHead: 'Айжан Абдуллаева',
    submissionDate: '2025-01-15',
    status: 'inReview',
    region: 'Бишкек',
    childrenCount: 2,
    monthlyBenefit: 0,
    specialist: 'Нурбек Жумабеков',
    lastUpdate: '2025-01-18'
  },
  {
    id: 'APP-2025-002',
    familyHead: 'Гүлнара Осмонова',
    submissionDate: '2025-01-12',
    status: 'approved',
    region: 'Нарын',
    childrenCount: 3,
    monthlyBenefit: 4140,
    specialist: 'Айгүл Касымова',
    lastUpdate: '2025-01-20'
  },
  {
    id: 'APP-2025-003',
    familyHead: 'Жамиля Турдубекова',
    submissionDate: '2025-01-10',
    status: 'approved',
    region: 'Баткен',
    childrenCount: 2,
    monthlyBenefit: 3880,
    specialist: 'Омурбек Ташиев',
    lastUpdate: '2025-01-22'
  }
];

// 8 Income Categories as per specification
export const incomeCategories = [
  // I. Primary Income
  { id: 'salary', name: 'Заработная плата', category: 'primary', icon: 'ri-money-dollar-circle-line' },
  { id: 'pension', name: 'Пенсия', category: 'primary', icon: 'ri-user-heart-line' },
  
  // II. Education
  { id: 'scholarship', name: 'Стипендии', category: 'education', icon: 'ri-book-line' },
  { id: 'tuition', name: 'Плата за обучение', category: 'education', icon: 'ri-graduation-cap-line' },
  
  // III. Other Income
  { id: 'alimony', name: 'Алименты', category: 'other', icon: 'ri-heart-line' },
  { id: 'dividends', name: 'Дивиденды', category: 'other', icon: 'ri-stock-line' },
  { id: 'assistance', name: 'Помощь', category: 'other', icon: 'ri-hand-heart-line' },
  
  // IV. Business Activity
  { id: 'business', name: 'Предпринимательство', category: 'business', icon: 'ri-briefcase-line' },
  { id: 'patents', name: 'Патенты', category: 'business', icon: 'ri-award-line' },
  
  // V. Land Ownership
  { id: 'irrigated_agriculture', name: 'Орошаемое земледелие', category: 'land', icon: 'ri-plant-line' },
  { id: 'rain_fed_agriculture', name: 'Богарное земледелие', category: 'land', icon: 'ri-seedling-line' },
  
  // VI. Subsidiary Farming
  { id: 'livestock', name: 'Животноводство', category: 'farming', icon: 'ri-home-garden-line' },
  { id: 'personal_farming', name: 'Личное хозяйство', category: 'farming', icon: 'ri-scissors-cut-line' },
  
  // VII. Bank Deposits and Investments
  { id: 'deposits', name: 'Банковские депозиты', category: 'financial', icon: 'ri-bank-line' },
  { id: 'investments', name: 'Инвестиции', category: 'financial', icon: 'ri-line-chart-line' }
];

export const regions = [
  { id: 'bishkek', name: 'Бишкек', type: 'urban', coefficient: 1.0 },
  { id: 'osh', name: 'Ош', type: 'urban', coefficient: 1.0 },
  { id: 'naryn', name: 'Нарын', type: 'mountainous', coefficient: 1.15 },
  { id: 'issyk-kul', name: 'Иссык-Куль', type: 'mountainous', coefficient: 1.15 },
  { id: 'batken', name: 'Баткен', type: 'border', coefficient: 1.2, borderBonus: 1000 },
  { id: 'osh-region', name: 'Ошская область', type: 'rural', coefficient: 1.0 },
  { id: 'jalal-abad', name: 'Джалал-Абад', type: 'rural', coefficient: 1.0 },
  { id: 'talas', name: 'Талас', type: 'rural', coefficient: 1.0 },
  { id: 'chui', name: 'Чуй', type: 'rural', coefficient: 1.0 }
];

// External System Integrations for automated checks
export const externalIntegrations = [
  {
    id: 'tunduk',
    name: 'Tunduk',
    description: 'Государственная система идентификации граждан',
    icon: 'ri-shield-user-line',
    status: 'active'
  },
  {
    id: 'employment_center',
    name: 'Центр занятости',
    description: 'Проверка статуса безработицы',
    icon: 'ri-briefcase-line',
    status: 'active'
  },
  {
    id: 'medical_commission',
    name: 'Медико-социальная экспертная комиссия',
    description: 'Проверка статуса инвалидности',
    icon: 'ri-hospital-line',
    status: 'active'
  },
  {
    id: 'sanaryp_aymak',
    name: 'Система "Санарып Аймак"',
    description: 'Комплексные данные о гражданах',
    icon: 'ri-database-2-line',
    status: 'active'
  },
  {
    id: 'tax_service',
    name: 'Налоговая служба',
    description: 'Проверка доходов и налоговых обязательств',
    icon: 'ri-money-dollar-circle-line',
    status: 'active'
  },
  {
    id: 'cadastre',
    name: 'Кадастр',
    description: 'Проверка права собственности на недвижимость',
    icon: 'ri-home-line',
    status: 'active'
  },
  {
    id: 'banks',
    name: 'Банковская система',
    description: 'Проверка финансовой информации',
    icon: 'ri-bank-line',
    status: 'active'
  },
  {
    id: 'probation',
    name: 'Служба пробации',
    description: 'Проверка криминального статуса',
    icon: 'ri-shield-check-line',
    status: 'active'
  }
];

export const GMD_THRESHOLD = 6000; // Guaranteed minimum income threshold
export const BASE_BENEFIT_PER_CHILD = 1200; // Base amount: 1,200 soms per child under 16
