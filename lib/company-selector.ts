import { BusinessRules } from '@/types';
import { DEFAULT_BUSINESS_RULES } from './business-rules';
import { SILVERFERN_RULES } from './business-rules-silverfern';

// Add new companies here as you onboard them
export const COMPANIES = {
  default: {
    name: 'Default UK Standards',
    rules: DEFAULT_BUSINESS_RULES,
  },
  silverfern: {
    name: 'Silverfern Construction',
    rules: SILVERFERN_RULES,
  },
  // Add more companies:
  // company_xyz: {
  //   name: 'XYZ Builders',
  //   rules: COMPANY_XYZ_RULES,
  // },
};

export type CompanyId = keyof typeof COMPANIES;

export function getCompanyRules(companyId: CompanyId = 'default'): BusinessRules {
  return COMPANIES[companyId]?.rules || DEFAULT_BUSINESS_RULES;
}

export function getCompanyName(companyId: CompanyId = 'default'): string {
  return COMPANIES[companyId]?.name || 'Default';
}
