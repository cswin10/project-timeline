'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { FileText, Clock, Download, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <FileText className="w-8 h-8 text-architectural-blue" />,
      title: 'AI Plan Reading',
      description: 'Advanced vision AI extracts rooms, dimensions, and structural elements from your drawings.',
    },
    {
      icon: <Clock className="w-8 h-8 text-architectural-blue" />,
      title: 'Structured Timeline',
      description: 'Get detailed project phases with realistic min/max durations based on UK building standards.',
    },
    {
      icon: <Download className="w-8 h-8 text-architectural-blue" />,
      title: 'PDF Export',
      description: 'Download professional timeline reports ready to share with clients and contractors.',
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-architectural-blue" />,
      title: 'Risk Analysis',
      description: 'Identify potential risks and dependencies before work begins.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 blueprint-grid opacity-10" />

        {/* Decorative Lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-architectural-blue to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-architectural-blue to-transparent opacity-50" />

        <Container>
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-6 px-4 py-2 bg-blue-50 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-architectural-blue font-semibold text-sm">
                AI-Powered Project Planning
              </span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold text-architectural-charcoal mb-6 leading-tight">
              Upload your drawings.
              <br />
              <span className="text-architectural-blue">Generate a project timeline.</span>
            </h1>

            <p className="text-xl text-architectural-lightGrey mb-10 max-w-2xl mx-auto">
              Transform architectural drawings into detailed, professional project timelines in seconds.
              Powered by advanced AI vision technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload" className="inline-block">
                <Button size="lg">Try It Now</Button>
              </Link>
              <a href="#features" className="inline-block">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-architectural-charcoal mb-4">
              Everything you need for accurate timelines
            </h2>
            <p className="text-lg text-architectural-lightGrey max-w-2xl mx-auto">
              Our AI analyzes your drawings with precision, delivering insights that help you plan better.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-architectural-charcoal mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-architectural-lightGrey">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-architectural-charcoal mb-4">
              Simple process, powerful results
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Upload Drawing', desc: 'Upload PDF, JPG, or PNG files' },
              { step: '2', title: 'AI Analysis', desc: 'Our AI extracts all key information' },
              { step: '3', title: 'Get Timeline', desc: 'Download your professional timeline' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-architectural-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-architectural-charcoal mb-2">
                  {item.title}
                </h3>
                <p className="text-architectural-lightGrey">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-architectural-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-5" />
        <Container>
          <motion.div
            className="text-center max-w-3xl mx-auto relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Upload your first architectural drawing and see the power of AI project planning.
            </p>
            <Link href="/upload">
              <Button size="lg" className="bg-white text-architectural-charcoal hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-200">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-architectural-charcoal mb-4">Project Timeline AI</h3>
              <p className="text-sm text-architectural-lightGrey">
                AI-powered project planning for construction professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-architectural-charcoal mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-architectural-lightGrey">
                <li>Features</li>
                <li>Pricing</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-architectural-charcoal mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-architectural-lightGrey">
                <li>About</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-architectural-charcoal mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-architectural-lightGrey">
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-architectural-lightGrey">
            <p>&copy; 2024 Project Timeline AI. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
