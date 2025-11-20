# Business Rules Customization Guide

## Overview

Project Timeline AI uses customizable business rules to generate accurate timelines based on YOUR company's specific work rates, team size, and project standards.

## How It Works

The AI analyzes architectural drawings and generates timeline estimates based on:

1. **Phase Duration Defaults** - Min/max day ranges for each construction phase
2. **Company Details** - Number of crews, parallel work capability
3. **Terminology** - Region-specific building terms (UK, US, AU)
4. **Mapping Logic** - How the AI scales durations based on project complexity

---

## Customization Methods

### Option 1: Admin Settings Page (Recommended)

Visit `/admin/settings` to configure your company's parameters through a visual interface:

**Adjustable Parameters:**
- **Phase Durations** (min/max days for each phase):
  - Demolition
  - First Fix (electrical, plumbing rough-in)
  - Second Fix (fitting fixtures, finishing electrical/plumbing)
  - Plastering
  - Flooring
  - Painting
  - Final Checks

- **Company Details**:
  - Number of crews/teams (for parallel work scaling)
  - Regional terminology preference

**How to use:**
1. Navigate to `https://your-app.vercel.app/admin/settings`
2. Adjust the duration ranges based on your historical data
3. Set your team size (AI will consider parallel work capability)
4. Click "Save Settings"
5. All future uploads will use your custom rules

---

### Option 2: Code-Based Configuration

For multi-tenant or more complex scenarios, create company-specific rule files:

#### Create Custom Rules File

```typescript
// lib/business-rules-company-name.ts
import { BusinessRules } from '@/types';

export const CUSTOM_COMPANY_RULES: BusinessRules = {
  phase_defaults: {
    demolition: [1, 3],      // Your company's typical range
    first_fix: [2, 5],
    second_fix: [3, 6],
    plastering: [1, 3],
    flooring: [1, 2],
    painting: [1, 3],
    final_checks: [1, 1],
  },
  mapping_logic: 'Company has 3 crews. Projects under 2 bedrooms: reduce by 30%. Projects over 4 bedrooms: increase by 40%.',
  terminology: 'Use UK building terms.',
};
```

#### Apply Rules to Specific Clients

```typescript
// app/upload/page.tsx
import { CUSTOM_COMPANY_RULES } from '@/lib/business-rules-company-name';

// In the upload handler, pass specific rules:
const response = await fetch('/api/analyse', {
  method: 'POST',
  body: JSON.stringify({
    fileUrl,
    businessRules: CUSTOM_COMPANY_RULES
  }),
});
```

---

## Example Configurations

### Fast-Paced Small Projects Company
```typescript
{
  phase_defaults: {
    demolition: [1, 2],
    first_fix: [2, 3],
    second_fix: [2, 4],
    plastering: [1, 2],
    flooring: [1, 1],
    painting: [1, 2],
    final_checks: [1, 1],
  },
  mapping_logic: '2-person crew specializing in 1-2 bedroom renovations. Fast turnaround.',
  terminology: 'Use UK building terms.',
}
```

### Large-Scale Construction Company
```typescript
{
  phase_defaults: {
    demolition: [3, 7],
    first_fix: [5, 10],
    second_fix: [6, 12],
    plastering: [3, 7],
    flooring: [2, 5],
    painting: [3, 6],
    final_checks: [2, 3],
  },
  mapping_logic: 'Large company with multiple crews. Projects include commercial and multi-unit residential. Scale up for complex structural work.',
  terminology: 'Use UK building terms.',
}
```

### Luxury/High-End Renovations
```typescript
{
  phase_defaults: {
    demolition: [2, 5],
    first_fix: [4, 9],
    second_fix: [5, 12],
    plastering: [3, 7],
    flooring: [2, 5],
    painting: [3, 7],
    final_checks: [2, 4],
  },
  mapping_logic: 'High-end finishes require additional time. Custom millwork adds 20-30%. Premium fixtures increase second fix by 40%.',
  terminology: 'Use UK building terms.',
}
```

---

## AI Scaling Logic

The AI automatically adjusts durations based on:

### Extracted Information:
- **Room Count** - More rooms = longer duration
- **Total Area** - Larger spaces scale up proportionally
- **Floor Count** - Multi-story adds 30-50% per additional floor
- **Complexity Markers**:
  - Structural modifications
  - Custom features
  - Load-bearing wall changes
  - Significant plumbing/electrical rerouting

### Your Custom Rules Impact:
The phase defaults you set become the **baseline**. The AI then:
1. Starts with your min/max ranges
2. Scales based on project size and complexity
3. Applies your mapping logic instructions
4. Considers team size for parallel work opportunities

---

## Best Practices

### 1. **Use Historical Data**
Review your past 10-20 projects and calculate average durations for each phase. Use these as your baseline.

### 2. **Account for Contingency**
Set max values 20-30% higher than your ideal scenarios to account for delays, material wait times, and unforeseen issues.

### 3. **Update Regularly**
As your team grows or processes improve, revisit and adjust your rules quarterly.

### 4. **Test with Known Projects**
Upload drawings from completed projects to verify the AI generates accurate timelines with your custom rules.

### 5. **Document Special Conditions**
Use the `mapping_logic` field to specify how different project types should be handled:
```typescript
mapping_logic: 'Standard projects use base rates. Listed buildings add 40%. Projects requiring council approvals add 2 weeks to start date.'
```

---

## Multi-Tenant Setup (Advanced)

For SaaS deployments serving multiple companies:

### Database-Backed Rules
Store company-specific rules in Supabase:

```sql
CREATE TABLE company_rules (
  company_id UUID PRIMARY KEY,
  rules JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Dynamic Rule Loading
```typescript
// Fetch rules based on authenticated user
const { data: companyRules } = await supabase
  .from('company_rules')
  .select('rules')
  .eq('company_id', user.company_id)
  .single();

// Use in API call
const response = await fetch('/api/analyse', {
  method: 'POST',
  body: JSON.stringify({
    fileUrl,
    businessRules: companyRules?.rules
  }),
});
```

---

## Terminology Options

### UK Terms (Default)
- First fix, second fix
- Skirting boards
- Plasterboard
- Ground floor

### US Terms
- Rough-in, trim-out
- Baseboards
- Drywall
- First floor

### Australian Terms
- Rough-in, fix-off
- Skirting
- Plasterboard/Gyprock
- Ground floor

---

## Support

For questions about customizing business rules or optimizing for your specific use case, please open a GitHub issue or contact support.
