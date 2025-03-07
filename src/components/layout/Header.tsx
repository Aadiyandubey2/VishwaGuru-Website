import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import LanguageToggle from '../LanguageToggle';
import ThemeToggle from '../ThemeToggle';
import { Language } from '../../types';

interface HeaderProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const ownerDetails = {
    name: language === 'english' ? 'Aadiyan Dubey' : 'आदियन दुबे',
    title: language === 'english' ? 'Astrologer & Numerology Expert' : 'ज्योतिषी और अंकशास्त्र विशेषज्ञ',
    education: language === 'english' ? 'Computer Science Student, NIT Nagaland' : 'कंप्यूटर विज्ञान छात्र, एनआईटी नागालैंड'
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 w-full"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Sparkles className="text-indigo-600 dark:text-indigo-400" size={24} />
          <h1 className="text-lg sm:text-xl font-bold text-indigo-900 dark:text-indigo-100 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1 leading-relaxed">
            {language === 'english' ? 'VishwaGuru' : 'विश्वगुरु'}
          </h1>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <LanguageToggle language={language} setLanguage={setLanguage} />
          <ThemeToggle />
          
          {/* Owner Info */}
          <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src="/owner-photo.jpg" 
                alt={ownerDetails.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-gray-100">{ownerDetails.name}</p>
              <p className="text-gray-500 dark:text-gray-400">{ownerDetails.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{ownerDetails.education}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex items-center text-indigo-600 dark:text-indigo-400"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-800 shadow-md border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col items-center py-4 space-y-3">
              <LanguageToggle language={language} setLanguage={setLanguage} />
              <ThemeToggle />
              
              {/* Owner Info in Mobile Menu */}
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src="/owner-photo.jpg" 
                    alt={ownerDetails.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{ownerDetails.name}</p>
                  <p className="text-gray-500 dark:text-gray-400">{ownerDetails.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{ownerDetails.education}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
