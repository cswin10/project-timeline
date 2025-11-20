'use client';

import { useState } from 'react';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function AdminSettingsPage() {
  const [rules, setRules] = useState({
    demolition: { min: 2, max: 5 },
    first_fix: { min: 3, max: 7 },
    second_fix: { min: 4, max: 8 },
    plastering: { min: 2, max: 5 },
    flooring: { min: 1, max: 3 },
    painting: { min: 2, max: 4 },
    final_checks: { min: 1, max: 2 },
  });

  const [teamSize, setTeamSize] = useState(1);
  const [terminology, setTerminology] = useState('UK');

  const handleSave = async () => {
    // Save to database or localStorage
    const businessRules = {
      phase_defaults: Object.entries(rules).reduce((acc, [key, val]) => {
        acc[key] = [val.min, val.max];
        return acc;
      }, {} as any),
      mapping_logic: `Company has ${teamSize} crew(s). Adjust durations accordingly.`,
      terminology: `Use ${terminology} building terms.`,
    };

    localStorage.setItem('customBusinessRules', JSON.stringify(businessRules));
    alert('Settings saved!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <Container maxWidth="lg">
        <h1 className="text-4xl font-bold text-architectural-charcoal mb-8">
          Company Timeline Settings
        </h1>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Phase Duration Ranges (Days)</h2>
          <p className="text-architectural-lightGrey mb-6">
            Set typical min/max durations based on your company's work rate
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(rules).map(([phase, values]) => (
              <div key={phase} className="border-b pb-4">
                <label className="block text-sm font-semibold text-architectural-charcoal mb-2 capitalize">
                  {phase.replace('_', ' ')}
                </label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-xs text-architectural-lightGrey mb-1">Min Days</label>
                    <input
                      type="number"
                      value={values.min}
                      onChange={(e) =>
                        setRules({
                          ...rules,
                          [phase]: { ...values, min: parseInt(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-architectural-blue focus:outline-none"
                      min="1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-architectural-lightGrey mb-1">Max Days</label>
                    <input
                      type="number"
                      value={values.max}
                      onChange={(e) =>
                        setRules({
                          ...rules,
                          [phase]: { ...values, max: parseInt(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-architectural-blue focus:outline-none"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Company Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-architectural-charcoal mb-2">
              Number of Crews/Teams
            </label>
            <input
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value))}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-architectural-blue focus:outline-none"
              min="1"
            />
            <p className="text-xs text-architectural-lightGrey mt-1">
              AI will consider parallel work capability
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-architectural-charcoal mb-2">
              Terminology
            </label>
            <select
              value={terminology}
              onChange={(e) => setTerminology(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-architectural-blue focus:outline-none"
            >
              <option value="UK">UK Building Terms</option>
              <option value="US">US Building Terms</option>
              <option value="AU">Australian Building Terms</option>
            </select>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSave}>Save Settings</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset to Defaults
          </Button>
        </div>
      </Container>
    </div>
  );
}
