import React from 'react';
import PalmReading from '../components/PalmReading/PalmReading';
import { Language } from '../types';
import { useNotification } from '../utils/NotificationContext';
import Dashboard from './Dashboard';
import { Helmet } from 'react-helmet';

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

  const addLocalPalmReading = (prediction: string) => {
    const localPalmReadings = JSON.parse(localStorage.getItem('localPalmReadings') || '[]');
    const newReading = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: 'local',
      prediction,
      created_at: new Date().toISOString(),
    };
    localPalmReadings.unshift(newReading);
    localStorage.setItem('localPalmReadings', JSON.stringify(localPalmReadings));
    window.dispatchEvent(new Event('localPalmReadingsUpdated'));
    console.log('localPalmReadingsUpdated event dispatched');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <Helmet>
        <title>Palm Reading (Palmistry) Online - VishwaGuru</title>
        <meta name="description" content="Discover insights about your life through the ancient art of palm reading. Get instant palmistry predictions online with VishwaGuru." />
        <link rel="canonical" href="https://www.vishwaguru.site/palm-reading" />
        <meta property="og:title" content="Palm Reading (Palmistry) Online - VishwaGuru" />
        <meta property="og:description" content="Discover insights about your life through the ancient art of palm reading. Get instant palmistry predictions online with VishwaGuru." />
        <meta property="og:url" content="https://www.vishwaguru.site/palm-reading" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.vishwaguru.site/VishwaGuruLogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Palm Reading (Palmistry) Online - VishwaGuru" />
        <meta name="twitter:description" content="Discover insights about your life through the ancient art of palm reading. Get instant palmistry predictions online with VishwaGuru." />
        <meta name="twitter:image" content="https://www.vishwaguru.site/VishwaGuruLogo.png" />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="h-64 md:h-80 lg:h-96 w-auto flex items-center justify-center bg-transparent dark:bg-transparent rounded-lg p-4">
            <img 
              src="/VishwaGuruLogo.png"
              alt="VishwaGuru Logo" 
              className="h-full w-auto object-contain dark:invert transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
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
        <PalmReading onPredictionComplete={handlePredictionComplete} language={language} addLocalPalmReading={addLocalPalmReading} />
      </div>
    </div>
  );
};

export default PalmReadingPage; 