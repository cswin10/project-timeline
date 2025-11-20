import { BusinessRules } from '@/types';

// Silverfern Construction - Company-Specific Rules
// Based on historical data from 30 projects (Jan 2024 - Nov 2024)
// Last updated: [DATE]

export const SILVERFERN_RULES: BusinessRules = {
  phase_defaults: {
    demolition: [2, 4],        // Silverfern avg: 2.5 days for medium projects
    first_fix: [3, 6],         // Silverfern avg: 4 days for medium projects
    second_fix: [4, 7],        // Silverfern avg: 5.5 days for medium projects
    plastering: [2, 4],        // Silverfern avg: 3 days for medium projects
    flooring: [1, 3],          // Silverfern avg: 2 days for medium projects
    painting: [2, 3],          // Silverfern avg: 2.5 days for medium projects
    final_checks: [1, 2],      // Silverfern avg: 1 day
  },
  mapping_logic: `
SILVERFERN CONSTRUCTION - COMPANY PROFILE:
- Team: 2 full-time crews of 3 people each
- Specialization: Residential refurbishments (flats and houses)
- Coverage: London and surrounding areas
- Average projects: 2-4 bed properties, 15-35 day turnaround

SCALING RULES (Based on Silverfern historical data):
- Small projects (1-2 rooms, <50m²): 10-14 days total
  Example: Studio flat refurb = 12 days average
- Medium projects (3-4 rooms, 50-90m²): 16-25 days total
  Example: 2-bed flat refurb = 20 days average
- Large projects (5-6 rooms, 90-150m²): 26-40 days total
  Example: 3-bed house refurb = 32 days average
- Very large (7+ rooms, >150m²): 40-60 days total
  Example: 4-bed house full renovation = 48 days average

SILVERFERN-SPECIFIC ADJUSTMENTS:
- Additional floors: +25% per floor (Silverfern has efficient multi-floor workflow)
- Extra bathrooms: +1.5 days first fix, +1.5 days second fix per bathroom
- Full kitchen refit: +2 days (Silverfern works with preferred suppliers for fast delivery)
- Structural work (load-bearing walls): +35% to demolition and first fix
- Listed buildings: +40% overall (Silverfern has conservation specialists)
- Upper floors without lift: +15% to demolition phase only (specialized equipment)
- Period property features (cornicing, original flooring): +3-5 days to second fix and finishing

TEAM CAPACITY:
- 2 crews available: Can run demolition and first fix in parallel on larger projects
- For projects >100m²: Consider overlap between phases (start plastering while finishing second fix)
- Single crew projects (<60m²): Sequential phases, faster turnaround
- Multi-crew projects (>100m²): +20% efficiency due to parallel work

SILVERFERN BENCHMARKS (Actual completed projects):
- 35m² studio flat, ground floor: 11 days
- 65m² 2-bed flat, 3rd floor no lift: 22 days
- 95m² 3-bed house, structural wall removal: 29 days
- 140m² 4-bed house, loft conversion: 47 days
- 180m² period property, full renovation: 68 days

SEASONAL FACTORS:
- December-January: +10% (holiday period, material delays)
- July-August: Standard (good weather, reliable supply chain)
`,
  terminology: 'Use UK building terms. Silverfern clients expect professional UK terminology.',
};

// Notes for future updates:
// - Review quarterly with actual vs. estimated data
// - Adjust ranges based on team performance improvements
// - Factor in new partnerships (e.g., faster material suppliers)
// - Consider adding specialty areas (e.g., basement conversions)
