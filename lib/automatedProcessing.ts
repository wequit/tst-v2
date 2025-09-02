
// Automated Processing Engine for УБК System
// This module handles eligibility determination, risk scoring, and duplicate detection

interface FamilyMember {
  name: string;
  age: number;
  relation: string;
  income: number;
}

interface Application {
  id: string;
  familyHead: string;
  region: string;
  childrenCount: number;
  familyMembers: FamilyMember[];
  monthlyIncome: number;
  documents: string[];
  submissionDate: string;
}

interface ProcessingResult {
  eligible: boolean;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  benefitAmount: number;
  recommendedAction: 'auto_approve' | 'review_required' | 'field_inspection' | 'reject';
  reasons: string[];
  duplicateRisk: boolean;
}

// GMD Threshold (Guaranteed Minimum Income) - updated for 2025
const GMD_THRESHOLD = 4500; // soms per person

// Regional coefficients for benefit calculation
const REGIONAL_COEFFICIENTS = {
  'Bishkek': 1.0,
  'Osh': 1.0,
  'Chui': 1.05,
  'Issyk-Kul': 1.1,
  'Talas': 1.1,
  'Jalal-Abad': 1.15,
  'Naryn': 1.2,
  'Batken': 1.25
};

// Border region bonus (additional support for border areas)
const BORDER_REGIONS = ['Batken', 'Naryn'];
const BORDER_BONUS_PER_CHILD = 1000; // soms

// Base benefit amount per child under 16
const BASE_BENEFIT_PER_CHILD = 1200; // soms

export class EligibilityEngine {
  /**
   * Determines if a family is eligible for УБК benefits
   */
  static checkEligibility(application: Application): boolean {
    const childrenUnder16 = application.familyMembers.filter(member => member.age < 16).length;
    
    // Must have children under 16
    if (childrenUnder16 === 0) {
      return false;
    }

    // Calculate total family income
    const totalIncome = application.familyMembers.reduce((sum, member) => sum + member.income, 0);
    const perCapitaIncome = totalIncome / application.familyMembers.length;

    // Income must be below GMD threshold
    return perCapitaIncome < GMD_THRESHOLD;
  }

  /**
   * Calculates benefit amount with regional coefficients
   */
  static calculateBenefit(application: Application): number {
    const childrenUnder16 = application.familyMembers.filter(member => member.age < 16).length;
    
    if (childrenUnder16 === 0) return 0;

    let baseAmount = BASE_BENEFIT_PER_CHILD * childrenUnder16;
    
    // Apply regional coefficient
    const coefficient = REGIONAL_COEFFICIENTS[application.region] || 1.0;
    let finalAmount = baseAmount * coefficient;

    // Add border region bonus
    if (BORDER_REGIONS.includes(application.region)) {
      finalAmount += BORDER_BONUS_PER_CHILD * childrenUnder16;
    }

    return Math.round(finalAmount);
  }

  /**
   * Validates family composition and documents
   */
  static validateApplication(application: Application): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check required documents
    const requiredDocs = ['birth_certificates', 'income_declaration', 'residence_certificate'];
    requiredDocs.forEach(doc => {
      if (!application.documents.includes(doc)) {
        issues.push(`Missing required document: ${doc}`);
      }
    });

    // Validate family member ages
    const childrenUnder16 = application.familyMembers.filter(member => member.age < 16);
    if (childrenUnder16.length !== application.childrenCount) {
      issues.push('Children count mismatch with family composition');
    }

