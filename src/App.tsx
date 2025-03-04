import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Sparkles } from 'lucide-react';
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
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import ProfileSettings from './components/profile/ProfileSettings';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  const [language, setLanguage] = useState<Language>('english');
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCalculate = (name: string, birthdate: string) => {
    const numerologyResult: NumerologyResult = {
      destinyNumber: calculateDestinyNumber(name),
      soulUrgeNumber: calculateSoulUrgeNumber(name),
      personalityNumber: calculatePersonalityNumber(name),
      lifePathNumber: calculateLifePathNumber(birthdate),
      birthdayNumber: calculateBirthdayNumber(birthdate)
    };
    
    setResult(numerologyResult);
  };

  const numberTypes = language === 'english' 
    ? ['Destiny Number', 'Life Path Number', 'Soul Urge Number', 'Personality Number']
    : ['भाग्य अंक', 'जीवन पथ अंक', 'आत्मा की इच्छा अंक', 'व्यक्तित्व अंक'];

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen relative overflow-hidden">
          {}
          <div className="relative z-10">
            <Header language={language} setLanguage={setLanguage} />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={
                  <div className="container mx-auto px-4 py-12">
                    {}
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                      className="text-center mb-12"
                    >
                      <div className="flex items-center justify-center mb-4">
                        <Sparkles className="text-indigo-600 mr-2" size={32} />
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-800 tracking-tight break-words">
                          {language === 'english' ? 'VishwaGuru' : 'विश्वगुरु'}
                        </h1>
                      </div>

                      <p className="text-gray-600 max-w-2xl mx-auto text-xl">
                        {language === 'english' 
                          ? 'Discover the hidden meanings in your name and birthdate through the ancient science of numerology.'
                          : 'अंकशास्त्र के प्राचीन विज्ञान के माध्यम से अपने नाम और जन्मतिथि में छिपे अर्थों की खोज करें।'}
                      </p>
                    </motion.div>

                    {/* Rest of the home page content */}
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="md:flex">
                          <div className="md:w-1/3 bg-indigo-600 text-white p-8">
                            <AnimatePresence>
                              {isVisible && (
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.6 }}
                                >
                                  <h2 className="text-xl font-semibold mb-4">
                                    {language === 'english' ? 'Calculate Your Numbers' : 'अपने अंक की गणना करें'}
                                  </h2>
                                  
                                  <p className="mb-6 text-indigo-100">
                                    {language === 'english' 
                                      ? 'Enter your full name and date of birth to discover your numerology profile.'
                                      : 'अपना पूरा नाम और जन्म तिथि दर्ज करें ताकि आप अपना अंकशास्त्र प्रोफ़ाइल जान सकें।'}
                                  </p>
                                  
                                  <div className="hidden md:block">
                                    <h3 className="text-lg font-medium mb-3">
                                      {language === 'english' ? 'What You\'ll Discover:' : 'आप क्या जानेंगे:'}
                                    </h3>
                                    <ul className="space-y-2 text-indigo-100">
                                      {numberTypes.map((type) => (
                                        <li key={type} className="flex items-start">
                                          <span className="mr-2">•</span>
                                          {type}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          
                          <div className="md:w-2/3 p-8">
                            <NumerologyForm onCalculate={handleCalculate} language={language} />
                          </div>
                        </div>
                      </div>

                      {}
                      {result && (
                        <div className="mt-12">
                          <NumerologyResultDisplay result={result} language={language} />
                        </div>
                      )}
                    </div>
                  </div>
                } />
                
                <Route path="/login" element={<Login language={language} />} />
                <Route path="/signup" element={<Signup language={language} />} />
                
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard language={language} />
                  </PrivateRoute>
                } />
                
                <Route path="/profile" element={
                  <PrivateRoute>
                    <ProfileSettings language={language} />
                  </PrivateRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            
            <Footer language={language} />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;