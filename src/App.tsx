import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './utils/AuthContext';
import { motion } from 'framer-motion';
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
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import NumerologyForm from './components/NumerologyForm';
import NumerologyResultDisplay from './components/NumerologyResult';

// Lazy-loaded components
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PalmReadingPage = lazy(() => import('./pages/PalmReadingPage'));
const PanchangPage = lazy(() => import('./pages/PanchangPage'));
const PartnerPredictPage = lazy(() => import('./pages/PartnerPredictPage'));
const PersonalSupport = lazy(() => import('./components/auth/Personalsupport'));
import { Calculator, Calendar, Hand, Heart, BarChart2, Shield, Sprout, Smartphone as SmartphoneIcon, Sun, Moon } from 'lucide-react';
import { Helmet } from 'react-helmet';
// PersonalSupport is now lazy-loaded

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const { user } = useAuth();
  
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  // Define card interface to support darkIcon for the theme card
  interface FeatureCard {
    label: { en: string; hi: string };
    icon: React.ReactNode;
    darkIcon?: React.ReactNode;
    to: string;
    color: string;
    isProtected?: boolean;
    hideWhenAuth?: boolean;
    onClick?: () => void;
    isExternal?: boolean;
  }

  const featureCards: FeatureCard[] = [
    {
      label: { en: 'Login', hi: 'लॉगिन' },
      icon: <Shield size={48} className="text-white" />,
      to: '/login',
      color: 'from-[#5E35B1] to-[#D1C4E9]',
      isProtected: false,
      hideWhenAuth: true
    },
    {
      label: { en: 'Sign Up', hi: 'साइन अप' },
      icon: <Sprout size={48} className="text-white" />,
      to: '/signup',
      color: 'from-[#2E7D32] to-[#A5D6A7]',
      isProtected: false,
      hideWhenAuth: true
    },
    {
      label: { en: 'Dashboard', hi: 'डैशबोर्ड' },
      icon: <BarChart2 size={48} className="text-white" />,
      to: '/dashboard',
      color: 'from-[#1A73E8] to-[#B3D1FF]',
      isProtected: true
    },
    {
      label: { 
        en: 'Theme', 
        hi: 'थीम' 
      },
      icon: <Moon size={48} className="text-white dark:hidden block" />,
      darkIcon: <Sun size={48} className="text-white hidden dark:block" />,
      to: '#',
      color: 'from-gray-700 to-gray-500',
      isProtected: false,
      onClick: toggleTheme
    },
    {
      label: { en: 'Switch to Hindi', hi: 'अंग्रेजी में बदलें' },
      icon: (
        <div className="relative flex items-center justify-center">
          <span className="absolute text-2xl font-bold text-white -left-3 -top-3">अ</span>
          <span className="absolute text-2xl font-bold text-white -right-3 -bottom-3">A</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="12" y1="2" x2="12" y2="22"></line>
          </svg>
        </div>
      ),
      to: '#',
      color: 'from-[#FF7043] to-[#FFCCBC]',
      isProtected: false,
      onClick: () => {
        const newLanguage = language === 'english' ? 'hindi' : 'english';
        localStorage.setItem('language', newLanguage);
        window.location.reload();
      }
    },
    {
      label: { en: 'Numerology', hi: 'अंकशास्त्र' },
      icon: <Calculator size={48} className="text-white" />,
      to: '/numerology',
      color: 'from-indigo-600 to-blue-400',
    },
    {
      label: { en: 'Partner Predict', hi: 'साथी की भविष्यवाणी' },
      icon: <Heart size={48} className="text-white" />,
      to: '/partner-predict',
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: { en: 'Panchang', hi: 'पंचांग' },
      icon: <Calendar size={48} className="text-white" />,
      to: '/panchang',
      color: 'from-amber-500 to-rose-500',
    },
    {
      label: { en: 'Palm Reading', hi: 'हस्तरेखा' },
      icon: <Hand size={48} className="text-white" />,
      to: '/palm-reading',
      color: 'from-green-600 to-emerald-400',
    },
    {
      label: { 
        en: 'Android App', 
        hi: 'एंड्रॉइड ऐप' 
      },
      icon: <SmartphoneIcon size={48} className="text-white" />,
      to: 'https://median.co/share/nopdeo#apk',
      color: 'from-teal-600 to-cyan-400',
      isExternal: true
    },
    {
      label: { 
        en: 'Contact Owner', 
        hi: 'मालिक से संपर्क करें' 
      },
      icon: (
        <div className="flex items-center justify-center">
          <img 
            src="/owner-photo.jpg" 
            alt="Owner" 
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
            onError={(e) => {
              // Fallback if image doesn't exist yet
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/48?text=Owner';
            }}
          />
        </div>
      ),
      to: 'https://wa.me/917477257790',
      color: 'from-blue-600 to-indigo-400',
      isProtected: true,
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
        {featureCards.map((card, index) => {
          // Skip protected cards for non-authenticated users
          if (card.isProtected && !user) return null;
          // Skip login/signup cards for authenticated users
          if (card.hideWhenAuth && user) return null;

          // Handle language toggle and other special cards
          if (card.to === '#') {
            return (
              <button
                key={index}
                onClick={card.onClick}
                className="focus:outline-none group"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
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
                    whileHover={{ scale: [0.85, 1.1] }}
                    transition={{ duration: 0.2 }}
                  >
                    {card.icon}
                    {card.darkIcon}
                  </motion.div>
                  <span className="text-center text-sm sm:text-base lg:text-xl px-1">{card.label[language === 'english' ? 'en' : 'hi']}</span>
                </motion.div>
              </button>
            );
          }

          // Regular card with Link
          return (
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
                  delay: index * 0.1,
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
                  whileHover={{ scale: [0.85, 1.1] }}
                  transition={{ duration: 0.2 }}
                >
                  {card.icon}
                  {card.darkIcon}
                </motion.div>
                <span className="text-center text-sm sm:text-base lg:text-xl px-1">{card.label[language === 'english' ? 'en' : 'hi']}</span>
              </motion.div>
            </Link>
          );
        })}
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
            
            </button>
            <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
            <PersonalSupport language={language} />
          </Suspense>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function App() {
  // Modified to use localStorage directly since language changes happen through card on homepage
  const [language, setLanguage] = useState<Language>(() => 
    localStorage.getItem('language') as Language || 'english'
  );

  // Listen for storage events to update language when changed by the Language card
  useEffect(() => {
    const handleStorageChange = () => {
      const currentLanguage = localStorage.getItem('language') as Language || 'english';
      setLanguage(currentLanguage);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Effect for initial theme setup
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header language={language} />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              }>
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
                <Route
                  path="/partner-predict"
                  element={<PartnerPredictPage language={language} />}
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              </Suspense>
            </main>
            <Footer language={language} />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
