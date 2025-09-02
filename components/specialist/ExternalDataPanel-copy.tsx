
'use client';

import { useState } from 'react';

interface ExternalDataPanelProps {
  language: string;
  applicationId: string;
}

export default function ExternalDataPanel({ language, applicationId }: ExternalDataPanelProps) {
  const [activeSystem, setActiveSystem] = useState('tunduk');

  const externalSystems = [
    {
      id: 'tunduk',
      name: 'Tunduk',
      icon: 'ri-shield-user-line',
      status: 'verified',
      lastCheck: '2025-01-21 10:30',
      data: {
        identity: language === 'ru' ? 'Подтверждено' : 'Confirmed',
        pin: '12345678901234',
        fullName: language === 'ru' ? 'Айжан Сулайманова Абдуллаевна' : 'Aizhana Sulaymanova Abdullayevna',
        address: language === 'ru' ? 'г. Бишкек, ул. Манаса 45, кв. 12' : 'Bishkek, Manas str. 45, apt. 12'
      }
    },
    {
      id: 'employment',
      name: language === 'ru' ? 'Центр занятости' : 'Employment Center',
      icon: 'ri-briefcase-line',
      status: 'verified',
      lastCheck: '2025-01-20 15:45',
      data: {
        unemploymentStatus: language === 'ru' ? 'Зарегистрирован' : 'Registered',
        registrationDate: '2024-12-01',
        benefitsReceived: language === 'ru' ? 'Не получает' : 'Not receiving'
      }
    },
    {
      id: 'tax',
      name: language === 'ru' ? 'Налоговая служба' : 'Tax Service',
      icon: 'ri-file-list-line',
      status: 'warning',
      lastCheck: '2025-01-19 09:15',
      data: {
        declaredIncome: 24000,
        taxCompliance: language === 'ru' ? 'Соответствует' : 'Compliant',
        businessRegistration: language === 'ru' ? 'Не зарегистрирован' : 'Not registered',
        lastDeclaration: '2024-12-31'
      }
    },
    {
      id: 'cadastre',
      name: language === 'ru' ? 'Госкадастр' : 'State Cadastre',
      icon: 'ri-home-line',
      status: 'verified',
      lastCheck: '2025-01-18 14:20',
      data: {
        propertyOwnership: language === 'ru' ? 'Да' : 'Yes',
        properties: [
          {
            type: language === 'ru' ? 'Квартира' : 'Apartment',
            address: language === 'ru' ? 'г. Бишкек, ул. Манаса 45, кв. 12' : 'Bishkek, Manas str. 45, apt. 12',
            area: '65 м²',
            value: 2500000
          }
        ],
        landOwnership: language === 'ru' ? 'Нет' : 'No'
      }
    },
    {
      id: 'banks',
      name: language === 'ru' ? 'Банковская система' : 'Banking System',
      icon: 'ri-bank-line',
      status: 'verified',
      lastCheck: '2025-01-17 11:00',
      data: {
        accountsCount: 2,
        totalDeposits: 45000,
        activeLoans: language === 'ru' ? 'Нет' : 'No',
        creditHistory: language === 'ru' ? 'Хорошая' : 'Good',
        lastTransaction: '2025-01-20'
      }
    }
  ];

  const currentSystem = externalSystems.find(sys => sys.id === activeSystem);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          {language === 'ru' ? 'Панель внешних данных' : 'External Data Panel'}
        </h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center text-sm cursor-pointer">
          <i className="ri-refresh-line mr-2"></i>
          {language === 'ru' ? 'Обновить все' : 'Refresh All'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* System List */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h4 className="font-semibold text-gray-900 mb-4">
            {language === 'ru' ? 'Внешние системы' : 'External Systems'}
          </h4>
          <div className="space-y-2">
            {externalSystems.map(system => (
              <button
                key={system.id}
                onClick={() => setActiveSystem(system.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors cursor-pointer ${
                  activeSystem === system.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <i className={`${system.icon} text-lg text-gray-600`}></i>
                    <div>
                      <div className="font-medium text-sm">{system.name}</div>
                      <div className="text-xs text-gray-500">{system.lastCheck}</div>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(system.status)}`}>
                    <i className={`${getStatusIcon(system.status)} text-sm`}></i>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* System Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          {currentSystem && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className={`${currentSystem.icon} text-xl text-blue-600`}></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{currentSystem.name}</h4>
                    <div className="text-sm text-gray-500">
                      {language === 'ru' ? 'Последняя проверка:' : 'Last check:'} {currentSystem.lastCheck}
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg border ${getStatusColor(currentSystem.status)}`}>
                  <div className="flex items-center space-x-2">
                    <i className={getStatusIcon(currentSystem.status)}></i>
                    <span className="font-medium">
                      {currentSystem.status === 'verified' ? (language === 'ru' ? 'Подтверждено' : 'Verified') :
                       currentSystem.status === 'warning' ? (language === 'ru' ? 'Предупреждение' : 'Warning') :
                       currentSystem.status === 'error' ? (language === 'ru' ? 'Ошибка' : 'Error') :
                       (language === 'ru' ? 'Ожидание' : 'Pending')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(currentSystem.data).map(([key, value]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                      <span className="text-gray-900">
                        {Array.isArray(value) ? (
                          <div className="space-y-2">
                            {value.map((item, index) => (
                              <div key={index} className="text-sm">
                                {typeof item === 'object' ? 
                                  Object.entries(item).map(([k, v]) => (
                                    <div key={k}>{k}: {String(v)}</div>
                                  )) : 
                                  String(item)
                                }
                              </div>
                            ))}
                          </div>
                        ) : typeof value === 'object' ? (
                          Object.entries(value).map(([k, v]) => (
                            <div key={k} className="text-sm">{k}: {String(v)}</div>
                          ))
                        ) : (
                          String(value)
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center text-sm cursor-pointer">
                    <i className="ri-check-line mr-2"></i>
                    {language === 'ru' ? 'Подтвердить данные' : 'Confirm Data'}
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center text-sm cursor-pointer">
                    <i className="ri-refresh-line mr-2"></i>
                    {language === 'ru' ? 'Обновить' : 'Refresh'}
                  </button>
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 inline-flex items-center text-sm cursor-pointer">
                    <i className="ri-flag-line mr-2"></i>
                    {language === 'ru' ? 'Отметить расхождение' : 'Flag Discrepancy'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
