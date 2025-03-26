import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';
import PersonalSupport from './auth/Personalsupport';
import { X } from 'lucide-react';
import NumerologyResultDisplay from './NumerologyResult';
import { NumerologyResult } from '../types';

interface NumerologyFormProps {
  onCalculate: (name: string, birthdate: string) => void;
  language: Language;
}

const NumerologyForm: React.FC<NumerologyFormProps> = ({ onCalculate, language }) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [focusedField, setFocusedField] = useState<'name' | 'date' | null>(null);
  const [result, setResult] = useState<NumerologyResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(name, birthdate);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const inputVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="w-full relative"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div 
          variants={inputVariants}
          className="relative"
        >
          <motion.div
            animate={{
              scale: focusedField === 'name' ? 1.02 : 1,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            className="relative"
          >
            <label 
              htmlFor="name" 
              className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
            >
              <img 
                src="/VishwaGuruLogo.png"
                alt="VishwaGuru Logo" 
                className="w-7 h-7 object-contain dark:invert"
              />
              {language === 'english' ? 'Full Name' : 'पूरा नाम'}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-6 py-3 text-lg border-2 border-indigo-200 dark:border-indigo-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out transform hover:shadow-lg"
              required
              placeholder={language === 'english' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
            />
            <motion.div
              initial={false}
              animate={{
                opacity: focusedField === 'name' ? 1 : 0,
                scale: focusedField === 'name' ? 1 : 0.8,
              }}
              className="absolute -right-2 -top-2"
            >
              <img 
                src="/VishwaGuruLogo.png"
                alt="VishwaGuru Logo" 
                className="w-8 h-8 object-contain dark:invert"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={inputVariants}
          className="relative"
        >
          <motion.div
            animate={{
              scale: focusedField === 'date' ? 1.02 : 1,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            className="relative"
          >
            <label 
              htmlFor="birthdate" 
              className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
            >
              <img 
                src="/VishwaGuruLogo.png"
                alt="VishwaGuru Logo" 
                className="w-7 h-7 object-contain dark:invert"
              />
              {language === 'english' ? 'Date of Birth' : 'जन्म तिथि'}
            </label>
            <input
              type="date"
              id="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              onFocus={() => setFocusedField('date')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-6 py-3 text-lg border-2 border-indigo-200 dark:border-indigo-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out transform hover:shadow-lg"
              required
            />
            <motion.div
              initial={false}
              animate={{
                opacity: focusedField === 'date' ? 1 : 0,
                scale: focusedField === 'date' ? 1 : 0.8,
              }}
              className="absolute -right-2 -top-2"
            >
              <img 
                src="/VishwaGuruLogo.png"
                alt="VishwaGuru Logo" 
                className="w-8 h-8 object-contain dark:invert"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={inputVariants}
          className="flex items-center justify-between pt-4"
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transform transition-all duration-300 ease-in-out shadow-md hover:shadow-xl"
          >
            <span className="flex items-center gap-2">
              <img 
                src="/VishwaGuruLogo.png"
                alt="VishwaGuru Logo" 
                className="w-7 h-7 object-contain invert"
              />
              {language === 'english' ? 'Calculate' : 'गणना करें'}
            </span>
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="button"
            onClick={() => setShowQRCode(true)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-300 underline decoration-2 decoration-indigo-500/30 hover:decoration-indigo-500"
          >
            {language === 'english' ? 'I Need Help' : 'मुझे मदद चाहिए'}
          </motion.button>
        </motion.div>
      </form>

      {result && (
        <div className="mt-8">
          <NumerologyResultDisplay 
            result={result} 
            language={language} 
            name={name}
            birthdate={birthdate}
          />
        </div>
      )}

      <AnimatePresence>
        {showQRCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowQRCode(false);
              }
            }}
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative inline-block w-full max-w-md p-8 overflow-hidden text-left align-middle bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowQRCode(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={24} />
                </motion.button>

                <motion.h2 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100"
                >
                  {language === 'english' ? 'Personal Support QR Code' : 'व्यक्तिगत सहायता क्यूआर कोड'}
                </motion.h2>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4"
                >
                  <PersonalSupport language={language} />
                </motion.div>

                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400"
                >
                  {language === 'english'
                    ? 'Share to help me promote my website'
                    : 'मेरी वेबसाइट को प्रमोट करने में मदद करने के लिए शेयर करें'}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NumerologyForm;
