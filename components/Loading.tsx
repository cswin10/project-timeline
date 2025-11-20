import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
  stages?: string[];
  currentStage?: number;
}

export default function Loading({ message = 'Processing...', stages, currentStage = 0 }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="w-16 h-16 border-4 border-architectural-blue border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.p
        className="mt-4 text-lg text-architectural-grey"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
      {stages && stages.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          {stages.map((stage, index) => (
            <motion.div
              key={index}
              className={`flex items-center mb-3 ${
                index <= currentStage ? 'text-architectural-blue' : 'text-gray-400'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                  index < currentStage
                    ? 'bg-architectural-blue border-architectural-blue'
                    : index === currentStage
                    ? 'border-architectural-blue'
                    : 'border-gray-400'
                }`}
              >
                {index < currentStage && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {index === currentStage && (
                  <motion.div
                    className="w-3 h-3 bg-architectural-blue rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
              <span className="text-sm">{stage}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
