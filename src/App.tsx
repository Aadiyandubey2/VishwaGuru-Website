import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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
import PalmReadingPage from './pages/PalmReadingPage';
import PanchangPage from './pages/PanchangPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Calculator, Hand, Calendar, Smartphone as SmartphoneIcon, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet';
import PersonalSupport from './components/auth/Personalsupport';

function NumerologyPage({ language }: { language: Language }) {
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
      <Helmet>
        <title>Numerology Calculator - VishwaGuru</title>
        <meta name="description" content="Discover your destiny, life path, and more with our free numerology calculator. Instant, accurate, and personalized readings online." />
        <link rel="canonical" href="https://www.vishwaguru.site/numerology" />
        <meta property="og:title" content="Numerology Calculator - VishwaGuru" />
        <meta property="og:description" content="Discover your destiny, life path, and more with our free numerology calculator. Instant, accurate, and personalized readings online." />
        <meta property="og:url" content="https://www.vishwaguru.site/numerology" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.vishwaguru.site/VishwaGuruLogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Numerology Calculator - VishwaGuru" />
        <meta name="twitter:description" content="Discover your destiny, life path, and more with our free numerology calculator. Instant, accurate, and personalized readings online." />
        <meta name="twitter:image" content="https://www.vishwaguru.site/VishwaGuruLogo.png" />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition w-fit">
          <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' /></svg>
          {language === 'english' ? 'Back to Home' : 'होम पेज पर वापस जाएं'}
        </Link>
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

function Home({ language }: { language: Language }) {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const featureCards = [
    {
      label: { en: 'Numerology', hi: 'अंकशास्त्र' },
      icon: <Calculator size={48} />,
      to: '/numerology',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      label: { en: 'Palm Reading', hi: 'हस्तरेखा' },
      icon: <Hand size={48} />,
      to: '/palm-reading',
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: { en: 'Panchang', hi: 'पंचांग' },
      icon: <Calendar size={48} />,
      to: '/panchang',
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: { 
        en: 'Android App Coming Soon', 
        hi: 'एंड्रॉइड ऐप जल्द आ रहा है' 
      },
      icon: <SmartphoneIcon size={48} />,
      to: 'vishwaguru.site',
      color: 'from-teal-500 to-cyan-500',
      isExternal: true
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8 md:py-12">
      <Helmet>
        <title>VishwaGuru - Numerology & Palmistry Hub</title>
        <meta name="description" content="Explore numerology and palmistry online. Get instant readings, save your results, and discover your spiritual path with VishwaGuru." />
        <link rel="canonical" href="https://www.vishwaguru.site/" />
        <meta property="og:title" content="VishwaGuru - Numerology & Palmistry Hub" />
        <meta property="og:description" content="Explore numerology and palmistry online. Get instant readings, save your results, and discover your spiritual path with VishwaGuru." />
        <meta property="og:url" content="https://www.vishwaguru.site/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.vishwaguru.site/VishwaGuruLogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VishwaGuru - Numerology & Palmistry Hub" />
        <meta name="twitter:description" content="Explore numerology and palmistry online. Get instant readings, save your results, and discover your spiritual path with VishwaGuru." />
        <meta name="twitter:image" content="https://www.vishwaguru.site/VishwaGuruLogo.png" />
      </Helmet>
      <div className="flex flex-col items-center mb-6 md:mb-10 w-full">
        <div className="h-48 md:h-64 lg:h-80 w-auto flex items-center justify-center bg-transparent dark:bg-transparent rounded-lg p-4">
          <img 
            src="/VishwaGuruLogo.png"
            alt="VishwaGuru Logo" 
            className="h-full w-auto object-contain dark:invert transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 text-center text-gray-900 dark:text-white">
          {language === 'english' ? 'Welcome to VishwaGuru' : 'विश्वगुरु में आपका स्वागत है'}
        </h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl mx-auto px-2 sm:px-4">
        {featureCards.map((card, idx) => (
          <Link to={card.to} key={card.to} className="focus:outline-none group">
            <motion.div
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: idx * 0.1,
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1]
              }}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl bg-gradient-to-br ${card.color} text-white font-bold text-sm sm:text-lg lg:text-xl cursor-pointer select-none home-feature-card w-full aspect-square`}
              style={{
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255,255,255,0.18)',
              }}
            >
              <motion.div 
                className="mb-2 sm:mb-3 lg:mb-4 transform scale-75 sm:scale-90 lg:scale-100"
                whileHover={{ scale: 0.85, sm: { scale: 1.0 }, lg: { scale: 1.1 } }}
                transition={{ duration: 0.2 }}
              >
                {card.icon}
              </motion.div>
              <span className="text-center text-sm sm:text-base lg:text-xl px-1">{card.label[language === 'english' ? 'en' : 'hi']}</span>
            </motion.div>
          </Link>
        ))}
        {/* Support Me Card */}
        <motion.button
          whileHover={{ 
            scale: 1.03,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: featureCards.length * 0.1,
            duration: 0.5,
            ease: [0.23, 1, 0.32, 1]
          }}
          className="flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl bg-gradient-to-br from-pink-500 to-yellow-500 text-white font-bold text-sm sm:text-lg lg:text-xl select-none home-feature-card focus:outline-none cursor-pointer w-full aspect-square"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255,255,255,0.18)',
          }}
          onClick={() => setShowSupportModal(true)}
        >
          <motion.div 
            className="mb-4"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 2.5 3 5 3 5s3-2.5 3-5c0-1.657-1.343-3-3-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m6.364 1.636l-1.414 1.414M22 12h-2M17.364 19.364l-1.414-1.414M12 22v-2M6.636 19.364l1.414-1.414M2 12h2M6.636 4.636l1.414 1.414" />
            </svg>
          </motion.div>
          <span className="text-center">{language === 'english' ? 'Support Me' : 'मुझे सपोर्ट करें'}</span>
        </motion.button>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowSupportModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center w-full max-w-md mx-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl focus:outline-none"
              onClick={() => setShowSupportModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <PersonalSupport language={language} />
          </motion.div>
        </motion.div>
      )}
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
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header language={language} onLanguageChange={setLanguage} />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Home language={language} />} />
                <Route path="/numerology" element={<NumerologyPage language={language} />} />
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
                <Route
                  path="/palm-reading"
                  element={<PalmReadingPage language={language} />}
                />
                <Route
                  path="/panchang"
                  element={<PanchangPage language={language} />}
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
