import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Language } from '../../types';
import { useAuth } from '../../utils/AuthContext';
// Define a path that will work in both development and production
const ownerPhotoUrl = '/images/owner-photo.jpg'; // Path within public folder
const fallbackOwnerPhotoUrl = 'https://vishwaguru-x.netlify.app/images/owner-photo.jpg';

interface HeaderProps {
  language: Language;
  // Removed onLanguageChange as it's available through cards on homepage
}

const Header = memo<HeaderProps>(({ language }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const ownerDetails = {
    name: language === 'english' ? 'Aadiyan Dubey' : 'आदियन दुबे',
    title: language === 'english' ? 'Astrologer & Numerology Expert' : 'ज्योतिषी और अंकशास्त्र विशेषज्ञ',
    education: language === 'english' ? 'Computer Science Student, NIT Nagaland' : 'कंप्यूटर विज्ञान छात्र, एनआईटी नागालैंड'
  };

  // Sign out functionality moved to cards on homepage

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 w-full"
    >
      {/* Header content starts below */}
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

        {/* Spacer div - between logo and navbar */}
        <div className="flex-1 mx-2 md:mx-4"></div>

        {/* Hamburger menu for mobile (logo and hamburger only) */}
        <div className="flex md:hidden items-center ml-auto">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center text-indigo-600 dark:text-indigo-400"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* User info (desktop only, single row, no wrap) */}
        <div className="hidden md:flex items-center flex-nowrap gap-x-2 md:gap-x-4 min-w-0">
          {user && (
            <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[160px]">
              {user.email}
            </span>
          )}
          {/* Owner Info */}
          <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={ownerPhotoUrl}
                onError={(e) => {
                  // If the image fails to load, try the fallback URL
                  (e.target as HTMLImageElement).src = fallbackOwnerPhotoUrl;
                }}
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
              {/* Theme toggle removed - moved to home page cards */}
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-300 mt-2 block">
                  {user.email}
                </span>
              )}
              {/* Owner Info in Mobile Menu */}
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={ownerPhotoUrl}
                onError={(e) => {
                  // If the image fails to load, try the fallback URL
                  (e.target as HTMLImageElement).src = fallbackOwnerPhotoUrl;
                }}
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
});

export default Header;

// Add display name for debugging
Header.displayName = 'Header';