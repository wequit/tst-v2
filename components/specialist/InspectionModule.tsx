'use client';

import { useState, useEffect } from 'react';

interface InspectionModuleProps {
  language: string;
}

export default function InspectionModule({ language }: InspectionModuleProps) {
  const [isClient, setIsClient] = useState(false);
  const [activeView, setActiveView] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    setIsClient(true);
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, []);

  if (!isClient) return null;

  const inspectionTypes = [
    {
      id: 'initial',
      name: language === 'ru' ? 'Первичная проверка' : 'Initial Inspection',
      description: language === 'ru' ? 'Проверка условий проживания и состава семьи' : 'Living conditions and family composition verification',
      duration: 90,
      icon: 'ri-home-4-line',
      color: 'blue'
    },
    {
      id: 'income',
      name: language === 'ru' ? 'Проверка доходов' : 'Income Verification',
      description: language === 'ru' ? 'Подтверждение источников дохода семьи' : 'Verification of family income sources',
      duration: 60,
      icon: 'ri-money-dollar-line',
      color: 'green'
    },
    {
      id: 'follow_up',
      name: language === 'ru' ? 'Повторная проверка' : 'Follow-up Inspection',
      description: language === 'ru' ? 'Контроль выполнения рекомендаций' : 'Monitoring compliance with recommendations',
      duration: 45,
      icon: 'ri-refresh-line',
      color: 'yellow'
    },
    {
      id: 'fraud',
      name: language === 'ru' ? 'Проверка на мошенничество' : 'Fraud Investigation',
      description: language === 'ru' ? 'Углубленная проверка при подозрении на мошенничество' : 'In-depth verification for suspected fraud',
      duration: 120,
      icon: 'ri-shield-cross-line',
      color: 'red'
    }
  ];

  const scheduledInspections = [
    {
      id: 'INS-001',
      applicationId: 'APP-2025-001',
      familyName: language === 'ru' ? 'Семья Абдуллаевых' : 'Abdullaev Family',
      address: language === 'ru' ? 'г. Бишкек, ул. Манаса 45, кв. 12' : 'Bishkek, Manas str. 45, apt. 12',
      type: 'initial',
      date: '2025-01-22',
      time: '09:00',
      status: 'scheduled',
      priority: 'high',
      notes: language === 'ru' ? 'Высокий риск, требует особого внимания' : 'High risk, requires special attention'
    },
    {
      id: 'INS-002',
      applicationId: 'APP-2025-015',
      familyName: language === 'ru' ? 'Семья Токтосуновых' : 'Toktosonov Family',
      address: language === 'ru' ? 'Чуйская область, с. Кемин' : 'Chui region, Kemin village',
      type: 'income',
      date: '2025-01-22',
      time: '14:00',
      status: 'scheduled',
      priority: 'normal',
      notes: language === 'ru' ? 'Проверка мелкого бизнеса' : 'Small business verification'
    },
    {
      id: 'INS-003',
      applicationId: 'APP-2025-008',
      familyName: language === 'ru' ? 'Семья Касымовых' : 'Kasymov Family',
      address: language === 'ru' ? 'Нарынская область, г. Нарын' : 'Naryn region, Naryn city',
      type: 'follow_up',
      date: '2025-01-23',
      time: '10:30',
      status: 'in_progress',
      priority: 'normal',
      notes: language === 'ru' ? 'Повторный визит после доработки документов' : 'Follow-up after document revision'
    }
  ];

  const inspectionChecklist = [
    {
      category: language === 'ru' ? 'Жилищные условия' : 'Living Conditions',
      items: [
        language === 'ru' ? 'Площадь жилья соответствует количеству проживающих' : 'Housing area matches number of residents',
        language === 'ru' ? 'Условия для детей (отдельные спальные места)' : 'Conditions for children (separate sleeping areas)',
        language === 'ru' ? 'Коммунальные услуги (вода, электричество, отопление)' : 'Utilities (water, electricity, heating)',
        language === 'ru' ? 'Безопасность и гигиена' : 'Safety and hygiene'
      ]
    },
    {
      category: language === 'ru' ? 'Состав семьи' : 'Family Composition',
      items: [
        language === 'ru' ? 'Фактическое проживание всех заявленных членов семьи' : 'Actual residence of all declared family members',
        language === 'ru' ? 'Возраст детей соответствует документам' : 'Children\'s ages match documents',
        language === 'ru' ? 'Семейное положение родителей' : 'Marital status of parents',
        language === 'ru' ? 'Наличие других источников поддержки' : 'Presence of other support sources'
      ]
    },
    {
      category: language === 'ru' ? 'Экономическое положение' : 'Economic Situation',
      items: [
        language === 'ru' ? 'Видимые источники дохода' : 'Visible income sources',
        language === 'ru' ? 'Имущество и ценные вещи' : 'Property and valuables',
        language === 'ru' ? 'Ведение хозяйства (огород, домашние животные)' : 'Household activities (garden, livestock)',
        language === 'ru' ? 'Уровень жизни соответствует заявленным доходам' : 'Living standard matches declared income'
      ]
    }
  ];

  const getTypeColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      red: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.scheduled;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-500 text-white',
      normal: 'bg-gray-400 text-white',
      low: 'bg-green-500 text-white'
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  const views = [
    { id: 'schedule', name: language === 'ru' ? 'Расписание' : 'Schedule', icon: 'ri-calendar-line' },
    { id: 'checklist', name: language === 'ru' ? 'Чек-лист' : 'Checklist', icon: 'ri-task-line' },
    { id: 'routes', name: language === 'ru' ? 'Маршруты' : 'Routes', icon: 'ri-map-2-line' },
    { id: 'reports', name: language === 'ru' ? 'Отчеты' : 'Reports', icon: 'ri-file-text-line' }
  ];

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          {language === 'ru' ? 'Модуль полевых проверок' : 'Field Inspection Module'}
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap cursor-pointer ${
                activeView === view.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className={`${view.icon} mr-2`}></i>
              {view.name}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Interface */}
      {activeView === 'schedule' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Inspection Types */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Типы проверок' : 'Inspection Types'}
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {inspectionTypes.map(type => (
                  <div key={type.id} className={`border rounded-lg p-4 ${getTypeColor(type.color)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          <i className={`${type.icon} text-lg text-gray-700`}></i>
                        </div>
                        <div>
                          <h5 className="font-medium">{type.name}</h5>
                          <div className="text-xs opacity-75">{type.duration} мин</div>
                        </div>
                      </div>
                      <button className="text-sm font-medium hover:underline cursor-pointer">
                        {language === 'ru' ? 'Выбрать' : 'Select'}
                      </button>
                    </div>
                    <p className="text-sm opacity-90">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scheduled Inspections */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">
                  {language === 'ru' ? 'Запланированные проверки' : 'Scheduled Inspections'}
                </h4>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center text-sm whitespace-nowrap cursor-pointer">
                  <i className="ri-add-line mr-2"></i>
                  {language === 'ru' ? 'Новая проверка' : 'New Inspection'}
                </button>
              </div>

              <div className="space-y-4">
                {scheduledInspections.map(inspection => (
                  <div key={inspection.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inspection.priority)}`}>
                            {inspection.priority.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{inspection.familyName}</h5>
                          <div className="text-sm text-gray-600">{inspection.applicationId}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inspection.status)}`}>
                          {inspection.status === 'scheduled' ? (language === 'ru' ? 'Запланировано' : 'Scheduled') :
                           inspection.status === 'in_progress' ? (language === 'ru' ? 'В процессе' : 'In Progress') : 
                           inspection.status}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                          <i className="ri-more-line"></i>
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <i className="ri-calendar-line"></i>
                        <span>{inspection.date} в {inspection.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <i className="ri-map-pin-line"></i>
                        <span>{inspection.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <i className="ri-time-line"></i>
                        <span>{inspectionTypes.find(t => t.id === inspection.type)?.duration} мин</span>
                      </div>
                    </div>

                    {inspection.notes && (
                      <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mb-3">
                        <i className="ri-information-line mr-1"></i>
                        {inspection.notes}
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer">
                        <i className="ri-eye-line mr-1"></i>
                        {language === 'ru' ? 'Детали' : 'Details'}
                      </button>
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium cursor-pointer">
                        <i className="ri-map-line mr-1"></i>
                        {language === 'ru' ? 'Маршрут' : 'Route'}
                      </button>
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium cursor-pointer">
                        <i className="ri-edit-line mr-1"></i>
                        {language === 'ru' ? 'Изменить' : 'Edit'}
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer">
                        <i className="ri-close-line mr-1"></i>
                        {language === 'ru' ? 'Отменить' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar and Quick Actions */}
          <div className="space-y-6">
            {/* Calendar Widget */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Календарь проверок' : 'Inspection Calendar'}
              </h4>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>3 {language === 'ru' ? 'проверки запланированы' : 'inspections scheduled'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>1 {language === 'ru' ? 'в процессе' : 'in progress'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>2 {language === 'ru' ? 'завершены' : 'completed'}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Быстрые действия' : 'Quick Actions'}
              </h4>
              <div className="space-y-3">
                <button className="w-full bg-blue-100 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-200 transition-colors inline-flex items-center whitespace-nowrap cursor-pointer">
                  <i className="ri-calendar-check-line mr-2"></i>
                  {language === 'ru' ? 'Запланировать проверку' : 'Schedule Inspection'}
                </button>
                <button className="w-full bg-green-100 text-green-700 px-4 py-3 rounded-lg hover:bg-green-200 transition-colors inline-flex items-center whitespace-nowrap cursor-pointer">
                  <i className="ri-map-2-line mr-2"></i>
                  {language === 'ru' ? 'Оптимизировать маршрут' : 'Optimize Route'}
                </button>
                <button className="w-full bg-purple-100 text-purple-700 px-4 py-3 rounded-lg hover:bg-purple-200 transition-colors inline-flex items-center whitespace-nowrap cursor-pointer">
                  <i className="ri-file-download-line mr-2"></i>
                  {language === 'ru' ? 'Экспорт расписания' : 'Export Schedule'}
                </button>
              </div>
            </div>

            {/* Inspector Availability */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Доступность инспекторов' : 'Inspector Availability'}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">А. Касымова</span>
                  </div>
                  <span className="text-xs text-green-600">{language === 'ru' ? 'Доступна' : 'Available'}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Б. Мамытов</span>
                  </div>
                  <span className="text-xs text-yellow-600">{language === 'ru' ? 'Занят до 15:00' : 'Busy until 15:00'}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Г. Турсунова</span>
                  </div>
                  <span className="text-xs text-red-600">{language === 'ru' ? 'Больничный' : 'On sick leave'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Checklist */}
      {activeView === 'checklist' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold mb-6">
            {language === 'ru' ? 'Чек-лист полевой проверки' : 'Field Inspection Checklist'}
          </h4>
          <div className="space-y-6">
            {inspectionChecklist.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border border-gray-200 rounded-lg p-6">
                <h5 className="text-lg font-medium text-gray-900 mb-4">{category.category}</h5>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <label key={itemIndex} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {language === 'ru' ? 'Общий прогресс проверки' : 'Overall inspection progress'}
              </div>
              <div className="flex space-x-3">
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 inline-flex items-center text-sm whitespace-nowrap cursor-pointer">
                  <i className="ri-save-line mr-2"></i>
                  {language === 'ru' ? 'Сохранить' : 'Save'}
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center text-sm whitespace-nowrap cursor-pointer">
                  <i className="ri-file-text-line mr-2"></i>
                  {language === 'ru' ? 'Завершить отчет' : 'Complete Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other views placeholder */}
      {(activeView === 'routes' || activeView === 'reports') && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className={`${views.find(v => v.id === activeView)?.icon} text-3xl text-gray-400`}></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {views.find(v => v.id === activeView)?.name}
          </h3>
          <p className="text-gray-600">
            {language === 'ru' ? 'Данный раздел находится в разработке' : 'This section is under development'}
          </p>
        </div>
      )}
    </div>
  );
}