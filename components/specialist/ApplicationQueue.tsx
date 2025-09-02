
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockApplications } from '@/lib/mockData';

interface ApplicationQueueProps {
  language: string;
}

export default function ApplicationQueue({ language }: ApplicationQueueProps) {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterRiskLevel, setFilterRiskLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [applications, setApplications] = useState(mockApplications);

  // Enhanced application data with УБК ID format and comprehensive details
  const enhancedApplications = applications.map(app => ({
    ...app,
    id: `УБК-2025-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
    riskScore: Math.floor(Math.random() * 100) + 1,
    riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
    priority: app.monthlyBenefit > 3000 ? 'high' : app.status === 'submitted' ? 'urgent' : 'normal',
    daysInQueue: Math.floor(Math.random() * 15) + 1,
    externalVerifications: {
      tunduk: Math.random() > 0.2 ? 'verified' : 'pending',
      employment: Math.random() > 0.3 ? 'verified' : 'pending',
      tax: Math.random() > 0.4 ? 'verified' : 'warning',
      cadastre: Math.random() > 0.2 ? 'verified' : 'pending',
      banking: Math.random() > 0.3 ? 'verified' : 'warning',
      medical: Math.random() > 0.1 ? 'verified' : 'pending',
      probation: Math.random() > 0.05 ? 'verified' : 'pending'
    },
    familySize: Math.floor(Math.random() * 6) + 2,
    incomeLevel: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low'
  }));

  // Kyrgyz regions (7 oblasts + Bishkek + Osh)
  const regions = [
    { id: 'all', name: language === 'ru' ? 'Все регионы' : 'All Regions' },
    { id: 'bishkek', name: language === 'ru' ? 'г. Бишкек' : 'Bishkek city' },
    { id: 'osh_city', name: language === 'ru' ? 'г. Ош' : 'Osh city' },
    { id: 'chui', name: language === 'ru' ? 'Чуйская область' : 'Chui Oblast' },
    { id: 'issyk_kul', name: language === 'ru' ? 'Иссык-Кульская область' : 'Issyk-Kul Oblast' },
    { id: 'naryn', name: language === 'ru' ? 'Нарынская область' : 'Naryn Oblast' },
    { id: 'talas', name: language === 'ru' ? 'Таласская область' : 'Talas Oblast' },
    { id: 'osh', name: language === 'ru' ? 'Ошская область' : 'Osh Oblast' },
    { id: 'jalal_abad', name: language === 'ru' ? 'Жалал-Абадская область' : 'Jalal-Abad Oblast' },
    { id: 'batken', name: language === 'ru' ? 'Баткенская область' : 'Batken Oblast' }
  ];

  const filteredApplications = enhancedApplications.filter(app => {
    const matchesSearch = app.familyHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesRegion = filterRegion === 'all' || app.region.toLowerCase().includes(filterRegion);
    const matchesRiskLevel = filterRiskLevel === 'all' || app.riskLevel === filterRiskLevel;
    return matchesSearch && matchesStatus && matchesRegion && matchesRiskLevel;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-800 border-blue-200',
      inReview: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRiskColor = (level: string, score: number) => {
    if (level === 'high' || score >= 70) return 'text-red-600 bg-red-100 border-red-200';
    if (level === 'medium' || score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      normal: 'bg-gray-400 text-white'
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  const getVerificationStatus = (verifications: any) => {
    const total = Object.keys(verifications).length;
    const verified = Object.values(verifications).filter(status => status === 'verified').length;
    const warnings = Object.values(verifications).filter(status => status === 'warning').length;
    
    return { verified, total, warnings, percentage: Math.round((verified / total) * 100) };
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

  return (
    <div className="space-y-6">
      {/* Enhanced Smart Filters */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="grid lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="ri-filter-line mr-1"></i>
              {language === 'ru' ? 'Статус заявки' : 'Application Status'}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm pr-8"
            >
              <option value="all">{language === 'ru' ? 'Все статусы' : 'All Statuses'}</option>
              <option value="submitted">{language === 'ru' ? 'Поданные' : 'Submitted'}</option>
              <option value="inReview">{language === 'ru' ? 'На рассмотрении' : 'Under Review'}</option>
              <option value="pending">{language === 'ru' ? 'Ожидают решения' : 'Pending Decision'}</option>
              <option value="approved">{language === 'ru' ? 'Одобренные' : 'Approved'}</option>
              <option value="rejected">{language === 'ru' ? 'Отклоненные' : 'Rejected'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="ri-map-pin-line mr-1"></i>
              {language === 'ru' ? 'Регион (7 областей)' : 'Region (7 Oblasts)'}
            </label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm pr-8"
            >
              {regions.map(region => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="ri-shield-line mr-1"></i>
              {language === 'ru' ? 'Уровень риска' : 'Risk Level'}
            </label>
            <select
              value={filterRiskLevel}
              onChange={(e) => setFilterRiskLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm pr-8"
            >
              <option value="all">{language === 'ru' ? 'Все уровни' : 'All Levels'}</option>
              <option value="low">{language === 'ru' ? 'Низкий риск' : 'Low Risk'}</option>
              <option value="medium">{language === 'ru' ? 'Средний риск' : 'Medium Risk'}</option>
              <option value="high">{language === 'ru' ? 'Высокий риск' : 'High Risk'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="ri-search-line mr-1"></i>
              {language === 'ru' ? 'Поиск' : 'Search'}
            </label>
            <div className="relative">
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
              <input
                type="text"
                placeholder={language === 'ru' ? 'УБК-ID или имя семьи...' : 'УБК-ID or family name...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <i className="ri-settings-3-line mr-1"></i>
              {language === 'ru' ? 'Действия' : 'Actions'}
            </label>
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 inline-flex items-center justify-center font-medium shadow-sm whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-tools-line mr-2"></i>
              {language === 'ru' ? 'Массовые операции' : 'Bulk Actions'}
            </button>
          </div>
        </div>

        {/* Enhanced Quick Filter Chips */}
        <div className="flex flex-wrap gap-3">
          <button className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm hover:bg-red-200 whitespace-nowrap cursor-pointer transition-colors border border-red-200">
            <i className="ri-time-line mr-1"></i>
            {language === 'ru' ? 'Просроченные (4)' : 'Overdue (4)'}
          </button>
          <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm hover:bg-orange-200 whitespace-nowrap cursor-pointer transition-colors border border-orange-200">
            <i className="ri-alert-line mr-1"></i>
            {language === 'ru' ? 'Высокий риск (8)' : 'High Risk (8)'}
          </button>
          <button className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm hover:bg-yellow-200 whitespace-nowrap cursor-pointer transition-colors border border-yellow-200">
            <i className="ri-alarm-warning-line mr-1"></i>
            {language === 'ru' ? 'Требуют внимания (6)' : 'Need Attention (6)'}
          </button>
          <button className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm hover:bg-green-200 whitespace-nowrap cursor-pointer transition-colors border border-green-200">
            <i className="ri-check-line mr-1"></i>
            {language === 'ru' ? 'Готовы к одобрению (12)' : 'Ready to Approve (12)'}
          </button>
          <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm hover:bg-purple-200 whitespace-nowrap cursor-pointer transition-colors border border-purple-200">
            <i className="ri-map-pin-line mr-1"></i>
            {language === 'ru' ? 'Нужны проверки (5)' : 'Need Inspections (5)'}
          </button>
        </div>
      </div>

      {/* Enhanced Bulk Actions Panel */}
      {showBulkActions && selectedApplications.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-multiple-line text-xl text-white"></i>
              </div>
              <div>
                <div className="font-semibold text-blue-900">
                  {language === 'ru' 
                    ? `Выбрано заявок: ${selectedApplications.length}`
                    : `Selected applications: ${selectedApplications.length}`}
                </div>
                <div className="text-sm text-blue-600">
                  {language === 'ru' ? 'Доступны массовые операции' : 'Bulk actions available'}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-flex items-center font-medium whitespace-nowrap cursor-pointer transition-colors shadow-sm">
                <i className="ri-check-double-line mr-2"></i>
                {language === 'ru' ? 'Массовое одобрение' : 'Bulk Approve'}
              </button>
              <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 inline-flex items-center font-medium whitespace-nowrap cursor-pointer transition-colors shadow-sm">
                <i className="ri-map-pin-add-line mr-2"></i>
                {language === 'ru' ? 'Назначить проверки' : 'Schedule Inspections'}
              </button>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 inline-flex items-center font-medium whitespace-nowrap cursor-pointer transition-colors shadow-sm">
                <i className="ri-user-shared-line mr-2"></i>
                {language === 'ru' ? 'Переназначить' : 'Reassign'}
              </button>
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-flex items-center font-medium whitespace-nowrap cursor-pointer transition-colors shadow-sm">
                <i className="ri-close-circle-line mr-2"></i>
                {language === 'ru' ? 'Отклонить' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Applications Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              <i className="ri-file-list-3-line mr-2 text-red-600"></i>
              {language === 'ru' ? 'Очередь заявок УБК' : 'УБК Application Queue'}
            </h3>
            <div className="text-sm text-gray-600">
              {language === 'ru' ? `Показано: ${filteredApplications.length} из ${enhancedApplications.length}` : `Showing: ${filteredApplications.length} of ${enhancedApplications.length}`}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                    onChange={toggleAllApplications}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4"
                  />
                </th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">
                  {language === 'ru' ? 'УБК-ID / Приоритет' : 'УБК-ID / Priority'}
                </th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">
                  {language === 'ru' ? 'Семья / Регион' : 'Family / Region'}
                </th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">
                  {language === 'ru' ? 'Пособие / Риск' : 'Benefit / Risk'}
                </th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">
                  {language === 'ru' ? 'Статус / Время' : 'Status / Time'}
                </th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">
                  {language === 'ru' ? 'Внешние проверки' : 'External Verifications'}
                </th>
                <th className="text-left py-4 px-6 font-bold text-gray-700">
                  {language === 'ru' ? 'Действия' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplications.map((application) => {
                const verificationStatus = getVerificationStatus(application.externalVerifications);
                return (
                  <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => toggleApplicationSelection(application.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                    </td>
                    
                    {/* УБК-ID & Priority */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{application.id}</div>
                          <div className="text-sm text-gray-500">{application.submissionDate}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(application.priority)}`}>
                          {application.priority === 'urgent' ? (language === 'ru' ? 'СРОЧНО' : 'URGENT') :
                           application.priority === 'high' ? (language === 'ru' ? 'ВЫСОКИЙ' : 'HIGH') : 
                           (language === 'ru' ? 'ОБЫЧНЫЙ' : 'NORMAL')}
                        </span>
                      </div>
                    </td>

                    {/* Family & Region */}
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{application.familyHead}</div>
                        <div className="text-sm text-gray-600 flex items-center space-x-3 mt-1">
                          <span className="flex items-center">
                            <i className="ri-map-pin-line mr-1"></i>
                            {application.region}
                          </span>
                          <span className="flex items-center">
                            <i className="ri-group-line mr-1"></i>
                            {application.familySize} {language === 'ru' ? 'чел.' : 'people'}
                          </span>
                          <span className="flex items-center">
                            <i className="ri-bear-smile-line mr-1"></i>
                            {application.childrenCount} {language === 'ru' ? 'детей' : 'children'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Benefit & Risk */}
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-bold text-green-600 text-lg" suppressHydrationWarning={true}>
                          {application.monthlyBenefit.toLocaleString()} {language === 'ru' ? 'сом' : 'som'}
                        </div>
                        <div className={`text-xs px-3 py-1 rounded-full font-medium border ${getRiskColor(application.riskLevel, application.riskScore)}`}>
                          <i className="ri-shield-line mr-1"></i>
                          {language === 'ru' ? 'Риск' : 'Risk'}: {application.riskScore}% 
                          ({application.riskLevel === 'high' ? (language === 'ru' ? 'Высокий' : 'High') :
                            application.riskLevel === 'medium' ? (language === 'ru' ? 'Средний' : 'Medium') :
                            (language === 'ru' ? 'Низкий' : 'Low')})
                        </div>
                      </div>
                    </td>

                    {/* Status & Time */}
                    <td className="py-4 px-6">
                      <div>
                        <span className={`px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(application.status)}`}>
                          {language === 'ru' ? 
                            (application.status === 'inReview' ? 'На рассмотрении' : 
                             application.status === 'approved' ? 'Одобрена' :
                             application.status === 'rejected' ? 'Отклонена' :
                             application.status === 'pending' ? 'Ожидает решения' : 'Подана') :
                            (application.status === 'inReview' ? 'Under Review' : 
                             application.status === 'approved' ? 'Approved' :
                             application.status === 'rejected' ? 'Rejected' :
                             application.status === 'pending' ? 'Pending Decision' : 'Submitted')}
                        </span>
                        <div className={`text-xs mt-2 ${application.daysInQueue > 7 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                          <i className="ri-time-line mr-1"></i>
                          {application.daysInQueue} {language === 'ru' ? 'дней в очереди' : 'days in queue'}
                        </div>
                      </div>
                    </td>

                    {/* External Verifications */}
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <div className={`w-3 h-3 rounded-full ${application.externalVerifications.tunduk === 'verified' ? 'bg-green-500' : application.externalVerifications.tunduk === 'warning' ? 'bg-yellow-500' : 'bg-gray-300'}`} title="Tunduk"></div>
                          <div className={`w-3 h-3 rounded-full ${application.externalVerifications.employment === 'verified' ? 'bg-green-500' : application.externalVerifications.employment === 'warning' ? 'bg-yellow-500' : 'bg-gray-300'}`} title="Employment Center"></div>
                          <div className={`w-3 h-3 rounded-full ${application.externalVerifications.tax === 'verified' ? 'bg-green-500' : application.externalVerifications.tax === 'warning' ? 'bg-yellow-500' : 'bg-gray-300'}`} title="Tax Service"></div>
                          <div className={`w-3 h-3 rounded-full ${application.externalVerifications.banking === 'verified' ? 'bg-green-500' : application.externalVerifications.banking === 'warning' ? 'bg-yellow-500' : 'bg-gray-300'}`} title="Banking"></div>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium text-green-600">{verificationStatus.verified}</span>
                          /{verificationStatus.total} {language === 'ru' ? 'проверено' : 'verified'}
                          {verificationStatus.warnings > 0 && (
                            <span className="ml-2 text-yellow-600">
                              <i className="ri-alert-line"></i> {verificationStatus.warnings}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link href={`/specialist/application/${application.id}`} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-200 font-medium whitespace-nowrap cursor-pointer transition-colors">
                          <i className="ri-eye-line mr-1"></i>
                          {language === 'ru' ? 'Обзор' : 'Review'}
                        </Link>
                        {application.status === 'pending' && (
                          <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-200 font-medium whitespace-nowrap cursor-pointer transition-colors">
                            <i className="ri-check-line mr-1"></i>
                            {language === 'ru' ? 'Одобрить' : 'Approve'}
                          </button>
                        )}
                        {(application.riskLevel === 'high' || application.riskScore > 70) && (
                          <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg text-sm hover:bg-orange-200 font-medium whitespace-nowrap cursor-pointer transition-colors">
                            <i className="ri-map-pin-line mr-1"></i>
                            {language === 'ru' ? 'Проверка' : 'Inspect'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              {language === 'ru' ? `Показано ${filteredApplications.length} заявок` : `Showing ${filteredApplications.length} applications`}
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
                <i className="ri-arrow-left-line"></i>
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded">1</button>
              <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">2</button>
              <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">3</button>
              <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
