import React from 'react';
import PalmReading from '../components/PalmReading/PalmReading';
import { Language } from '../types';
import { useNotification } from '../utils/NotificationContext';

interface PalmReadingPageProps {
  language: Language;
}

const PalmReadingPage: React.FC<PalmReadingPageProps> = ({ language }) => {
  const { showNotification } = useNotification();

  const handlePredictionComplete = (prediction: string) => {
    showNotification(
      'success',
      language === 'english'
        ? 'Your palm reading has been completed successfully!'
        : 'आपकी हस्तरेखा पढ़ाई सफलतापूर्वक पूरी हो गई है!'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'english' ? 'Palm Reading' : 'हस्तरेखा विश्लेषण'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'english'
              ? 'Discover insights about your life through the ancient art of palm reading. Position your palm clearly in the camera view for accurate analysis.'
              : 'हस्तरेखा के प्राचीन कला के माध्यम से अपने जीवन के बारे में जानकारी प्राप्त करें। सटीक विश्लेषण के लिए अपनी हथेली को कैमरे के दृश्य में स्पष्ट रूप से रखें।'}
          </p>
        </div>
        <PalmReading onPredictionComplete={handlePredictionComplete} language={language} />
      </div>
    </div>
  );
};

export default PalmReadingPage; 