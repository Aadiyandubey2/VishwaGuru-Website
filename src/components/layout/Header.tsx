import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, HeartHandshake, Menu, X } from 'lucide-react';
import LanguageToggle from '../LanguageToggle';
import { Language } from '../../types';
import PersonalSupport from '../auth/Personalsupport';

interface HeaderProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const buttonVariants = {
    initial: { scale: 1, backgroundColor: "#4f46e5" }, 
    hover: { 
      scale: 1.1, 
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      className="bg-white shadow-md border-b border-gray-200 w-full"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {}
        <Link to="/" className="flex items-center space-x-2">
          <Sparkles className="text-indigo-600" size={24} />
          <h1 className="text-lg sm:text-xl font-bold text-indigo-900 border-b-2 border-indigo-600 pb-1">
            {language === 'english' ? 'VishwaGuru' : 'विश्वगुरु'}
          </h1>
        </Link>

        {}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageToggle language={language} setLanguage={setLanguage} />

          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowQRCode(true)}
            className="flex items-center border border-indigo-600 bg-indigo-600 text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-indigo-700"
          >
            <HeartHandshake size={16} className="mr-2" />
            <span className="font-medium">
              {language === 'english' ? 'Support' : 'सहयोग'}
            </span>
          </motion.button>
        </div>

        {}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex items-center text-indigo-600"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-md border-t border-gray-200"
          >
            <div className="flex flex-col items-center py-4 space-y-3">
              <LanguageToggle language={language} setLanguage={setLanguage} />

              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowQRCode(true)}
                className="flex items-center border border-indigo-600 bg-indigo-600 text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-indigo-700 w-3/4"
              >
                <HeartHandshake size={16} className="mr-2" />
                {language === 'english' ? 'Support' : 'सहयोग'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      {showQRCode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg relative max-w-md w-full">
            <button 
              onClick={() => setShowQRCode(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>
            
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-900">
              {language === 'english' ? 'Personal Support QR Code' : 'व्यक्तिगत सहायता क्यूआर कोड'}
            </h2>

            <div className="flex justify-center">
              <PersonalSupport language={language} />
            </div>

            <p className="text-gray-500 text-center mt-3">
              {language === 'english' 
                ? 'Scan the QR code for personalized numerology support.' 
                : 'व्यक्तिगत अंकशास्त्र सहायता के लिए क्यूआर कोड स्कैन करें।'}
            </p>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
