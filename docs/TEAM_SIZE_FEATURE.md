# Team Size Adjustment Feature

## Overview
Allow users to see how timeline changes based on team size - helps with resource planning and pricing different service levels.

## Implementation Options

### Option 1: Multiple Scenario Output (Recommended)
Show all scenarios at once:

```
ESTIMATED PROJECT DURATION

With 1 Crew (Standard):
├─ Total: 28-32 days
├─ Demolition: 4-5 days
├─ First Fix: 5-7 days
└─ ... (all phases sequential)

With 2 Crews (Fast Track):
├─ Total: 18-22 days (36% faster)
├─ Demolition: 2-3 days (parallel work)
├─ First Fix: 3-4 days (parallel work)
└─ ... (overlapping phases)

With 3+ Crews (Premium):
├─ Total: 15-18 days (46% faster)
├─ Multiple phases simultaneously
└─ Optimal for large projects

Premium: £___ extra
Fast Track: £___ extra
```

### Option 2: Interactive Slider
User adjusts team size, timeline recalculates live:

```javascript
// In Results page
const [teamSize, setTeamSize] = useState(1);
const adjustedTimeline = calculateWithTeamSize(timeline, teamSize);

// UI
<div>
  <label>Team Size: {teamSize} crew(s)</label>
  <input
    type="range"
    min="1"
    max="3"
    value={teamSize}
    onChange={(e) => setTeamSize(e.target.value)}
  />

  <Timeline data={adjustedTimeline} />
</div>
```

### Option 3: AI Generates All Scenarios
Modify the AI prompt to output multiple scenarios:

```typescript
// Enhanced prompt
"Generate timeline estimates for THREE scenarios:
1. Single crew (sequential work)
2. Two crews (some parallel work possible)
3. Three crews (maximum parallelization)

For each scenario, calculate:
- Which phases can overlap
- Realistic time savings
- Crew coordination overhead (+5-10%)

Return JSON with scenarios array."
```

## Business Rules Enhancement

```typescript
export const SILVERFERN_RULES = {
  phase_defaults: { /* ... */ },

  team_configurations: {
    single_crew: {
      multiplier: 1.0,
      parallel_phases: [],
      description: "Standard service - sequential work"
    },
    two_crews: {
      multiplier: 0.65, // 35% time reduction
      parallel_phases: [
        ["demolition", "planning"],
        ["first_fix_electric", "first_fix_plumbing"],
        ["plastering_room1", "plastering_room2"]
      ],
      description: "Fast-track service - overlapping phases"
    },
    three_crews: {
      multiplier: 0.55, // 45% time reduction
      parallel_phases: [
        ["demolition", "planning", "materials"],
        ["first_fix_electric", "first_fix_plumbing", "first_fix_gas"],
        ["second_fix_room1", "second_fix_room2", "second_fix_room3"]
      ],
      description: "Premium service - maximum parallelization",
      coordination_overhead: 0.10 // +10% for crew coordination
    }
  },

  mapping_logic: `
  TEAM SIZE SCALING:
  - 1 crew: All phases sequential, no overlap
  - 2 crews: Can overlap compatible phases (demolition + prep, first fix electric + plumbing)
  - 3+ crews: Maximum parallelization, but add 10% coordination overhead

  EFFICIENCY FACTORS:
  - Small projects (<50m²): 2+ crews inefficient (too cramped)
  - Medium projects (50-90m²): 2 crews optimal
  - Large projects (90-150m²): 3 crews optimal
  - Very large (>150m²): 3+ crews with staged approach
  `
};
```

## Client-Facing UI

```tsx
// In Results Page
<Card className="mb-6 bg-blue-50 border-l-4 border-blue-500">
  <h3 className="text-xl font-semibold mb-4">
    Service Options - Choose Your Timeline
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <ServiceOption
      title="Standard"
      duration="28-32 days"
      teamSize={1}
      price="Base Price"
      features={[
        "Single crew",
        "Sequential work",
        "Most economical"
      ]}
      selected={selectedService === 'standard'}
      onClick={() => setSelectedService('standard')}
    />

    <ServiceOption
      title="Fast-Track"
      duration="18-22 days"
      teamSize={2}
      price="+15%"
      features={[
        "Two crews",
        "Overlapping phases",
        "36% faster"
      ]}
      selected={selectedService === 'fast'}
      onClick={() => setSelectedService('fast')}
      badge="Popular"
    />

    <ServiceOption
      title="Premium"
      duration="15-18 days"
      teamSize={3}
      price="+30%"
      features={[
        "Three crews",
        "Maximum speed",
        "46% faster"
      ]}
      selected={selectedService === 'premium'}
      onClick={() => setSelectedService('premium')}
    />
  </div>
</Card>
```

## Value for Silverfern

**Upselling Opportunity:**
- Base service: £X (standard timeline)
- Fast-track: £X + 15% (shorter timeline)
- Premium: £X + 30% (fastest timeline)

**Customer Choice:**
- Budget-conscious: Choose standard
- Time-sensitive: Pay premium for speed
- Wedding/event deadline: Premium service

**Resource Planning:**
- See impact of adding crews
- Price accordingly
- Optimize scheduling

## Implementation Cost

**Time:** 1-2 days development
**Cost:** Can include in initial setup OR £500 add-on feature
**Value:** Enables tiered pricing = higher revenue per project
