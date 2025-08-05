
import { regions, GMD_THRESHOLD, BASE_BENEFIT_PER_CHILD, externalIntegrations } from './mockData';

export interface FamilyMember {
  name: string;
  age: number;
  relation: string;
  income: number;
}

export interface BenefitCalculation {
  eligible: boolean;
  perCapitaIncome: number;
  childrenUnder16: number;
  baseBenefit: number;
  regionalCoefficient: number;
  borderBonus: number;
  totalMonthlyBenefit: number;
  reason?: string;
}

export interface ExternalCheckResult {
  system: string;
  status: 'success' | 'warning' | 'error';
  data: any;
  message: string;
}

// Enhanced benefit calculation engine with regional coefficients
export function calculateBenefit(
  familyMembers: FamilyMember[],
  regionId: string,
  totalIncome: number
): BenefitCalculation {
  const region = regions.find(r => r.id === regionId);
  if (!region) {
    throw new Error('Invalid region');
  }

  const childrenUnder16 = familyMembers.filter(member => member.age < 16).length;
  
  if (childrenUnder16 === 0) {
    return {
      eligible: false,
      perCapitaIncome: 0,
      childrenUnder16: 0,
      baseBenefit: 0,
      regionalCoefficient: region.coefficient,
      borderBonus: 0,
      totalMonthlyBenefit: 0,
      reason: 'No children under 16 years old'
    };
  }

  const perCapitaIncome = familyMembers.length > 0 ? totalIncome / familyMembers.length : 0;
  
  // Check eligibility - per capita income must be below GMD threshold
  const eligible = perCapitaIncome < GMD_THRESHOLD;
  
  if (!eligible) {
    return {
      eligible: false,
      perCapitaIncome,
      childrenUnder16,
      baseBenefit: 0,
      regionalCoefficient: region.coefficient,
      borderBonus: 0,
      totalMonthlyBenefit: 0,
      reason: `Per capita income (${Math.round(perCapitaIncome)} сом) exceeds GMD threshold (${GMD_THRESHOLD} сом)`
    };
  }

  // Base Amount: 1,200 soms per child under 16
  const baseBenefit = BASE_BENEFIT_PER_CHILD * childrenUnder16;
  
  // Apply regional coefficients
  let regionallyAdjustedBenefit = baseBenefit * region.coefficient;
  
  // Border regions with special status: Regional coefficient × 1.20 + 1,000 soms compensation
  let borderBonus = 0;
  if (region.type === 'border') {
    // Additional 20% boost for border regions
    regionallyAdjustedBenefit = baseBenefit * region.coefficient * 1.20;
    // Plus 1,000 soms compensation per child
    borderBonus = (region.borderBonus || 1000) * childrenUnder16;
  }
  
  const totalMonthlyBenefit = regionallyAdjustedBenefit + borderBonus;

  return {
    eligible: true,
    perCapitaIncome: Math.round(perCapitaIncome),
    childrenUnder16,
    baseBenefit,
    regionalCoefficient: region.coefficient,
    borderBonus,
    totalMonthlyBenefit: Math.round(totalMonthlyBenefit)
  };
}

