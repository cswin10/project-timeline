# Building Age & Renovation Complexity Feature

## Overview
The AI must differentiate between new builds, modern refurbs, period properties, and listed buildings - each has VERY different timelines.

## Enhanced AI Prompt

Add to the AI prompt:

```
STEP 1A: BUILDING AGE & CONDITION ANALYSIS

Analyze and identify:

AGE INDICATORS:
- Architectural style (Victorian, Edwardian, Georgian, Modern, etc.)
- Construction type (solid wall, cavity wall, timber frame)
- Original features (sash windows, picture rails, cornicing, fireplaces)
- Notes on drawings about building age
- Materials mentioned (lath & plaster = pre-1950, plasterboard = post-1950)

CLASSIFY BUILDING AGE:
- Modern (post-2000): Standard timelines
- Contemporary (1980-2000): +10% (minor complications)
- Post-War (1945-1980): +20% (potential asbestos, lead pipes)
- Inter-War (1920-1945): +25% (solid walls, older systems)
- Victorian/Edwardian (1840-1920): +40% (period features, structural issues)
- Georgian/Older (pre-1840): +50% (specialist work required)
- Listed Building: +60-100% (conservation restrictions)

RENOVATION TYPE:
- New Build Completion: Base timelines
- Cosmetic Refurb: -10% (painting, flooring only)
- Standard Renovation: Base timelines
- Full Renovation: +20% (stripping to shell)
- Structural Work: +40% (extensions, loft conversions)
- Period Restoration: +60% (preserving original features)
- Listed Building Work: +80-100% (planning + conservation)

COMMON OLD BUILDING ISSUES:
Pre-1999 buildings:
├─ Asbestos Survey Required: +3-5 days before start
├─ Asbestos Removal: +5-15 days if found
├─ Add to assumptions: "Asbestos survey required for pre-1999 property"

Pre-1970 buildings:
├─ Lead Pipes Likely: +2-3 days for replacement
├─ Old Wiring: +20% to first fix electrical
├─ Add to assumptions: "Electrical rewiring likely needed"

Pre-1950 buildings:
├─ Lath & Plaster: +30% to plastering (removal + re-skim)
├─ Solid Walls: +15% to insulation/damp work
├─ Original Features: +5 days for careful preservation

Period Properties (Pre-1920):
├─ Structural Movement: Survey + stabilization +10-20 days
├─ Original Joinery: Specialist restoration +15%
├─ Heritage Materials: Longer lead times +10%
├─ Craftsman Requirements: +25% to finishing work

Listed Buildings:
├─ Planning Approval: +30-60 days (pre-work)
├─ Conservation Officer: +5-10 days for inspections
├─ Specialist Materials: +20% to all phases
├─ Approved Methods Only: +40% overall time
```

## Enhanced Business Rules

```typescript
export const SILVERFERN_RULES = {
  // ... existing rules ...

  building_age_adjustments: {
    modern_post_2000: {
      multiplier: 1.0,
      notes: "Standard timelines apply"
    },
    contemporary_1980_2000: {
      multiplier: 1.10,
      additional_considerations: [
        "Possible asbestos in textured coatings",
        "Dated electrical systems may need upgrade"
      ]
    },
    post_war_1945_1980: {
      multiplier: 1.20,
      additional_time: {
        "Asbestos survey": [3, 5],
        "Potential asbestos removal": [5, 15],
        "Lead pipe replacement": [2, 3]
      },
      additional_considerations: [
        "Asbestos survey mandatory",
        "Lead pipes common in pre-1970",
        "Electrical rewiring usually required"
      ]
    },
    inter_war_1920_1945: {
      multiplier: 1.25,
      additional_considerations: [
        "Solid wall construction (no cavity)",
        "Damp issues common",
        "Original features may be preserved"
      ]
    },
    victorian_edwardian_1840_1920: {
      multiplier: 1.40,
      additional_time: {
        "Lath & plaster removal": [2, 4],
        "Original feature preservation": [3, 7],
        "Structural assessment": [2, 5]
      },
      additional_considerations: [
        "Lath and plaster ceilings/walls",
        "Original cornicing and period features",
        "Possible subsidence/structural movement",
        "Solid wall construction",
        "Original joinery preservation"
      ]
    },
    georgian_older_pre_1840: {
      multiplier: 1.50,
      additional_considerations: [
        "Specialist craftsmen required",
        "Heritage materials needed",
        "Structural survey essential",
        "Traditional methods required"
      ]
    },
    listed_building: {
      multiplier: 1.80,
      additional_time: {
        "Planning & conservation approval": [30, 60],
        "Conservation officer inspections": [5, 10],
        "Specialist material sourcing": [10, 20]
      },
      additional_considerations: [
        "Listed building consent required",
        "Conservation area restrictions",
        "Approved materials and methods only",
        "Heritage craftsmen required",
        "Progress inspections by conservation officer"
      ]
    }
  },

  renovation_types: {
    cosmetic: {
      phases: ["painting", "flooring", "final_checks"],
      multiplier: 0.90,
      description: "Painting, flooring, and cosmetic updates only"
    },
    standard_refurb: {
      phases: ["demolition", "first_fix", "second_fix", "plastering", "flooring", "painting", "final_checks"],
      multiplier: 1.0,
      description: "Full renovation with modern finishes"
    },
    full_renovation: {
      phases: ["demolition", "structural", "first_fix", "second_fix", "plastering", "flooring", "painting", "final_checks"],
      multiplier: 1.20,
      description: "Strip to shell and rebuild interior"
    },
    period_restoration: {
      phases: ["careful_demolition", "structural_survey", "conservation_work", "first_fix", "specialist_second_fix", "period_plastering", "period_joinery", "specialist_finishing"],
      multiplier: 1.60,
      description: "Restore and preserve original features"
    }
  }
};
```

