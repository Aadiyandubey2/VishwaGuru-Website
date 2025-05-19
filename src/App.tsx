import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NumerologyForm from './components/NumerologyForm';
import NumerologyResultDisplay from './components/NumerologyResult';
import { Language, NumerologyResult } from './types';
import {
  calculateDestinyNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateLifePathNumber,
  calculateBirthdayNumber
} from './utils/numerologyCalculator';
import { AuthProvider } from './utils/AuthContext';
import { NotificationProvider } from './utils/NotificationContext';
import { useNotification } from './utils/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function Home({ language }: { language: Language }) {
  const { showNotification } = useNotification();
  const [name, setName] = useState(() => localStorage.getItem('userName') || '');
  const [birthdate, setBirthdate] = useState(() => localStorage.getItem('userBirthdate') || '');
  const [result, setResult] = useState<NumerologyResult | null>(() => {
    const savedResult = localStorage.getItem('numerologyResult');
    return savedResult ? JSON.parse(savedResult) : null;
  });

  useEffect(() => {
    if (name) localStorage.setItem('userName', name);
    if (birthdate) localStorage.setItem('userBirthdate', birthdate);
    if (result) localStorage.setItem('numerologyResult', JSON.stringify(result));
  }, [name, birthdate, result]);

  const handleCalculate = async (name: string, birthdate: string) => {
    try {
      setName(name);
      setBirthdate(birthdate);
      const numerologyResult: NumerologyResult = {
        destinyNumber: calculateDestinyNumber(name),
        soulUrgeNumber: calculateSoulUrgeNumber(name),
        personalityNumber: calculatePersonalityNumber(name),
        lifePathNumber: calculateLifePathNumber(birthdate),
        birthdayNumber: calculateBirthdayNumber(birthdate)
      };
      setResult(numerologyResult);
      showNotification('success', language === 'english'
        ? 'Your numerology reading has been calculated successfully!'
        : 'आपकी अंकशास्त्र रीडिंग सफलतापूर्वक की गई है!');
    } catch (error) {
      console.error('Calculation error:', error);
      showNotification('error', language === 'english'
        ? 'Failed to calculate reading. Please try again.'
        : 'रीडिंग की गणना में विफल। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="h-64 md:h-80 lg:h-96 w-auto flex items-center justify-center bg-transparent dark:bg-transparent rounded-lg p-4">
              <img 
                src="/VishwaGuruLogo.png"
                alt="VishwaGuru Logo" 
                className="h-full w-auto object-contain dark:invert transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-xl md:text-2xl mt-8">
            {language === 'english' 
              ? 'Discover the hidden meanings in your name and birthdate through the ancient science of numerology.'
              : 'अंकशास्त्र के प्राचीन विज्ञान के माध्यम से अपने नाम और जन्मतिथि में छिपे अर्थों की खोज करें।'}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-indigo-600 dark:bg-indigo-700 text-white p-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'english' ? 'Calculate Your Numbers' : 'अपने अंक की गणना करें'}
                  </h2>
                  <p className="mb-6 text-indigo-100 dark:text-indigo-200">
                    {language === 'english'
                      ? 'Enter your full name and date of birth to discover your numerology profile.'
                      : 'अपना पूरा नाम और जन्म तिथि दर्ज करें ताकि आप अपना अंकशास्त्र प्रोफ़ाइल जान सकें।'}
                  </p>
                </motion.div>
              </div>

              <div className="md:w-2/3 p-8">
                <NumerologyForm onCalculate={handleCalculate} language={language} />
              </div>
            </div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <NumerologyResultDisplay
                result={result}
                language={language}
                name={name}
                birthdate={birthdate}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>(() => 
    localStorage.getItem('language') as Language || 'english'
  );

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="flex flex-col min-h-screen">
            <Header language={language} onLanguageChange={setLanguage} />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home language={language} />} />
                <Route path="/login" element={<Login language={language} />} />
                <Route path="/signup" element={<Signup language={language} />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard language={language} />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer language={language} />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
