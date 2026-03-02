import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import { Languages, Globe } from 'lucide-react';

interface LanguageToggleProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, setLanguage }) => {
  return (
    <motion.div 
      className="flex items-center space-x-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Languages 
          size={20} 
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-1 -right-1 bg-emerald-500 dark:bg-emerald-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
        >
          {language === 'english' ? 'EN' : 'हि'}
        </motion.div>
      </motion.div>
      
      <motion.select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 
                  border border-gray-200 dark:border-gray-600 
                  text-gray-800 dark:text-gray-100 
                  py-1 px-3 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                  shadow-sm hover:shadow-md dark:shadow-gray-900/50 
                  transition-all duration-300 appearance-none"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        whileFocus={{ scale: 1.02 }}
      >
        <motion.option 
          value="english" 
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          whileHover={{ backgroundColor: '#f0f9ff' }}
        >
          English
        </motion.option>
        <motion.option 
          value="hindi" 
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          whileHover={{ backgroundColor: '#f0f9ff' }}
        >
          हिंदी
        </motion.option>
      </motion.select>
    </motion.div>
  );
};

export default LanguageToggle;