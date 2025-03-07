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
      url: 'www.VishwaGuru.site', 
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
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 relative"
    >
      {}
      <motion.div 
        className="absolute top-0 left-0 w-full h-40 bg-indigo-100 rounded-b-xl flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <HeartHandshake className="text-indigo-600 mr-2" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'english' ? 'Support Me' : 'मुझे सहयोग दें'}
        </h2>
      </motion.div>
      
      <motion.div className="mt-16 mb-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <p className="text-gray-600">
          {language === 'english' 
            ? 'Your support helps me continue creating and developing. Thank you for your generosity!' 
            : 'आपका समर्थन मुझे रचना और विकास जारी रखने में मदद करता है। आपकी उदारता के लिए धन्यवाद!'}
        </p>
      </motion.div>

      <motion.div className="flex justify-center mb-6" whileHover={{ scale: 1.05 }}>
        <img 
          src={qrCode} 
          alt="Support QR Code" 
          className="w-64 h-64 rounded-lg shadow-md border-4 border-indigo-300"
        />
      </motion.div>
      
      <motion.div className="text-center text-sm text-gray-700 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {language === 'english' 
          ? 'Scan this QR code to support me directly' 
          : 'मुझे सीधे समर्थन देने के लिए इस QR कोड को स्कैन करें'}
      </motion.div>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <motion.div 
          className="text-center mb-4" 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm font-medium text-gray-900">
            {language === 'english' ? 'Share with others' : 'दूसरों के साथ साझा करें'}
          </p>
        </motion.div>
        <div className="flex justify-center space-x-4">
          <motion.button 
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md" 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
          >
            <Share2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalSupport;