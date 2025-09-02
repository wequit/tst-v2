
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CaseReviewWorkspace from '@/components/specialist/CaseReviewWorkspace';
import DecisionMakingTools from '@/components/specialist/DecisionMakingTools';

interface ApplicationReviewProps {
  applicationId: string;
}

export default function ApplicationReview({ applicationId }: ApplicationReviewProps) {
  const [language, setLanguage] = useState('ru');
  const [activeSection, setActiveSection] = useState('review');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDecision = (decision: 'approve' | 'reject') => {
    // Handle decision logic here
    console.log(`Decision for ${applicationId}: ${decision}`);
    // Redirect back to specialist dashboard or show success message
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <i className="ri-government-line text-3xl text-white"></i>
          </div>
          <div className="text-gray-600 text-lg">Loading application review...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/specialist/dashboard" className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="ri-government-line text-3xl text-white"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {language === 'ru' ? 'Рассмотрение заявки' : 'Application Review'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {applicationId} - {language === 'ru' ? 'Детальный анализ и принятие решения' : 'Detailed analysis and decision making'}
                  </p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <i className="ri-user-3-line text-xl text-white"></i>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {language === 'ru' ? 'Айгүл Жумагуловна Касымова' : 'Aigul Zhumaqulovna Kasymova'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'ru' ? 'Старший специалист МТСР' : 'Senior MTSM Specialist'}
                  </div>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-2 text-sm rounded font-medium cursor-pointer transition-all ${language === 'ru' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  Русский
                </button>
                <button
                  onClick={() => setLanguage('ky')}
                  className={`px-3 py-2 text-sm rounded font-medium cursor-pointer transition-all ${language === 'ky' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  Кыргызча
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-7xl">
        {/* Section Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveSection('review')}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-3 whitespace-nowrap cursor-pointer transition-all ${
                  activeSection === 'review'
                    ? 'border-red-600 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="ri-search-2-line mr-2 text-lg"></i>
                {language === 'ru' ? 'Рассмотрение дела' : 'Case Review'}
              </button>
              <button
                onClick={() => setActiveSection('decision')}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-3 whitespace-nowrap cursor-pointer transition-all ${
                  activeSection === 'decision'
                    ? 'border-red-600 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="ri-gavel-line mr-2 text-lg"></i>
                {language === 'ru' ? 'Принятие решения' : 'Decision Making'}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeSection === 'review' && (
              <CaseReviewWorkspace language={language} applicationId={applicationId} />
            )}
            
            {activeSection === 'decision' && (
              <DecisionMakingTools 
                language={language} 
                application={{ id: applicationId, childrenCount: 2, region: 'Бишкек' }}
                family={{ members: [] }}
                onDecision={handleDecision}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