    // Check for unrealistic income declarations
    const totalDeclaredIncome = application.familyMembers.reduce((sum, member) => sum + member.income, 0);
    if (totalDeclaredIncome !== application.monthlyIncome) {
      issues.push('Income declaration inconsistency');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

export class RiskScoringEngine {
  /**
   * Calculates comprehensive risk score for fraud detection
   */
  static calculateRiskScore(application: Application): { score: number; factors: string[] } {
    let riskScore = 0;
    const riskFactors: string[] = [];

    // Income-based risk factors
    const totalIncome = application.familyMembers.reduce((sum, member) => sum + member.income, 0);
    const perCapitaIncome = totalIncome / application.familyMembers.length;
    
    // Suspiciously low income (possible underreporting)
    if (perCapitaIncome < GMD_THRESHOLD * 0.3) {
      riskScore += 25;
      riskFactors.push('Extremely low declared income');
    }

    // Income just below threshold (potential manipulation)
    if (perCapitaIncome > GMD_THRESHOLD * 0.9 && perCapitaIncome < GMD_THRESHOLD) {
      riskScore += 15;
      riskFactors.push('Income suspiciously close to threshold');
    }

    // Large family size risk
    if (application.familyMembers.length > 8) {
      riskScore += 20;
      riskFactors.push('Unusually large family size');
    }

    // Multiple children under 16 with zero income adults
    const adultsWithIncome = application.familyMembers.filter(member => member.age >= 18 && member.income > 0);
    const childrenUnder16 = application.familyMembers.filter(member => member.age < 16);
    
    if (childrenUnder16.length > 3 && adultsWithIncome.length === 0) {
      riskScore += 30;
      riskFactors.push('Multiple children with no working adults');
    }

    // Document submission timing patterns
    const submissionDate = new Date(application.submissionDate);
    const dayOfMonth = submissionDate.getDate();
    
    // Applications submitted right before deadline periods
    if (dayOfMonth > 25) {
      riskScore += 10;
      riskFactors.push('End-of-month submission pattern');
    }

    // Geographic risk factors
    const highRiskRegions = ['Batken', 'Osh']; // Areas with higher fraud rates
    if (highRiskRegions.includes(application.region)) {
      riskScore += 10;
      riskFactors.push('High-risk geographic region');
    }

    // Age distribution anomalies
    const ageGaps = this.checkAgeGaps(application.familyMembers);
    if (ageGaps) {
      riskScore += 15;
      riskFactors.push('Suspicious age distribution in family');
    }

    return {
      score: Math.min(riskScore, 100), // Cap at 100
      factors: riskFactors
    };
  }

  /**
   * Checks for suspicious age gaps in family composition
   */
  private static checkAgeGaps(members: FamilyMember[]): boolean {
    const sortedByAge = members.sort((a, b) => b.age - a.age);
    
    // Check for unrealistic age gaps between parents and children
    const adults = sortedByAge.filter(m => m.age >= 18);
    const children = sortedByAge.filter(m => m.age < 18);
    
    if (adults.length > 0 && children.length > 0) {
      const oldestAdult = Math.max(...adults.map(a => a.age));
      const oldestChild = Math.max(...children.map(c => c.age));
      
      // Parent-child age gap too small (less than 16 years)
      if (oldestAdult - oldestChild < 16) {
        return true;
      }
    }

    return false;
  }

  /**
   * Determines risk level based on score
   */
  static getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }
}

export class DuplicateDetectionEngine {
  private static existingApplications: Application[] = []; // In real implementation, this would be from database

  /**
   * Checks for potential duplicate applications
   */
  static checkForDuplicates(application: Application): { 
    isDuplicate: boolean; 
    matches: { id: string; similarity: number; reason: string }[] 
  } {
    const matches: { id: string; similarity: number; reason: string }[] = [];

    this.existingApplications.forEach(existing => {
      if (existing.id === application.id) return; // Skip self

      let similarity = 0;
      const reasons: string[] = [];

      // Exact family head name match
      if (existing.familyHead.toLowerCase() === application.familyHead.toLowerCase()) {
        similarity += 40;
        reasons.push('Identical family head name');
      }

      // Similar family composition
      if (existing.familyMembers.length === application.familyMembers.length) {
        similarity += 20;
        reasons.push('Same family size');
      }

      // Same region and children count
      if (existing.region === application.region && existing.childrenCount === application.childrenCount) {
        similarity += 20;
        reasons.push('Same region and children count');
      }

      // Similar income levels (within 10% difference)
      const incomeDiff = Math.abs(existing.monthlyIncome - application.monthlyIncome) / existing.monthlyIncome;
      if (incomeDiff < 0.1) {
        similarity += 15;
        reasons.push('Very similar income levels');
      }

      // Family member name similarities
      const nameMatches = this.checkNameSimilarities(existing.familyMembers, application.familyMembers);
      if (nameMatches > 0.7) {
        similarity += 25;
        reasons.push('High family member name similarity');
      }

      if (similarity >= 60) {
        matches.push({
          id: existing.id,
          similarity,
          reason: reasons.join(', ')
        });
      }
    });

    return {
      isDuplicate: matches.length > 0,
      matches: matches.sort((a, b) => b.similarity - a.similarity)
    };
  }

  /**
   * Calculates name similarity score between family members
   */
  private static checkNameSimilarities(members1: FamilyMember[], members2: FamilyMember[]): number {
    let totalMatches = 0;
    let possibleMatches = Math.min(members1.length, members2.length);

    if (possibleMatches === 0) return 0;

    members1.forEach(member1 => {
      members2.forEach(member2 => {
        const similarity = this.calculateStringSimilarity(member1.name, member2.name);
        if (similarity > 0.8) {
          totalMatches++;
        }
      });
    });

    return totalMatches / possibleMatches;
  }

