import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 font-sans flex flex-col">
          <Header language={language} setLanguage={setLanguage} />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={
                <div className="container mx-auto px-4 py-12">
                  <header className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                      <Sparkles className="text-indigo-600 mr-2" size={32} />
                      <h1 className="text-3xl font-bold text-indigo-900">
                        {language === 'english' ? 'VishwaGuru' : 'विश्वगुरु'}
                      </h1>
                    </div>
                    
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      {language === 'english' 
                        ? 'Discover the hidden meanings in your name and birthdate through the ancient science of numerology.'
                        : 'अंकशास्त्र के प्राचीन विज्ञान के माध्यम से अपने नाम और जन्मतिथि में छिपे अर्थों की खोज करें।'}
                    </p>
                  </header>

                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3 bg-indigo-600 text-white p-8">
                          <div className="flex items-center mb-6">
                            <Calculator className="mr-2" size={24} />
                            <h2 className="text-xl font-semibold">
                              {language === 'english' ? 'Calculate Your Numbers' : 'अपने अंक की गणना करें'}
                            </h2>
                          </div>
                          
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
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                {language === 'english' ? 'Destiny Number' : 'भाग्य अंक'}
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                {language === 'english' ? 'Life Path Number' : 'जीवन पथ अंक'}
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                {language === 'english' ? 'Soul Urge Number' : 'आत्मा की इच्छा अंक'}
                              </li>
                              <li className="flex items-start">
                                <span className="mr-2">•</span>
                                {language === 'english' ? 'Personality Number' : 'व्यक्तित्व अंक'}
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3 p-8">
                          <NumerologyForm onCalculate={handleCalculate} language={language} />
                        </div>
                      </div>
                    </div>

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
      </Router>
    </AuthProvider>
  );
}

export default App;