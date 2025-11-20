import { BusinessRules } from '@/types';

export const DEFAULT_BUSINESS_RULES: BusinessRules = {
  phase_defaults: {
    demolition: [2, 5],
    first_fix: [3, 7],
    second_fix: [4, 8],
    plastering: [2, 5],
    flooring: [1, 3],
    painting: [2, 4],
    final_checks: [1, 2],
  },
  mapping_logic:
    'Match rooms and structural elements to relevant phases. Increase duration for larger areas, complex layouts, or additional floors.',
  terminology: 'Use UK building terms.',
};
