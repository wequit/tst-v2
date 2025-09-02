'use client';

import { useState } from 'react';
import { incomeCategories } from '@/lib/mockData';
import { calculateIncomeBreakdown } from '@/lib/benefitCalculator';

interface IncomeCalculatorProps {
  language: string;
  onIncomeChange?: (totalIncome: number, breakdown: any) => void;
}

export default function IncomeCalculator({ language, onIncomeChange }: IncomeCalculatorProps) {
  const [incomes, setIncomes] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState('primary');

  const categories = [
    { id: 'primary', name: language === 'ru' ? 'Основной доход' : 'Негизги киреше', color: 'blue' },
    { id: 'education', name: language === 'ru' ? 'Образование' : 'Билим берүү', color: 'green' },
    { id: 'other', name: language === 'ru' ? 'Прочие доходы' : 'Башка кирешелер', color: 'yellow' },
    { id: 'business', name: language === 'ru' ? 'Предпринимательство' : 'Ишкердик', color: 'purple' },
    { id: 'land', name: language === 'ru' ? 'Землевладение' : 'Жер ээлик', color: 'orange' },
    { id: 'farming', name: language === 'ru' ? 'Подсобное хозяйство' : 'Жардамчы чарба', color: 'teal' },
    { id: 'financial', name: language === 'ru' ? 'Финансовые инструменты' : 'Финансылык куралдар', color: 'indigo' }
  ];

  const handleIncomeChange = (incomeId: string, value: number) => {
    const newIncomes = { ...incomes, [incomeId]: value };
    setIncomes(newIncomes);
    
    const breakdown = calculateIncomeBreakdown(newIncomes);
    if (onIncomeChange) {
      onIncomeChange(breakdown.total, breakdown);
    }
  };

  const getCategoryIncomes = (categoryId: string) => {
    return incomeCategories.filter(income => income.category === categoryId);
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      teal: 'bg-teal-50 border-teal-200 text-teal-900',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const totalIncome = Object.values(incomes).reduce((sum, value) => sum + value, 0);
  const breakdown = calculateIncomeBreakdown(incomes);

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <i className="ri-calculator-line mr-3 text-blue-600"></i>
          {language === 'ru' ? 'Калькулятор доходов' : 'Кирешелерди эсептегич'}
        </h3>
        <p className="text-gray-600 mt-2">
          {language === 'ru' 
            ? 'Точный расчет доходов по 8 категориям для определения права на пособие'
            : 'Жөлөкпулга укукту аныктоо үчүн 8 категория боюнча кирешелерди так эсептөө'}
        </p>
      </div>

      <div className="flex">
        {/* Category Tabs */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4">
              {language === 'ru' ? 'Категории доходов' : 'Кирешелердин категориялары'}
            </h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? getCategoryColor(category.color)
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs text-gray-500">
                    {getCategoryIncomes(category.id).length} {language === 'ru' ? 'типов' : 'түр'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Income Inputs */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              {categories.find(c => c.id === activeCategory)?.name}
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              {getCategoryIncomes(activeCategory).map((income) => (
                <div key={income.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <i className={`${income.icon} mr-2`}></i>
                    {income.name}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={incomes[income.id] || ''}
                      onChange={(e) => handleIncomeChange(income.id, parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      сом
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Income Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3">
              {language === 'ru' ? 'Сводка по доходам' : 'Кирешелер боюнча корутунду'}
            </h5>
            
            <div className="space-y-2 mb-4">
              {breakdown.breakdown.map((item) => (
                <div key={item.category} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {categories.find(c => c.id === item.category)?.name}:
                  </span>
                  <span className="font-medium" suppressHydrationWarning={true}>
                    {item.amount.toLocaleString()} сом ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">
                  {language === 'ru' ? 'Общий месячный доход:' : 'Жалпы айлык киреше:'}
                </span>
                <span className="text-2xl font-bold text-blue-600" suppressHydrationWarning={true}>
                  {totalIncome.toLocaleString()} сом
                </span>
              </div>
            </div>

            {/* Eligibility Indicator */}
            <div className="mt-4 p-3 rounded-lg border-2 border-dashed">
              {totalIncome === 0 ? (
                <div className="text-center text-gray-500">
                  <i className="ri-information-line mr-2"></i>
                  {language === 'ru' ? 'Введите доходы для расчета' : 'Эсептөө үчүн кирешелерди киргизиңиз'}
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    {language === 'ru' ? 'Предварительная оценка права на пособие' : 'Жөлөкпулга укуктун алдын ала баасы'}
                  </div>
                  <div className={`font-semibold ${totalIncome < 6000 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalIncome < 6000 
                      ? (language === 'ru' ? '✓ Вероятно имеет право' : '✓ Укугу бар болушу мүмкүн')
                      : (language === 'ru' ? '✗ Превышает порог ГМД' : '✗ ГМКнын босогосун ашат')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {language === 'ru' ? 'Порог ГМД: 6,000 сом на человека' : 'ГМКнын босогосу: адамга 6,000 сом'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}