// Simulate external system integrations
export async function simulateExternalCheck(systemId: string, citizenData: any): Promise<ExternalCheckResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  
  const integration = externalIntegrations.find(i => i.id === systemId);
  if (!integration) {
    return {
      system: systemId,
      status: 'error',
      data: null,
      message: 'System not found'
    };
  }

  // Simulate different responses based on system
  switch (systemId) {
    case 'tunduk':
      return {
        system: 'Tunduk',
        status: 'success',
        data: {
          identity_verified: true,
          personal_id: citizenData.personalId,
          full_name: citizenData.fullName,
          birth_date: '1992-05-15',
          citizenship: 'Кыргызстан'
        },
        message: 'Identity successfully verified'
      };

    case 'employment_center':
      return {
        system: 'Employment Center',
        status: 'success',
        data: {
          unemployment_status: 'registered',
          registration_date: '2025-01-01',
          benefits_received: false
        },
        message: 'Employment status confirmed'
      };

    case 'medical_commission':
      return {
        system: 'Medical Commission',
        status: 'success',
        data: {
          disability_status: 'none',
          last_examination: null,
          benefits_received: false
        },
        message: 'No disability status found'
      };

    case 'sanaryp_aymak':
      return {
        system: 'Sanaryp Aymak',
        status: 'success',
        data: {
          comprehensive_data: true,
          family_composition_verified: true,
          address_confirmed: true,
          last_update: '2025-01-15'
        },
        message: 'Comprehensive citizen data verified'
      };

    case 'tax_service':
      return {
        system: 'Tax Service',
        status: 'success',
        data: {
          declared_income: 24000,
          tax_compliance: true,
          business_registration: false,
          last_declaration: '2024-12-31'
        },
        message: 'Tax information verified'
      };

    case 'cadastre':
      return {
        system: 'Cadastre',
        status: 'success',
        data: {
          property_ownership: true,
          properties: [
            {
              type: 'apartment',
              address: 'г. Бишкек, ул. Манаса 45, кв. 12',
              area: '65 sq.m',
              value: 2500000
            }
          ],
          land_ownership: false
        },
        message: 'Property information verified'
      };

    case 'banks':
      return {
        system: 'Banking System',
        status: 'success',
        data: {
          accounts_count: 2,
          total_deposits: 45000,
          active_loans: false,
          credit_history: 'good',
          last_transaction: '2025-01-20'
        },
        message: 'Banking information verified'
      };

    case 'probation':
      return {
        system: 'Probation Department',
        status: 'success',
        data: {
          criminal_record: 'clean',
          probation_status: 'none',
          restrictions: false,
          last_check: '2025-01-15'
        },
        message: 'No criminal restrictions found'
      };

    default:
      return {
        system: systemId,
        status: 'warning',
        data: null,
        message: 'System check not implemented'
      };
  }
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()} сом`;
}

export function getRegionTypeDescription(regionType: string, language: string = 'ru'): string {
  const descriptions = {
    ru: {
      urban: 'Городская местность (коэффициент 1.0)',
      rural: 'Сельская местность (коэффициент 1.0)', 
      mountainous: 'Горная местность (коэффициент +15%)',
      border: 'Приграничная зона (коэффициент +20% × 1.20 + 1000 сом)'
    },
    ky: {
      urban: 'Шаар жери (коэффициент 1.0)',
      rural: 'Айыл жери (коэффициент 1.0)',
      mountainous: 'Тоолуу жер (коэффициент +15%)',
      border: 'Чек ара аймак (коэффициент +20% × 1.20 + 1000 сом)'
    }
  };
  
  return descriptions[language as keyof typeof descriptions]?.[regionType as keyof typeof descriptions.ru] || regionType;
}

// Validate family composition for eligibility
export function validateFamilyComposition(familyMembers: FamilyMember[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (familyMembers.length === 0) {
    errors.push('Family must have at least one member');
  }
  
  const childrenUnder16 = familyMembers.filter(m => m.age < 16).length;
  if (childrenUnder16 === 0) {
    errors.push('Family must have at least one child under 16 years old');
  }
  
  const invalidMembers = familyMembers.filter(m => !m.name || m.age < 0 || !m.relation);
  if (invalidMembers.length > 0) {
    errors.push('All family members must have name, age, and relation specified');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Calculate income breakdown by categories
export function calculateIncomeBreakdown(incomes: Record<string, number>) {
  const categories = {
    primary: 0,      // I. Primary Income
    education: 0,    // II. Education
    other: 0,        // III. Other Income
    business: 0,     // IV. Business Activity
    land: 0,         // V. Land Ownership
    farming: 0,      // VI. Subsidiary Farming
    financial: 0     // VII. Bank Deposits and Investments
  };
  
  // Map income types to categories
  const categoryMap = {
    salary: 'primary', pension: 'primary',
    scholarship: 'education', tuition: 'education',
    alimony: 'other', dividends: 'other', assistance: 'other',
    business: 'business', patents: 'business',
    irrigated_agriculture: 'land', rain_fed_agriculture: 'land',
    livestock: 'farming', personal_farming: 'farming',
    deposits: 'financial', investments: 'financial'
  };
  
  Object.entries(incomes).forEach(([key, value]) => {
    const category = categoryMap[key as keyof typeof categoryMap];
    if (category && value > 0) {
      categories[category as keyof typeof categories] += value;
    }
  });
  
  const total = Object.values(categories).reduce((sum, value) => sum + value, 0);
  
  return {
    categories,
    total,
    breakdown: Object.entries(categories)
      .filter(([, value]) => value > 0)
      .map(([category, value]) => ({
        category,
        amount: value,
        percentage: total > 0 ? Math.round((value / total) * 100) : 0
      }))
  };
}
