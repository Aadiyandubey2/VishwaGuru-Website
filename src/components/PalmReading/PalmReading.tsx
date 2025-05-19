import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import {
  analyzeLifeLine,
  analyzeHeartLine,
  analyzeHeadLine,
  analyzeFateLine,
  generateDetailedPrediction,
  PalmLanguage,
  detectHandType,
  getHandSideDisplay,
  generateFullLifePrediction
} from './palmReadingUtils';

interface PalmReadingProps {
  onPredictionComplete: (prediction: string) => void;
  language: PalmLanguage;
}

const scanVariants = {
  initial: { y: 0 },
  animate: {
    y: '100%',
    transition: {
      repeat: Infinity,
      repeatType: 'reverse' as const,
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

// Helper to check palm size and centering
function getPalmBoundingBox(landmarks: any[]): { width: number; height: number; centerX: number; centerY: number } {
  const xs = landmarks.map((p: any) => p.x);
  const ys = landmarks.map((p: any) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}

const PalmReading: React.FC<PalmReadingProps> = ({ onPredictionComplete, language }) => {
  const webcamRef = useRef<Webcam>(null);
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [prediction, setPrediction] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showScan, setShowScan] = useState(false);
  const [palmWarning, setPalmWarning] = useState<string>('');
  const [deepAnalysis, setDeepAnalysis] = useState<string>('');
  const [isDeepAnalyzing, setIsDeepAnalyzing] = useState(false);
  const lastLandmarksRef = useRef<any>(null);

  // Bilingual UI text
  const uiText = {
    analysisTitle: language === 'hindi' ? 'हस्तरेखा विश्लेषण' : 'Palm Reading Analysis',
    positionPalm: language === 'hindi' ? 'अपनी हथेली को इस फ्रेम में रखें' : 'Position your palm within this frame',
    capture: language === 'hindi' ? 'हथेली कैप्चर करें और विश्लेषण करें' : 'Capture & Analyze Palm',
    analyzing: language === 'hindi' ? 'विश्लेषण हो रहा है...' : 'Analyzing...',
    loading: language === 'hindi' ? 'मॉडल लोड हो रहा है...' : 'Loading palm reading model...',
    noPalm: language === 'hindi' ? 'कोई हथेली नहीं मिली। कृपया अपनी हथेली को कैमरे में स्पष्ट रूप से रखें।' : 'No palm detected. Please position your palm clearly in the camera view.',
    processError: language === 'hindi' ? 'हथेली की छवि प्रोसेस करने में विफल। कृपया पुनः प्रयास करें।' : 'Failed to process palm image. Please try again.',
    resultTitle: language === 'hindi' ? 'आपका हस्तरेखा विश्लेषण' : 'Your Palm Reading',
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const handposeModel = await handpose.load();
        setModel(handposeModel);
        setIsModelLoading(false);
      } catch (error) {
        console.error('Error loading model:', error);
        setError(uiText.loading);
        setIsModelLoading(false);
      }
    };
    loadModel();
  }, [language]);

  const analyzePalm = async (landmarks: any[]) => {
    // Check palm size and centering
    const { width, height, centerX, centerY } = getPalmBoundingBox(landmarks);
    // Heuristic: width/height should be at least 0.3 (normalized), center should be near 0.5
    if (width < 0.3 || height < 0.3) {
      setPalmWarning(language === 'hindi' ? 'कृपया अपनी हथेली को फ्रेम में बड़ा और स्पष्ट रखें।' : 'Please make sure your palm fills the frame and is clearly visible.');
      setIsCapturing(false);
      setShowScan(false);
      return;
    }
    if (centerX < 0.2 || centerX > 0.8 || centerY < 0.2 || centerY > 0.8) {
      setPalmWarning(language === 'hindi' ? 'कृपया अपनी हथेली को फ्रेम के बीच में रखें।' : 'Please center your palm in the frame.');
      setIsCapturing(false);
      setShowScan(false);
      return;
    }
    setPalmWarning('');
    try {
      const handType = detectHandType(landmarks);
      const predictions = {
        lifeLine: analyzeLifeLine(landmarks, language),
        heartLine: analyzeHeartLine(landmarks, language),
        headLine: analyzeHeadLine(landmarks, language),
        fateLine: analyzeFateLine(landmarks, language),
      };
      const finalPrediction = generateDetailedPrediction(predictions, language, handType, landmarks);
      setPrediction(finalPrediction);
      onPredictionComplete(finalPrediction);
      lastLandmarksRef.current = landmarks;
    } catch (error) {
      console.error('Error analyzing palm:', error);
      setError(language === 'hindi' ? 'हस्तरेखा विश्लेषण में विफल। कृपया पुनः प्रयास करें।' : 'Failed to analyze palm. Please try again.');
    }
  };

  const capturePalm = async () => {
    if (webcamRef.current && model) {
      setIsCapturing(true);
      setShowScan(true);
      setError('');
      setPrediction('');
      setTimeout(async () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          const img = new Image();
          img.src = imageSrc;
          img.onload = async () => {
            try {
              const predictions = await model.estimateHands(img);
              if (predictions.length > 0) {
                await analyzePalm(predictions[0].landmarks);
              } else {
                setError(uiText.noPalm);
              }
            } catch (error) {
              console.error('Error processing image:', error);
              setError(uiText.processError);
            }
            setIsCapturing(false);
            setShowScan(false);
          };
        } else {
          setIsCapturing(false);
          setShowScan(false);
        }
      }, 1800); // Simulate scan duration
    }
  };

  const handleDeepAnalysis = async () => {
    setIsDeepAnalyzing(true);
    setDeepAnalysis('');
    // Simulate long analysis
    setTimeout(async () => {
      // Call the new function (to be implemented) with all available data
      const result = await generateFullLifePrediction(lastLandmarksRef.current, language, prediction);
      setDeepAnalysis(result);
      setIsDeepAnalyzing(false);
    }, 3500); // Simulate 3.5s analysis
  };

  if (isModelLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="mt-4 text-lg font-semibold text-blue-700">{uiText.loading}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
                {uiText.analysisTitle}
              </h2>
              <div className="relative aspect-[4/3] mb-8 flex items-center justify-center" style={{ minHeight: 420 }}>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full rounded-xl border-4 border-indigo-200 dark:border-indigo-700 shadow-lg min-h-[420px] min-w-[560px] bg-gray-100 dark:bg-gray-900"
                  videoConstraints={{
                    facingMode: "user",
                    width: 640,
                    height: 480,
                  }}
                />
                {/* Animated scan line */}
                <AnimatePresence>
                  {showScan && (
                    <motion.div
                      key="scan"
                      initial="initial"
                      animate="animate"
                      exit={{ opacity: 0 }}
                      variants={scanVariants}
                      className="absolute left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-green-400 to-yellow-400 opacity-80 shadow-lg"
                      style={{ top: 0 }}
                    />
                  )}
                </AnimatePresence>
                {/* Palm frame overlay + hand guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="border-4 border-indigo-400 dark:border-indigo-600 rounded-2xl p-6 m-4 bg-white bg-opacity-10 dark:bg-gray-900/30 backdrop-blur-sm flex flex-col items-center"
                  >
                    <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2 opacity-60">
                      <ellipse cx="60" cy="90" rx="45" ry="60" fill="#6366f1" fillOpacity="0.13" />
                      <rect x="30" y="20" width="15" height="60" rx="7" fill="#6366f1" fillOpacity="0.18" />
                      <rect x="50" y="10" width="15" height="70" rx="7" fill="#6366f1" fillOpacity="0.18" />
                      <rect x="70" y="15" width="15" height="65" rx="7" fill="#6366f1" fillOpacity="0.18" />
                      <rect x="90" y="30" width="15" height="50" rx="7" fill="#6366f1" fillOpacity="0.18" />
                    </svg>
                    <p className="text-white text-center bg-indigo-700 bg-opacity-60 p-2 rounded shadow-lg text-lg font-semibold tracking-wide animate-pulse">
                      {uiText.positionPalm}
                    </p>
                  </motion.div>
                </div>
              </div>
              {palmWarning && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 rounded-lg shadow text-center font-semibold border border-yellow-200 dark:border-yellow-700"
                >
                  {palmWarning}
                </motion.div>
              )}
              <div className="flex justify-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={capturePalm}
                  disabled={isCapturing}
                  className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl font-bold text-lg shadow transition-all duration-200 ${
                    isCapturing
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                  style={{ minWidth: 320 }}
                >
                  {/* Transparent SVG hand icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-7 h-7 opacity-50"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V5a2 2 0 1 1 4 0v6m0 0V3.5a2 2 0 1 1 4 0V11m-8 0h8m-8 0v6a4 4 0 0 0 8 0v-6" />
                  </svg>
                  <span>{uiText.capture}</span>
                </motion.button>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-100 rounded-lg shadow border border-red-200 dark:border-red-700 text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {prediction && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-xl border border-green-200 dark:border-green-700"
                  >
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300 text-center"
                    >
                      {uiText.resultTitle}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.7 }}
                      className="whitespace-pre-line text-lg text-gray-800 dark:text-gray-100 text-center"
                    >
                      {prediction}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
              {prediction && !isDeepAnalyzing && !deepAnalysis && (
                <button
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                  onClick={handleDeepAnalysis}
                >
                  {language === 'hindi' ? 'गहन विश्लेषण (अत्यंत सटीक)' : 'Deep Analysis (Very Accurate)'}
                </button>
              )}
              {isDeepAnalyzing && (
                <div className="mt-4 text-lg text-blue-700 dark:text-blue-200 text-center">
                  {language === 'hindi' ? 'गहन विश्लेषण किया जा रहा है...' : 'Performing deep analysis...'}
                </div>
              )}
              {deepAnalysis && (
                <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900 rounded-xl shadow-xl border border-yellow-200 dark:border-yellow-700">
                  <h3 className="text-2xl font-bold mb-4 text-yellow-700 dark:text-yellow-300 text-center">
                    {language === 'hindi' ? 'अत्यंत सटीक जीवन भविष्यवाणी' : 'Most Accurate Life Prediction'}
                  </h3>
                  <pre className="whitespace-pre-line text-lg text-gray-800 dark:text-gray-100 text-center">
                    {deepAnalysis}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PalmReading; 