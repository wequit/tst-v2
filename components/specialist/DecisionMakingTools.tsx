'use client';

import { useState, useEffect } from 'react';

interface DecisionMakingToolsProps {
  language: string;
  application: any;
  family: any;
  riskAssessment?: any;
  onDecision: (decision: 'approve' | 'reject') => void;
}

export default function DecisionMakingTools({ 
  language, 
  application, 
  family, 
  riskAssessment,
  onDecision 
}: DecisionMakingToolsProps) {
  const [isClient, setIsClient] = useState(false);
  const [calculatedBenefit, setCalculatedBenefit] = useState({
    baseAmount: 0,
    regionalCoefficient: 1.0,
    borderBonus: 0,
    finalAmount: 0
  });
  const [selectedReason, setSelectedReason] = useState('');
  const [comment, setComment] = useState('');
  const [requiresSupervisor, setRequiresSupervisor] = useState(false);

  useEffect(() => {
    setIsClient(true);
    calculateBenefit();
  }, []);

  if (!isClient) return null;

  const calculateBenefit = () => {
    const childrenUnder16 = application?.childrenCount || 0;
    const basePerChild = 1200;
    const baseAmount = basePerChild * childrenUnder16;

    let coefficient = 1.0;
    let bonus = 0;

    // Regional coefficients
    switch (application?.region) {
      case 'Бишкек':
      case 'Bishkek':
        coefficient = 1.0;
        break;
      case 'Нарын':
      case 'Naryn':
        coefficient = 1.2;
        break;
      case 'Баткен':
      case 'Batken':
        coefficient = 1.25;
        bonus = 1000 * childrenUnder16; // Border bonus
        break;
      default:
        coefficient = 1.0;
    }

    const finalAmount = Math.round((baseAmount * coefficient) + bonus);
    
    setCalculatedBenefit({
      baseAmount,
      regionalCoefficient: coefficient,
      borderBonus: bonus,
      finalAmount
    });

    // Check if supervisor approval required for amounts > 3000
    setRequiresSupervisor(finalAmount > 3000);
  };

  const approvalReasons = [
    { value: 'INCOME_ELIGIBLE', text: language === 'ru' ? 'Доходы соответствуют критериям' : 'Income meets eligibility criteria' },
    { value: 'DOCUMENTS_COMPLETE', text: language === 'ru' ? 'Документы полные и корректные' : 'Documents complete and correct' },
    { value: 'FAMILY_VERIFIED', text: language === 'ru' ? 'Состав семьи подтвержден' : 'Family composition verified' },
    { value: 'EXTERNAL_CHECKS_PASSED', text: language === 'ru' ? 'Внешние проверки пройдены' : 'External checks passed' }
  ];

  const rejectionReasons = [
    { value: 'INCOME_EXCEEDS', text: language === 'ru' ? 'Доходы превышают лимит ГМД' : 'Income exceeds GMD limit' },
    { value: 'INCOMPLETE_DOCUMENTS', text: language === 'ru' ? 'Неполный пакет документов' : 'Incomplete document package' },
    { value: 'FALSE_INFORMATION', text: language === 'ru' ? 'Предоставлена ложная информация' : 'False information provided' },
    { value: 'NO_ELIGIBLE_CHILDREN', text: language === 'ru' ? 'Нет детей до 16 лет' : 'No children under 16' },
    { value: 'DUPLICATE_APPLICATION', text: language === 'ru' ? 'Дублирующая заявка' : 'Duplicate application' }
  ];

  const inspectionReasons = [
    { value: 'HIGH_RISK', text: language === 'ru' ? 'Высокий риск мошенничества' : 'High fraud risk' },
    { value: 'INCOME_VERIFICATION', text: language === 'ru' ? 'Требуется проверка доходов' : 'Income verification needed' },
    { value: 'FAMILY_COMPOSITION', text: language === 'ru' ? 'Проверка состава семьи' : 'Family composition check' },
    { value: 'LIVING_CONDITIONS', text: language === 'ru' ? 'Оценка жилищных условий' : 'Living conditions assessment' }
  ];

  const handleApprove = () => {
    if (!selectedReason || !comment.trim()) {
      alert(language === 'ru' ? 'Пожалуйста, укажите причину и комментарий' : 'Please provide reason and comment');
      return;
    }
    onDecision('approve');
  };

  const handleReject = () => {
    if (!selectedReason || !comment.trim()) {
      alert(language === 'ru' ? 'Пожалуйста, укажите причину и комментарий' : 'Please provide reason and comment');
      return;
    }
    onDecision('reject');
  };

  return (
    <div className="space-y-6">
      {/* Eligibility Calculator */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h4 className="text-lg font-semibold mb-6">
          <i className="ri-calculator-line mr-2 text-blue-600"></i>
          {language === 'ru' ? 'Калькулятор пособия' : 'Benefit Calculator'}
        </h4>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-3">
                {language === 'ru' ? 'Базовый расчет' : 'Base Calculation'}
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{language === 'ru' ? 'Детей до 16 лет:' : 'Children under 16:'}</span>
                  <span className="font-semibold">{application?.childrenCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'ru' ? 'Базовая ставка:' : 'Base rate:'}</span>
                  <span className="font-semibold">1,200 сом × {application?.childrenCount || 0}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-blue-200">
                  <span>{language === 'ru' ? 'Базовая сумма:' : 'Base amount:'}</span>
                  <span suppressHydrationWarning={true}>{calculatedBenefit.baseAmount.toLocaleString()} сом</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-medium text-green-900 mb-3">
                {language === 'ru' ? 'Региональные коэффициенты' : 'Regional Coefficients'}
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{language === 'ru' ? 'Регион:' : 'Region:'}</span>
                  <span className="font-semibold">{application?.region}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'ru' ? 'Коэффициент:' : 'Coefficient:'}</span>
                  <span className="font-semibold">{calculatedBenefit.regionalCoefficient}x</span>
                </div>
                {calculatedBenefit.borderBonus > 0 && (
                  <div className="flex justify-between">
                    <span>{language === 'ru' ? 'Приграничная надбавка:' : 'Border bonus:'}</span>
                    <span className="font-semibold" suppressHydrationWarning={true}>+{calculatedBenefit.borderBonus.toLocaleString()} сом</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-6 text-center">
            <h5 className="text-lg font-semibold text-emerald-900 mb-4">
              {language === 'ru' ? 'Итоговая сумма пособия' : 'Final Benefit Amount'}
            </h5>
            <div className="text-4xl font-bold text-emerald-600 mb-2" suppressHydrationWarning={true}>
              {calculatedBenefit.finalAmount.toLocaleString()}
            </div>
            <div className="text-emerald-700 text-lg font-medium mb-4">
              {language === 'ru' ? 'сомов в месяц' : 'soms per month'}
            </div>
            
            {requiresSupervisor && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-sm">
                <i className="ri-alert-line text-yellow-600 mr-2"></i>
                <span className="text-yellow-800">
                  {language === 'ru' ? 'Требует одобрения руководителя (>3000 сом)' : 'Requires supervisor approval (>3000 som)'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decision Tools */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h4 className="text-lg font-semibold mb-6">
          <i className="ri-gavel-line mr-2 text-red-600"></i>
          {language === 'ru' ? 'Инструменты принятия решения' : 'Decision Making Tools'}
        </h4>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">
              {language === 'ru' ? 'Выберите решение:' : 'Select Decision:'}
            </h5>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-green-300 rounded-lg cursor-pointer hover:bg-green-50">
                <input
                  type="radio"
                  name="decision"
                  value="approve"
                  className="text-green-600 focus:ring-green-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-green-700">
                    <i className="ri-check-line mr-2"></i>
                    {language === 'ru' ? 'Одобрить заявку' : 'Approve Application'}
                  </div>
                  <div className="text-sm text-green-600">
                    {language === 'ru' ? 'Заявка соответствует всем критериям' : 'Application meets all criteria'}
                  </div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-yellow-300 rounded-lg cursor-pointer hover:bg-yellow-50">
                <input
                  type="radio"
                  name="decision"
                  value="request_info"
                  className="text-yellow-600 focus:ring-yellow-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-yellow-700">
                    <i className="ri-question-line mr-2"></i>
                    {language === 'ru' ? 'Запросить дополнительную информацию' : 'Request More Information'}
                  </div>
                  <div className="text-sm text-yellow-600">
                    {language === 'ru' ? 'Требуются дополнительные документы' : 'Additional documents required'}
                  </div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-orange-300 rounded-lg cursor-pointer hover:bg-orange-50">
                <input
                  type="radio"
                  name="decision"
                  value="schedule_inspection"
                  className="text-orange-600 focus:ring-orange-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-orange-700">
                    <i className="ri-map-pin-line mr-2"></i>
                    {language === 'ru' ? 'Назначить полевую проверку' : 'Schedule Field Inspection'}
                  </div>
                  <div className="text-sm text-orange-600">
                    {language === 'ru' ? 'Требуется выездная проверка' : 'On-site verification required'}
                  </div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-red-300 rounded-lg cursor-pointer hover:bg-red-50">
                <input
                  type="radio"
                  name="decision"
                  value="reject"
                  className="text-red-600 focus:ring-red-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-red-700">
                    <i className="ri-close-line mr-2"></i>
                    {language === 'ru' ? 'Отклонить заявку' : 'Reject Application'}
                  </div>
                  <div className="text-sm text-red-600">
                    {language === 'ru' ? 'Заявка не соответствует критериям' : 'Application does not meet criteria'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-3">
              {language === 'ru' ? 'Код причины:' : 'Reason Code:'}
            </h5>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4 pr-8"
            >
              <option value="">{language === 'ru' ? 'Выберите причину...' : 'Select reason...'}</option>
              <optgroup label={language === 'ru' ? 'Одобрение' : 'Approval'}>
                {approvalReasons.map(reason => (
                  <option key={reason.value} value={reason.value}>{reason.text}</option>
                ))}
              </optgroup>
              <optgroup label={language === 'ru' ? 'Отклонение' : 'Rejection'}>
                {rejectionReasons.map(reason => (
                  <option key={reason.value} value={reason.value}>{reason.text}</option>
                ))}
              </optgroup>
              <optgroup label={language === 'ru' ? 'Проверка' : 'Inspection'}>
                {inspectionReasons.map(reason => (
                  <option key={reason.value} value={reason.value}>{reason.text}</option>
                ))}
              </optgroup>
            </select>

            <h5 className="font-medium text-gray-900 mb-3">
              {language === 'ru' ? 'Обязательный комментарий:' : 'Mandatory Comment:'}
            </h5>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={language === 'ru' ? 'Подробно опишите обоснование вашего решения...' : 'Provide detailed justification for your decision...'}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {comment.length}/500 {language === 'ru' ? 'символов' : 'characters'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <i className="ri-information-line mr-2"></i>
              {language === 'ru' 
                ? 'Все решения записываются в протокол и не могут быть отменены'
                : 'All decisions are logged in the protocol and cannot be reversed'}
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleReject}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-flex items-center font-medium whitespace-nowrap cursor-pointer"
              >
                <i className="ri-close-line mr-2"></i>
                {language === 'ru' ? 'Отклонить' : 'Reject'}
              </button>
              <button 
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 inline-flex items-center font-medium whitespace-nowrap cursor-pointer"
              >
                <i className="ri-question-line mr-2"></i>
                {language === 'ru' ? 'Запросить инфо' : 'Request Info'}
              </button>
              <button 
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 inline-flex items-center font-medium whitespace-nowrap cursor-pointer"
              >
                <i className="ri-map-pin-line mr-2"></i>
                {language === 'ru' ? 'Назначить проверку' : 'Schedule Inspection'}
              </button>
              <button 
                onClick={handleApprove}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-flex items-center font-medium whitespace-nowrap cursor-pointer"
              >
                <i className="ri-check-line mr-2"></i>
                {language === 'ru' ? 'Одобрить' : 'Approve'}
              </button>
            </div>
          </div>
        </div>

        {/* Approval Workflow Notice */}
        {requiresSupervisor && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <i className="ri-shield-user-line text-yellow-600 text-xl mt-1"></i>
              <div>
                <h6 className="font-medium text-yellow-900">
                  {language === 'ru' ? 'Требуется подтверждение руководителя' : 'Supervisor Approval Required'}
                </h6>
                <p className="text-sm text-yellow-800 mt-1">
                  {language === 'ru' 
                    ? 'Пособие превышает 3,000 сом. После принятия решения заявка будет направлена руководителю для окончательного утверждения.'
                    : 'Benefit exceeds 3,000 som. After your decision, the application will be sent to supervisor for final approval.'}
                </p>
                <div className="text-xs text-yellow-700 mt-2">
                  {language === 'ru' ? 'Протокол решения будет сгенерирован автоматически.' : 'Decision protocol will be generated automatically.'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}