## Example AI Output for Old Building

```json
{
  "project_summary": "Victorian terraced house (c.1890), 85m², full renovation including preservation of original features. Property shows typical period construction: solid walls, lath & plaster ceilings, original sash windows, and decorative cornicing. Asbestos survey required before work commences.",

  "building_analysis": {
    "estimated_age": "1890s (Victorian)",
    "construction_type": "Solid wall, traditional timber joists",
    "condition": "Original features present, requires full renovation",
    "special_considerations": [
      "Lath and plaster ceilings throughout",
      "Original cornicing in reception rooms",
      "Sash windows to be retained",
      "Asbestos survey required (pre-1999)"
    ]
  },

  "phases": [
    {
      "name": "Pre-Work Assessments",
      "description": "Asbestos survey (mandatory for pre-1999 property) and structural assessment",
      "duration_days_min": 5,
      "duration_days_max": 8
    },
    {
      "name": "Careful Demolition",
      "description": "Strip out non-original elements while preserving Victorian features including cornicing, picture rails, and original joinery",
      "duration_days_min": 5,
      "duration_days_max": 7
    },
    {
      "name": "First Fix (Rewire & Re-plumb)",
      "description": "Complete rewire required for Victorian property. New plumbing including lead pipe replacement. Work around original features.",
      "duration_days_min": 6,
      "duration_days_max": 9
    },
    {
      "name": "Lath & Plaster Replacement",
      "description": "Remove deteriorated lath & plaster, install plasterboard with period-appropriate skim finish",
      "duration_days_min": 5,
      "duration_days_max": 8
    },
    // ... more phases ...
  ],

  "total_duration_days_min": 38,
  "total_duration_days_max": 52,

  "assumptions": [
    "Estimated as Victorian terraced house (c.1890) based on architectural style",
    "Asbestos survey assumed to find minimal ACMs requiring 3-5 day removal",
    "Original features (cornicing, joinery) to be preserved adding 15% to relevant phases",
    "Solid wall construction requires specialist damp treatment",
    "Lead pipes assumed present, requiring replacement",
    "Electrical rewiring essential (no ring main in original construction)"
  ],

  "risk_factors": [
    "Asbestos survey may reveal extensive ACMs requiring longer removal period",
    "Structural movement common in Victorian terraces - survey may reveal additional work needed",
    "Original lath & plaster condition varies - some areas may require more extensive work",
    "Period features may be more deteriorated than visible, requiring specialist restoration",
    "Solid walls may have damp issues requiring treatment before plastering",
    "Hidden structural issues common in properties of this age"
  ]
}
```

## UI Enhancement - Building Age Selector

For admin settings or upload page:

```tsx
<Card className="mb-6">
  <h3 className="text-xl font-semibold mb-4">Building Information</h3>

  <div className="mb-4">
    <label className="block font-semibold mb-2">Building Age (if known)</label>
    <select className="w-full px-3 py-2 border rounded">
      <option value="auto">Auto-detect from drawing</option>
      <option value="modern">Modern (post-2000)</option>
      <option value="contemporary">Contemporary (1980-2000)</option>
      <option value="post_war">Post-War (1945-1980)</option>
      <option value="inter_war">Inter-War (1920-1945)</option>
      <option value="victorian">Victorian/Edwardian (1840-1920)</option>
      <option value="georgian">Georgian/Older (pre-1840)</option>
      <option value="listed">Listed Building</option>
    </select>
  </div>

  <div className="mb-4">
    <label className="block font-semibold mb-2">Renovation Type</label>
    <select className="w-full px-3 py-2 border rounded">
      <option value="auto">Auto-detect from scope</option>
      <option value="cosmetic">Cosmetic Refurb</option>
      <option value="standard">Standard Renovation</option>
      <option value="full">Full Renovation</option>
      <option value="structural">Structural Work</option>
      <option value="period">Period Restoration</option>
      <option value="listed_work">Listed Building Work</option>
    </select>
  </div>

  <div className="text-sm text-gray-600">
    <p>💡 The AI will automatically detect building age from architectural style and features, but you can override if known.</p>
  </div>
</Card>
```

## Value Proposition

### For Silverfern:
- **Accurate estimates** for their specialty (period properties)
- **Client education** - explains WHY old buildings take longer
- **Premium pricing justification** - "Victorian properties require 40% more time due to..."
- **Risk mitigation** - flags asbestos, lead, structural issues upfront

### Competitive Advantage:
- Generic tools treat all buildings the same
- This system understands Victorian != Modern
- Clients trust specialists who "get it"
- Reduces underestimating period property jobs

## Implementation

**Add to AI prompt:** 5 minutes
**Test with period property drawings:** 1 hour
**UI enhancements (optional):** 2-3 hours
**Total:** Can include in initial setup OR £300 add-on
