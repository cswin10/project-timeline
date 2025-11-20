'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import { uploadFile, saveJob } from '@/lib/supabase';

const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const STAGES = [
  'Uploading file to cloud storage',
  'Extracting rooms and dimensions',
  'Analysing structural elements',
  'Generating project timeline',
  'Finalizing results',
];

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && ACCEPTED_FILE_TYPES.includes(droppedFile.type)) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a PDF, JPG, or PNG file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a PDF, JPG, or PNG file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setCurrentStage(0);

    try {
      // Stage 1: Upload to Supabase
      const fileUrl = await uploadFile(file);
      setCurrentStage(1);

      // Load custom business rules if available
      let businessRules = undefined;
      if (typeof window !== 'undefined') {
        const customRules = localStorage.getItem('customBusinessRules');
        if (customRules) {
          businessRules = JSON.parse(customRules);
        }
      }

      // Stage 2-4: Call API to analyze
      const response = await fetch('/api/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl, businessRules }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setCurrentStage(4);

      // Stage 5: Save to database
      const job = await saveJob(fileUrl, data.timeline);
      setCurrentStage(5);

      // Redirect to results
      setTimeout(() => {
        router.push(`/results?jobId=${job.id}`);
      }, 500);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-architectural-charcoal mb-4">
              Upload Your Drawing
            </h1>
            <p className="text-lg text-architectural-lightGrey max-w-2xl mx-auto">
              Upload your architectural plans and let our AI generate a detailed project timeline.
            </p>
          </div>

          <Card className="max-w-3xl mx-auto">
            {!isUploading ? (
              <>
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                    isDragging
                      ? 'border-architectural-blue bg-blue-50'
                      : file
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-architectural-blue'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                  />

                  {!file ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Upload className="w-16 h-16 text-architectural-lightGrey mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-architectural-charcoal mb-2">
                        Drop your file here, or click to browse
                      </h3>
                      <p className="text-architectural-lightGrey mb-6">
                        Supported formats: PDF, JPG, PNG
                      </p>
                      <label htmlFor="file-upload" className="inline-block cursor-pointer">
                        <span className="inline-block px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 bg-architectural-blue text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Select File
                        </span>
                      </label>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mr-4" />
                        <div className="text-left">
                          <p className="font-semibold text-architectural-charcoal">{file.name}</p>
                          <p className="text-sm text-architectural-lightGrey">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="w-6 h-6 text-architectural-lightGrey" />
                      </button>
                    </motion.div>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-red-600 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex justify-between items-center">
                  <Button variant="outline" onClick={() => router.push('/')}>
                    Back to Home
                  </Button>
                  <Button onClick={handleUpload} disabled={!file}>
                    Analyze Drawing
                  </Button>
                </div>

                {/* Info Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-architectural-charcoal mb-4">
                    What happens next?
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        title: 'AI Analysis',
                        desc: 'Our AI extracts all structural information',
                      },
                      {
                        title: 'Timeline Generation',
                        desc: 'Project phases calculated with UK standards',
                      },
                      {
                        title: 'Ready to Use',
                        desc: 'Download or share your timeline instantly',
                      },
                    ].map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="w-10 h-10 bg-architectural-blue text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2">
                          {index + 1}
                        </div>
                        <h5 className="font-semibold text-architectural-charcoal text-sm mb-1">
                          {item.title}
                        </h5>
                        <p className="text-xs text-architectural-lightGrey">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Loading
                message="Analyzing your drawing..."
                stages={STAGES}
                currentStage={currentStage}
              />
            )}
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}
