import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, User } from 'lucide-react';
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Sparkles className="text-indigo-600 mr-2" size={28} />
            <h1 className="text-2xl font-bold text-indigo-900">
              {language === 'english' ? 'VishwaGuru' : 'विश्वगुरु'}
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            <LanguageToggle language={language} setLanguage={setLanguage} />
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-indigo-600">
                  <User size={18} className="mr-1" />
                  <span className="text-sm font-medium">
                    {currentUser.displayName || (language === 'english' ? 'Profile' : 'प्रोफाइल')}
                  </span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <LogOut size={18} className="mr-1" />
                  <span className="text-sm font-medium">
                    {language === 'english' ? 'Logout' : 'लॉग आउट'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  {language === 'english' ? 'Login' : 'लॉग इन'}
                </Link>
                <Link 
                  to="/signup" 
                  className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  {language === 'english' ? 'Sign Up' : 'साइन अप'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;