  /**
   * Calculates string similarity using Levenshtein distance
   */
  private static calculateStringSimilarity(str1: string, str2: string): number {
    const matrix: number[][] = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const distance = matrix[len2][len1];
    const maxLength = Math.max(len1, len2);
    return 1 - distance / maxLength;
  }

  /**
   * Updates the existing applications database (for simulation)
   */
  static updateApplicationsDatabase(applications: Application[]) {
    this.existingApplications = applications;
  }
}

export class AutomatedProcessingEngine {
  /**
   * Main processing function that combines all engines
   */
  static processApplication(application: Application): ProcessingResult {
    // Step 1: Check basic eligibility
    const isEligible = EligibilityEngine.checkEligibility(application);
    
    // Step 2: Validate application completeness
    const validation = EligibilityEngine.validateApplication(application);
    
    // Step 3: Calculate risk score
    const riskAssessment = RiskScoringEngine.calculateRiskScore(application);
    const riskLevel = RiskScoringEngine.getRiskLevel(riskAssessment.score);
    
    // Step 4: Check for duplicates
    const duplicateCheck = DuplicateDetectionEngine.checkForDuplicates(application);
    
    // Step 5: Calculate benefit amount
    const benefitAmount = isEligible ? EligibilityEngine.calculateBenefit(application) : 0;
    
    // Step 6: Determine recommended action
    let recommendedAction: ProcessingResult['recommendedAction'];
    const reasons: string[] = [];

    if (!isEligible) {
      recommendedAction = 'reject';
      reasons.push('Family does not meet eligibility criteria');
    } else if (!validation.valid) {
      recommendedAction = 'review_required';
      reasons.push('Application validation issues found');
      reasons.push(...validation.issues);
    } else if (duplicateCheck.isDuplicate) {
      recommendedAction = 'review_required';
      reasons.push('Potential duplicate application detected');
      reasons.push(...duplicateCheck.matches.map(m => `Similar to ${m.id}: ${m.reason}`));
    } else if (riskLevel === 'high') {
      recommendedAction = 'field_inspection';
      reasons.push('High fraud risk detected');
      reasons.push(...riskAssessment.factors);
    } else if (riskLevel === 'medium') {
      recommendedAction = 'review_required';
      reasons.push('Medium risk level requires manual review');
      reasons.push(...riskAssessment.factors);
    } else if (benefitAmount > 5000) {
      recommendedAction = 'review_required';
      reasons.push('High benefit amount requires supervisor approval');
    } else {
      recommendedAction = 'auto_approve';
      reasons.push('All automated checks passed');
    }

    return {
      eligible: isEligible,
      riskScore: riskAssessment.score,
      riskLevel,
      benefitAmount,
      recommendedAction,
      reasons,
      duplicateRisk: duplicateCheck.isDuplicate
    };
  }

  /**
   * Batch processing for multiple applications
   */
  static batchProcess(applications: Application[]): Map<string, ProcessingResult> {
    // Update duplicate detection database
    DuplicateDetectionEngine.updateApplicationsDatabase(applications);
    
    const results = new Map<string, ProcessingResult>();
    
    applications.forEach(application => {
      const result = this.processApplication(application);
      results.set(application.id, result);
    });

    return results;
  }

  /**
   * Generate processing statistics
   */
  static generateProcessingStats(results: Map<string, ProcessingResult>) {
    const stats = {
      total: results.size,
      autoApproved: 0,
      reviewRequired: 0,
      fieldInspectionRequired: 0,
      rejected: 0,
      highRisk: 0,
      duplicatesDetected: 0,
      averageRiskScore: 0,
      totalBenefitAmount: 0
    };

    let totalRiskScore = 0;

    results.forEach(result => {
      switch (result.recommendedAction) {
        case 'auto_approve':
          stats.autoApproved++;
          break;
        case 'review_required':
          stats.reviewRequired++;
          break;
        case 'field_inspection':
          stats.fieldInspectionRequired++;
          break;
        case 'reject':
          stats.rejected++;
          break;
      }

      if (result.riskLevel === 'high') stats.highRisk++;
      if (result.duplicateRisk) stats.duplicatesDetected++;
      
      totalRiskScore += result.riskScore;
      stats.totalBenefitAmount += result.benefitAmount;
    });

    stats.averageRiskScore = Math.round(totalRiskScore / stats.total);

    return stats;
  }
}

// Export types for use in other modules
export type { Application, FamilyMember, ProcessingResult };
