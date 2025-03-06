import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LogOut, User, Settings } from 'lucide-react';
import LanguageToggle from '../LanguageToggle';
import { Language } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300 
      }
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        type: "spring", 
        stiffness: 120 
      }}
      className="bg-white shadow-md border-b border-gray-200 w-full overflow-hidden"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {}
        <Link to="/" className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ 
              rotate: [0, 15, -15, 0],
              transition: { duration: 0.5 }
            }}
          >
            <Sparkles 
              className="text-indigo-600 transition-transform duration-300 group-hover:rotate-12" 
              size={24} 
            />
          </motion.div>
          <motion.h1 
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
            className="text-lg sm:text-xl font-bold text-indigo-900 border-b-2 border-indigo-600 pb-1"
          >
            {language === 'english' ? 'VishwaGuru' : 'विश्वगुरु'}
          </motion.h1>
        </Link>

        {}
        <motion.div 
          initial="hidden"
          animate="visible"
          className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm"
        >
          {}
          <motion.div variants={menuItemVariants}>
            <LanguageToggle language={language} setLanguage={setLanguage} />
          </motion.div>

          {}
          {currentUser ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {}
              <motion.div variants={menuItemVariants}>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center border px-2 py-1 rounded-md transition-all duration-300 ease-in-out hover:scale-105 ${
                    location.pathname === '/dashboard' 
                      ? 'text-indigo-600 border-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 border-gray-300 hover:text-indigo-600 hover:border-indigo-600'
                  }`}
                >
                  <User size={14} className="mr-1" />
                  <span className="font-medium">
                    {language === 'english' ? 'Dashboard' : 'डैशबोर्ड'}
                  </span>
                </Link>
              </motion.div>
              
              {}
              <motion.div variants={menuItemVariants}>
                <Link 
                  to="/profile" 
                  className={`flex items-center border px-2 py-1 rounded-md transition-all duration-300 ease-in-out hover:scale-105 ${
                    location.pathname === '/profile' 
                      ? 'text-indigo-600 border-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 border-gray-300 hover:text-indigo-600 hover:border-indigo-600'
                  }`}
                >
                  <Settings size={14} className="mr-1" />
                  <span className="font-medium">
                    {language === 'english' ? 'Settings' : 'सेटिंग्स'}
                  </span>
                </Link>
              </motion.div>
              
              {}
              <motion.div variants={menuItemVariants}>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center border px-2 py-1 rounded-md text-gray-700 border-gray-300 hover:text-indigo-600 hover:border-indigo-600 transition-all duration-300 ease-in-out hover:scale-105"
                >
                  <LogOut size={14} className="mr-1" />
                  <span className="font-medium">
                    {language === 'english' ? 'Logout' : 'लॉग आउट'}
                  </span>
                </motion.button>
              </motion.div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {}
              <motion.div variants={menuItemVariants}>
                <Link 
                  to="/login" 
                  className="border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 px-2 py-1 rounded-md hover:text-indigo-600 hover:border-indigo-600 transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {language === 'english' ? 'Login' : 'लॉग इन'}
                </Link>
              </motion.div>
              
              {}
              <motion.div variants={menuItemVariants}>
                <Link 
                  to="/signup" 
                  className="text-xs sm:text-sm font-medium border border-indigo-600 bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-all duration-300 ease-in-out hover:scale-105 w-auto text-center"
                >
                  {language === 'english' ? 'Sign Up' : 'साइन अप'}
                </Link>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;