import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import { Globe } from 'lucide-react';

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
      >
        <Globe 
          size={18} 
          className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
        />
      </motion.div>
      
      <motion.select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 text-gray-800 py-1 px-3 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                    shadow-sm hover:shadow-md transition-all duration-300 appearance-none"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        whileFocus={{ scale: 1.02 }}
      >
        <motion.option 
          value="english" 
          className="bg-white text-gray-800"
          whileHover={{ backgroundColor: '#f0f9ff' }}
        >
          English
        </motion.option>
        <motion.option 
          value="hindi" 
          className="bg-white text-gray-800"
          whileHover={{ backgroundColor: '#f0f9ff' }}
        >
          हिंदी
        </motion.option>
      </motion.select>
    </motion.div>
  );
};

export default LanguageToggle;