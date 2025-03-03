import React from 'react';
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

  return (
    <header className="bg-white shadow-md border-b border-gray-200 w-full transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <Sparkles className="text-indigo-600 transition-transform duration-300 group-hover:rotate-12" size={24} />
          <h1 className="text-lg sm:text-xl font-bold text-indigo-900 border-b-2 border-indigo-600 pb-1 transition-transform duration-300 group-hover:scale-110">
            {language === 'english' ? 'VishwaGuru' : 'विश्वगुरु'}
          </h1>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm">
          <LanguageToggle language={language} setLanguage={setLanguage} />
          {currentUser ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
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
              
              <button 
                onClick={handleLogout}
                className="flex items-center border px-2 py-1 rounded-md text-gray-700 border-gray-300 hover:text-indigo-600 hover:border-indigo-600 transition-all duration-300 ease-in-out hover:scale-105"
              >
                <LogOut size={14} className="mr-1" />
                <span className="font-medium">
                  {language === 'english' ? 'Logout' : 'लॉग आउट'}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link 
                to="/login" 
                className="border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 px-2 py-1 rounded-md hover:text-indigo-600 hover:border-indigo-600 transition-all duration-300 ease-in-out hover:scale-105"
              >
                {language === 'english' ? 'Login' : 'लॉग इन'}
              </Link>
              <Link 
                to="/signup" 
                className="text-xs sm:text-sm font-medium border border-indigo-600 bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-all duration-300 ease-in-out hover:scale-105 w-auto text-center"
              >
                {language === 'english' ? 'Sign Up' : 'साइन अप'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
