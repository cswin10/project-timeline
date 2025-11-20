'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import { Clock, Calendar, AlertTriangle, FileText, Download, Home } from 'lucide-react';
import { ProjectTimeline } from '@/types';
import { supabase } from '@/lib/supabase';
import { exportTimelineToPDF } from '@/lib/pdf-export';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get('jobId');

  const [timeline, setTimeline] = useState<ProjectTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      if (!jobId) {
        setError('No job ID provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (fetchError) throw fetchError;

        if (data && data.timeline_json) {
          setTimeline(data.timeline_json as ProjectTimeline);
        } else {
          setError('No timeline data found');
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [jobId]);

  const handleDownloadPDF = () => {
    if (timeline) {
      exportTimelineToPDF(timeline);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <Container>
          <Card className="max-w-3xl mx-auto">
            <Loading message="Loading your timeline..." />
          </Card>
        </Container>
      </div>
    );
  }

  if (error || !timeline) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <Container>
          <Card className="max-w-3xl mx-auto text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-architectural-charcoal mb-4">
              {error || 'Something went wrong'}
            </h2>
            <p className="text-architectural-lightGrey mb-6">
              We couldn&apos;t load your timeline. Please try uploading your drawing again.
            </p>
            <Button onClick={() => router.push('/upload')}>Upload New Drawing</Button>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <Container maxWidth="2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-architectural-charcoal mb-4">
                  Your Project Timeline
                </h1>
                <p className="text-lg text-architectural-lightGrey">
                  AI-generated timeline based on your architectural drawing
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.push('/')}>
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <Button onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          <Card className="mb-6">
            <div className="flex items-start">
              <FileText className="w-6 h-6 text-architectural-blue mt-1 mr-4" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-architectural-charcoal mb-2">
                  Project Summary
                </h2>
                <p className="text-architectural-lightGrey">{timeline.project_summary}</p>
              </div>
            </div>
          </Card>

          {/* Total Duration */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-white border-l-4 border-architectural-blue">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-architectural-blue mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-architectural-charcoal mb-1">
                    Estimated Project Duration
                  </h3>
                  <p className="text-2xl font-bold text-architectural-blue">
                    {timeline.total_duration_days_min} - {timeline.total_duration_days_max} days
                  </p>
                  <p className="text-sm text-architectural-lightGrey">
                    ({Math.round(timeline.total_duration_days_min / 7)} -{' '}
                    {Math.round(timeline.total_duration_days_max / 7)} weeks)
                  </p>
                </div>
              </div>
              <Clock className="w-16 h-16 text-architectural-blue opacity-20" />
            </div>
          </Card>

          {/* Phases */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-architectural-charcoal mb-6">Project Phases</h2>
            <div className="space-y-4">
              {timeline.phases.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border-l-4 border-architectural-blue">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-architectural-blue text-white rounded-full flex items-center justify-center font-bold mr-3">
                            {index + 1}
                          </div>
                          <h3 className="text-xl font-semibold text-architectural-charcoal">
                            {phase.name}
                          </h3>
                        </div>
                        <p className="text-architectural-lightGrey mb-3 ml-11">
                          {phase.description}
                        </p>
                        <div className="flex items-center ml-11">
                          <Clock className="w-4 h-4 text-architectural-blue mr-2" />
                          <span className="font-semibold text-architectural-charcoal">
                            {phase.duration_days_min} - {phase.duration_days_max} days
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Assumptions & Risk Factors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Assumptions */}
            {timeline.assumptions && timeline.assumptions.length > 0 && (
              <Card>
                <h3 className="text-xl font-semibold text-architectural-charcoal mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-architectural-blue" />
                  Assumptions
                </h3>
                <ul className="space-y-2">
                  {timeline.assumptions.map((assumption, index) => (
                    <li
                      key={index}
                      className="text-architectural-lightGrey text-sm flex items-start"
                    >
                      <span className="text-architectural-blue mr-2">•</span>
                      <span>{assumption}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Risk Factors */}
            {timeline.risk_factors && timeline.risk_factors.length > 0 && (
              <Card className="border-l-4 border-orange-500">
                <h3 className="text-xl font-semibold text-architectural-charcoal mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                  Risk Factors
                </h3>
                <ul className="space-y-2">
                  {timeline.risk_factors.map((risk, index) => (
                    <li key={index} className="text-architectural-lightGrey text-sm flex items-start">
                      <span className="text-orange-500 mr-2">⚠</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Actions */}
          <Card className="bg-architectural-charcoal text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-gray-300 mb-6">
              Download your timeline or upload another drawing to analyze
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleDownloadPDF}
                className="bg-white text-architectural-charcoal hover:bg-gray-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => router.push('/upload')} className="border-white text-white hover:bg-white hover:text-architectural-charcoal">
                Upload Another
              </Button>
            </div>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <Container>
          <Card className="max-w-3xl mx-auto">
            <Loading message="Loading..." />
          </Card>
        </Container>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
