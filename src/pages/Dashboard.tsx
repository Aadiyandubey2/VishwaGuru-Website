import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';
import { Language } from '../types';
import { destinyInterpretations, lifePathInterpretations, getInterpretation } from '../data/interpretations';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

interface SavedReading {
  id: string;
  name: string;
  birthdate: string;
  destiny_number: number;
  soul_urge_number: number;
  personality_number: number;
  life_path_number: number;
  birthday_number: number;
  created_at: string;
}

interface SavedPalmReading {
  id: string;
  user_id: string;
  prediction: string;
  created_at: string;
}

interface DashboardProps {
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [palmReadings, setPalmReadings] = useState<SavedPalmReading[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [expandedReading, setExpandedReading] = useState<string | null>(null);

  const fetchReadings = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_readings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReadings(data || []);
    } catch (error) {
      console.error('Error fetching readings:', error);
      showNotification('error', language === 'english'
        ? 'Failed to fetch readings'
        : 'रीडिंग्स लाने में विफल');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadLocal = () => {
      const localPalmReadings = localStorage.getItem('localPalmReadings');
      const readings = localPalmReadings ? JSON.parse(localPalmReadings) : [];
      setPalmReadings(readings);
      console.log('Palm readings loaded:', readings);
    };
    window.addEventListener('localPalmReadingsUpdated', loadLocal);
    // Initial load
    loadLocal();
    return () => window.removeEventListener('localPalmReadingsUpdated', loadLocal);
  }, []);

  useEffect(() => {
    if (user) {
      fetchReadings();
    }
  }, [user]);

  const deleteReading = async (id: string) => {
    const confirmDelete = window.confirm(
      language === 'english'
        ? 'Are you sure you want to delete this reading?'
        : 'क्या आप वाकई इस रीडिंग को हटाना चाहते हैं?'
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('saved_readings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReadings(readings.filter(reading => reading.id !== id));
      showNotification('success', language === 'english'
        ? 'Reading deleted successfully'
        : 'रीडिंग सफलतापूर्वक हटा दी गई');
    } catch (error) {
      console.error('Error deleting reading:', error);
      showNotification('error', language === 'english'
        ? 'Failed to delete reading'
        : 'रीडिंग हटाने में विफल');
    }
  };

  const deletePalmReading = async (id: string) => {
    setPalmReadings(palmReadings.filter(reading => reading.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'english' ? 'en-US' : 'hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const toggleReadingExpansion = (id: string) => {
    setExpandedReading(expandedReading === id ? null : id);
  };

  const addLocalPalmReading = (prediction: string) => {
    const newReading = {
      id: Date.now().toString(),
      user_id: 'local',
      prediction,
      created_at: new Date().toISOString(),
    };
    setPalmReadings([newReading, ...palmReadings]);
  };

  return (    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>User Dashboard - VishwaGuru</title>
        <meta name="description" content="Access your saved numerology and palmistry readings, manage your account, and explore your spiritual journey on VishwaGuru." />
        <link rel="canonical" href="https://www.vishwaguru.site/dashboard" />
        <meta property="og:title" content="User Dashboard - VishwaGuru" />
        <meta property="og:description" content="Access your saved numerology and palmistry readings, manage your account, and explore your spiritual journey on VishwaGuru." />
        <meta property="og:url" content="https://www.vishwaguru.site/dashboard" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.vishwaguru.site/VishwaGuruLogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="User Dashboard - VishwaGuru" />
        <meta name="twitter:description" content="Access your saved numerology and palmistry readings, manage your account, and explore your spiritual journey on VishwaGuru." />
        <meta name="twitter:image" content="https://www.vishwaguru.site/VishwaGuruLogo.png" />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition w-fit">
          <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          {language === 'english' ? 'Back to Home' : 'होम पेज पर वापस जाएं'}
        </Link>
        <div className="flex flex-col items-center mb-12">
          <motion.img
            src="/VishwaGuruDashboardLogo.svg"
            alt="VishwaGuru Logo"
            className="w-24 h-24 mb-6 dark:invert"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.h1 
            className="text-4xl font-bold text-gray-900 dark:text-white text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {language === 'english' ? 'Your Spiritual Journey' : 'आपकी आध्यात्मिक यात्रा'}
          </motion.h1>
          <motion.p 
            className="mt-2 text-lg text-gray-600 dark:text-gray-400 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {language === 'english' 
              ? 'Explore your numerological readings and insights'
              : 'अपनी संख्यात्मक पठन और अंतर्दृष्टि का अन्वेषण करें'}
          </motion.p>
        </div>

        {loading ? (
          <motion.div 
            className="text-center text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {language === 'english' ? 'Loading...' : 'लोड हो रहा है...'}
          </motion.div>
        ) : readings.length === 0 ? (
          <motion.div 
            className="text-center p-8 rounded-lg bg-white dark:bg-gray-800 shadow-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/VishwaGuruDashboardLogo.svg"
              alt="Empty state"
              className="w-16 h-16 mx-auto mb-4 opacity-50 dark:invert"
            />
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'english' 
                ? 'No saved readings yet. Calculate a reading to begin your spiritual journey!'
                : 'अभी तक कोई सहेजी गई रीडिंग नहीं है। अपनी आध्यात्मिक यात्रा शुरू करने के लिए एक रीडिंग की गणना करें!'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {readings.map((reading) => {
              const destinyInterp = getInterpretation(reading.destiny_number, destinyInterpretations);
              const lifePathInterp = getInterpretation(reading.life_path_number, lifePathInterpretations);
              const isExpanded = expandedReading === reading.id;

              return (
                <motion.div
                  key={reading.id}
                  layout
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {reading.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === 'english' ? 'Created on: ' : 'बनाया गया: '}
                        {formatDate(reading.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteReading(reading.id)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {language === 'english' ? 'Destiny Number' : 'भाग्य अंक'}: {reading.destiny_number}
                      </p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {language === 'english' ? 'Life Path Number' : 'जीवन पथ अंक'}: {reading.life_path_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {language === 'english' ? 'Soul Urge Number' : 'आत्मा की इच्छा अंक'}: {reading.soul_urge_number}
                      </p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {language === 'english' ? 'Personality Number' : 'व्यक्तित्व अंक'}: {reading.personality_number}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => toggleReadingExpansion(reading.id)}
                    className="w-full text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                  >
                    {isExpanded 
                      ? (language === 'english' ? 'Show Less' : 'कम दिखाएं')
                      : (language === 'english' ? 'View Full Reading' : 'पूरी रीडिंग देखें')}
                  </motion.button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 space-y-4"
                    >
                      <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {language === 'english' 
                            ? `Destiny Number ${reading.destiny_number}`
                            : `भाग्य अंक ${reading.destiny_number}`}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {language === 'english'
                            ? destinyInterp?.englishDescription
                            : destinyInterp?.hindiDescription}
                        </p>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {language === 'english'
                            ? `Life Path Number ${reading.life_path_number}`
                            : `जीवन पथ अंक ${reading.life_path_number}`}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {language === 'english'
                            ? lifePathInterp?.englishDescription
                            : lifePathInterp?.hindiDescription}
                        </p>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {language === 'english'
                            ? `Soul Urge Number ${reading.soul_urge_number}`
                            : `आत्मा की इच्छा अंक ${reading.soul_urge_number}`}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {language === 'english'
                            ? 'Detailed interpretation coming soon'
                            : 'विस्तृत व्याख्या जल्द ही आ रही है'}
                        </p>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {language === 'english'
                            ? `Personality Number ${reading.personality_number}`
                            : `व्यक्तित्व अंक ${reading.personality_number}`}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {language === 'english'
                            ? 'Detailed interpretation coming soon'
                            : 'विस्तृत व्याख्या जल्द ही आ रही है'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Palm Readings Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'english' ? 'Saved Palm Readings' : 'सहेजे गए हस्तरेखा पठन'}
          </h2>
          {palmReadings.length === 0 ? (
            <motion.div 
              className="text-center p-8 rounded-lg bg-white dark:bg-gray-800 shadow-md"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/VishwaGuruDashboardLogo.svg"
                alt="Empty state"
                className="w-16 h-16 mx-auto mb-4 opacity-50 dark:invert"
              />
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'english' 
                  ? 'No saved palm readings yet. Get a palm reading to begin your journey!'
                  : 'अभी तक कोई सहेजी गई हस्तरेखा पठन नहीं है। अपनी यात्रा शुरू करने के लिए एक हस्तरेखा पठन प्राप्त करें!'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {palmReadings.map((reading) => (
                <motion.div
                  key={reading.id}
                  layout
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {language === 'english' ? 'Palm Reading' : 'हस्तरेखा पठन'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === 'english' ? 'Created on: ' : 'बनाया गया: '}
                        {formatDate(reading.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => deletePalmReading(reading.id)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {reading.prediction}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 