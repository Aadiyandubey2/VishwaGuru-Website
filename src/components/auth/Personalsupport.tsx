import React from 'react';
import { HeartHandshake, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../../types';
import qrCode from './support-qr-code.png';

interface PersonalSupportProps {
  language: Language;
}

const PersonalSupport: React.FC<PersonalSupportProps> = ({ language }) => {
  const handleShare = async () => {
    const shareData = {
      title: language === 'english' ? 'Support Me' : 'मुझे सहयोग दें',
      text: language === 'english' 
        ? 'Your support helps me continue creating and developing. Thank you for your generosity!' 
        : 'आपका समर्थन मुझे रचना और विकास जारी रखने में मदद करता है। आपकी उदारता के लिए धन्यवाद!',
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert(language === 'english' 
          ? 'Link copied to clipboard!' 
          : 'लिंक क्लिपबोर्ड पर कॉपी हो गया है!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <HeartHandshake className="text-indigo-600 dark:text-indigo-400 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {language === 'english' ? 'Support Me' : 'मुझे सहयोग दें'}
          </h2>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {language === 'english' 
            ? 'Your support helps me continue creating and developing.' 
            : 'आपका समर्थन मुझे रचना और विकास जारी रखने में मदद करता है।'}
        </p>
      </div>

      <motion.div 
        className="flex justify-center mb-4"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img 
          src={qrCode} 
          alt="Support QR Code" 
          className="w-48 h-48 rounded-lg shadow-md border-2 border-indigo-200 dark:border-indigo-800"
        />
      </motion.div>

      <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
        {language === 'english' 
          ? 'Scan this QR code to support me directly' 
          : 'मुझे सीधे समर्थन देने के लिए इस QR कोड को स्कैन करें'}
      </p>

      <div className="flex justify-center">
        <motion.button 
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
        >
          <Share2 size={18} />
          <span>
            {language === 'english' ? 'Share' : 'साझा करें'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PersonalSupport;