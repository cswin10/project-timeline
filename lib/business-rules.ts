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
  mapping_logic: `
SCALING RULES:
- Small projects (1-2 rooms, <50m²): Use lower 25% of ranges. Example: demolition = 2-3 days
- Medium projects (3-4 rooms, 50-90m²): Use middle 50% of ranges. Example: demolition = 3-4 days
- Large projects (5-6 rooms, 90-150m²): Use upper 50% of ranges. Example: demolition = 4-5 days
- Very large (7+ rooms, >150m²): Use upper ranges and add 20-30%

ADJUSTMENTS:
- Additional floors: +30% per floor above ground
- Bathrooms: +1 day first fix, +1 day second fix per bathroom beyond first
- Kitchen: +1-2 days for full kitchen fit
- Structural work: +40% to demolition and first fix
- Listed building/conservation: +50% overall
- Poor access (upper floors, no lift): +20% to demolition and materials phases

TYPICAL TIMELINES:
- Studio flat refurb: 10-15 days total
- 2-bed flat refurb: 15-25 days total
- 3-bed house refurb: 25-40 days total
- 4-bed house full renovation: 40-60 days total`,
  terminology: 'Use UK building terms.',
};
