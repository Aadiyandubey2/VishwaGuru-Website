import React, { useState } from 'react';
import { HeartHandshake, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../../types';
import qrCode from './support-qr-code.png';

interface PersonalSupportProps {
  language: Language;
}

const PersonalSupport: React.FC<PersonalSupportProps> = ({ language }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: language === 'english' ? 'Support a Student' : 'एक छात्र की मदद करें',
      text: language === 'english' 
        ? 'I am a student working on this project. Your support will help me continue my studies and development work. Thank you for your kindness!' 
        : 'मैं एक छात्र हूं जो इस प्रोजेक्ट पर काम कर रहा हूं। आपका समर्थन मुझे अपनी पढ़ाई और विकास कार्य जारी रखने में मदद करेगा। आपकी दयालुता के लिए धन्यवाद!',
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
      className="w-full flex flex-col items-center justify-center"
    >
      <div className="text-center mb-2">
        <div className="flex items-center justify-center mb-1">
          <HeartHandshake className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {language === 'english' ? 'Support a Student' : 'एक छात्र की मदद करें'}
          </h2>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
          {language === 'english' 
            ? 'I am a student and cannot help others. Please consider supporting my education and development work.' 
            : 'मैं एक छात्र हूं और दूसरों की मदद नहीं कर सकता। कृपया मेरी शिक्षा और विकास कार्य में सहयोग करने पर विचार करें।'}
        </p>
      </div>

      {/* Small QR code, click to expand */}
      <motion.div 
        className="flex justify-center mb-2 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setShowModal(true)}
      >
        <img 
          src={qrCode} 
          alt="Support QR Code" 
          className="w-20 h-20 rounded-md shadow border border-indigo-200 dark:border-indigo-800 transition-transform duration-200 hover:scale-105"
        />
      </motion.div>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">
        {language === 'english' 
          ? 'Share to help me promote my website and support my education' 
          : 'मेरी वेबसाइट को प्रमोट करने और मेरी शिक्षा का समर्थन करने में मदद करें'}
      </p>
      <motion.button 
        className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShare}
      >
        <Share2 size={16} />
        <span>
          {language === 'english' ? 'Share' : 'साझा करें'}
        </span>
      </motion.button>

      {/* Modal for large QR code */}
      {showModal && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <img 
              src={qrCode} 
              alt="Support QR Code Large" 
              className="w-64 h-64 rounded-lg shadow border-2 border-indigo-300 dark:border-indigo-700 mb-2"
            />
            <p className="text-sm text-gray-700 dark:text-gray-200 text-center mt-2 max-w-xs">
              {language === 'english' 
                ? 'Scan this QR code to support my education and work. Thank you for your kindness!'
                : 'इस क्यूआर कोड को स्कैन करके मेरी शिक्षा और कार्य का समर्थन करें। आपकी दयालुता के लिए धन्यवाद!'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PersonalSupport;