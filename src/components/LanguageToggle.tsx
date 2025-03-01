import React from 'react';
import { Language } from '../types';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center space-x-2">
      <Globe size={18} className="text-indigo-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="english">English</option>
        <option value="hindi">हिंदी</option>
      </select>
    </div>
  );
};

export default LanguageToggle;