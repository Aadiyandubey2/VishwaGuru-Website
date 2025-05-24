import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Language } from '../../types';
import { useAuth } from '../../utils/AuthContext';
import ownerPhoto from '/images/owner-photo.jpg';

interface HeaderProps {
  language: Language;
  // Removed onLanguageChange as it's available through cards on homepage
}

const Header: React.FC<HeaderProps> = ({ language }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  
  // Owner announcement text management
  const [ownerText, setOwnerText] = useState<string>(() => {
    return localStorage.getItem('ownerAnnouncement') || 
      (language === 'english' ? 'Welcome to VishwaGuru!' : 'विश्वगुरु में आपका स्वागत है!');
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  
  // The owner key - in a real app, this would be securely stored and verified server-side
  // WARNING: This is not secure for production! Use proper authentication in real applications
  const OWNER_KEY = '789'; // Using the owner's phone number as the key
  
  // Update localStorage when text changes
  useEffect(() => {
    localStorage.setItem('ownerAnnouncement', ownerText);
  }, [ownerText]);
  
  // Handle key verification
  const handleKeyVerification = () => {
    if (keyInput === OWNER_KEY) {
      setShowKeyPrompt(false);
      setIsEditing(true);
      setEditText(ownerText);
    } else {
      alert(language === 'english' ? 'Incorrect key!' : 'गलत कुंजी!');
    }
    setKeyInput('');
  };
  
  // Start the editing process
  const startEditing = () => {
    setShowKeyPrompt(true);
  };
  
  // Save the edited text
  const saveText = () => {
    setOwnerText(editText);
    setIsEditing(false);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setShowKeyPrompt(false);
  };

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
      {/* Key Verification Modal */}
      {showKeyPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              {language === 'english' ? 'Owner Verification' : 'मालिक सत्यापन'}
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {language === 'english' 
                ? 'Please enter the owner key to edit the announcement:' 
                : 'घोषणा संपादित करने के लिए कृपया मालिक कुंजी दर्ज करें:'}
            </p>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4 text-gray-800"
              placeholder={language === 'english' ? 'Enter owner key' : 'मालिक कुंजी दर्ज करें'}
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setShowKeyPrompt(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-800"
              >
                {language === 'english' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button 
                onClick={handleKeyVerification}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                {language === 'english' ? 'Verify' : 'सत्यापित करें'}
              </button>
            </div>
          </div>
        </div>
      )}
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

        {/* Owner Announcement Text - between logo and navbar, visible on all devices */}
        <div className="flex-1 mx-2 md:mx-4 items-center flex">
          {isEditing ? (
            <div className="flex-1 flex items-center space-x-2 max-w-md overflow-x-auto">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 px-2 py-1 text-gray-800 dark:text-white bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 min-w-0"
                placeholder={language === 'english' ? 'Enter announcement text...' : 'घोषणा पाठ दर्ज करें...'}
              />
              <button 
                onClick={saveText}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex-shrink-0"
              >
                {language === 'english' ? 'Save' : 'सहेजें'}
              </button>
              <button 
                onClick={cancelEditing}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex-shrink-0"
              >
                {language === 'english' ? 'Cancel' : 'रद्द करें'}
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center min-w-0">
              <span 
                className="text-gray-700 dark:text-gray-300 text-lg md:text-2xl truncate w-full text-center font-medium"
                onClick={startEditing}
              >
                {ownerText}
              </span>
            </div>
          )}
        </div>

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