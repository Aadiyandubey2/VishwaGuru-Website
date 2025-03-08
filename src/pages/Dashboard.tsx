import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';
import { Language } from '../types';
import { destinyInterpretations, lifePathInterpretations, getInterpretation } from '../data/interpretations';

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

interface DashboardProps {
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const [readings, setReadings] = useState<SavedReading[]>([]);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {language === 'english' ? 'Your Saved Readings' : 'आपकी सहेजी गई रीडिंग्स'}
        </h1>

        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            {language === 'english' ? 'Loading...' : 'लोड हो रहा है...'}
          </div>
        ) : readings.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            {language === 'english' 
              ? 'No saved readings yet. Calculate a reading to save it here!'
              : 'अभी तक कोई सहेजी गई रीडिंग नहीं है। यहां सहेजने के लिए एक रीडिंग की गणना करें!'}
          </div>
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
      </div>
    </div>
  );
};

export default Dashboard; 