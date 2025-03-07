import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import PersonalSupport from './auth/Personalsupport';

interface NumerologyFormProps {
  onCalculate: (name: string, birthdate: string) => void;
  language: Language;
}

const NumerologyForm: React.FC<NumerologyFormProps> = ({ onCalculate, language }) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(name, birthdate);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {language === 'english' ? 'Full Name' : 'पूरा नाम'}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
            placeholder={language === 'english' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
          />
        </div>

        <div>
          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {language === 'english' ? 'Date of Birth' : 'जन्म तिथि'}
          </label>
          <input
            type="date"
            id="birthdate"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            {language === 'english' ? 'Calculate' : 'गणना करें'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowQRCode(true)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            {language === 'english' ? 'Need Help?' : 'सहायता चाहिए?'}
          </motion.button>
        </div>
      </form>

      {showQRCode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg relative max-w-md w-full">
            <button 
              onClick={() => setShowQRCode(false)}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ✖
            </button>
            
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
              {language === 'english' ? 'Personal Support QR Code' : 'व्यक्तिगत सहायता क्यूआर कोड'}
            </h2>

            <div className="flex justify-center">
              <PersonalSupport language={language} />
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-center mt-3">
              {language === 'english' 
                ? 'Scan the QR code for personalized numerology support.' 
                : 'व्यक्तिगत अंकशास्त्र सहायता के लिए क्यूआर कोड स्कैन करें।'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NumerologyForm;
