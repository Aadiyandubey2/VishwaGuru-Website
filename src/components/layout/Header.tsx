import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import LanguageToggle from '../LanguageToggle';
import ThemeToggle from '../ThemeToggle';
import { Language } from '../../types';
import { useAuth } from '../../utils/AuthContext';
import ownerPhoto from '/images/owner-photo.jpg';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const ownerDetails = {
    name: language === 'english' ? 'Aadiyan Dubey' : 'आदियन दुबे',
    title: language === 'english' ? 'Astrologer & Numerology Expert' : 'ज्योतिषी और अंकशास्त्र विशेषज्ञ',
    education: language === 'english' ? 'Computer Science Student, NIT Nagaland' : 'कंप्यूटर विज्ञान छात्र, एनआईटी नागालैंड'
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 w-full"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-nowrap items-center justify-between gap-x-4 overflow-x-auto">
        <Link to="/" className="flex items-center space-x-4 flex-shrink-0">
          <div className="h-16 w-16 flex items-center justify-center bg-transparent dark:bg-transparent">
            <img 
              src="/vishwa.png"
              alt="VishwaGuru Logo" 
              className="w-full h-full object-contain dark:invert"
            />
          </div>
          <div className="flex items-center">
            <h1 className={`text-2xl font-bold relative ${language === 'english' ? '' : 'font-hindi'}`}>
              <span className="bg-gradient-to-r from-orange-500 via-blue-600 to-green-500 bg-clip-text text-transparent animate-gradient-x">
                {language === 'english' ? 'VishwaGuru' : 'विश्वगुरु'}
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 via-blue-600 to-green-500"></div>
            </h1>
          </div>
        </Link>

        {/* Hamburger menu for mobile (logo and hamburger only) */}
        <div className="flex md:hidden items-center ml-auto">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center text-indigo-600 dark:text-indigo-400"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Navigation, toggles, and user info (desktop only, single row, no wrap) */}
        <div className="hidden md:flex items-center flex-nowrap gap-x-2 md:gap-x-4 min-w-0">
          {user && (
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 rounded-md text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 transition whitespace-nowrap"
            >
              <LayoutDashboard size={18} className="mr-2" />
              {language === 'english' ? 'Dashboard' : 'डैशबोर्ड'}
            </Link>
          )}
          <LanguageToggle language={language} setLanguage={onLanguageChange} />
          <ThemeToggle />
          {user ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[160px]">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOut size={16} />
                <span>{language === 'english' ? 'Sign Out' : 'साइन आउट'}</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {language === 'english' ? 'Sign In' : 'साइन इन'}
              </Link>
              <Link
                to="/signup"
                className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
              >
                {language === 'english' ? 'Sign Up' : 'साइन अप'}
              </Link>
            </>
          )}
          {/* Owner Info */}
          <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={ownerPhoto}
                alt={ownerDetails.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm min-w-0">
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{ownerDetails.name}</p>
              <p className="text-gray-500 dark:text-gray-400 truncate">{ownerDetails.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{ownerDetails.education}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu: show nav, toggles, user info, owner info */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-800 shadow-md border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col items-center py-4 space-y-3">
              {user && (
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-2 rounded-md text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 transition whitespace-nowrap"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={18} className="mr-2" />
                  {language === 'english' ? 'Dashboard' : 'डैशबोर्ड'}
                </Link>
              )}
              <div className="flex items-center gap-2">
                <LanguageToggle language={language} setLanguage={onLanguageChange} />
                <ThemeToggle />
              </div>
              {user ? (
                <>
                  <span className="text-sm text-gray-600 dark:text-gray-300 mt-2 block">
                    {user.email}
                  </span>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleSignOut(); }}
                    className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mt-2"
                  >
                    <LogOut size={16} />
                    <span>{language === 'english' ? 'Sign Out' : 'साइन आउट'}</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Link
                    to="/login"
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === 'english' ? 'Sign In' : 'साइन इन'}
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {language === 'english' ? 'Sign Up' : 'साइन अप'}
                  </Link>
                </div>
              )}
              {/* Owner Info in Mobile Menu */}
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={ownerPhoto}
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
// This code defines a responsive header component for a web application using React and Framer Motion.
// It includes a logo, navigation links, language and theme toggles, user authentication options, and owner information.
// The header adapts to different screen sizes, showing a hamburger menu on mobile and a full navigation bar on larger screens. 