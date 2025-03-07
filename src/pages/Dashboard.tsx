import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { supabase } from '../utils/supabase';
import { Language } from '../types';

interface SavedReading {
  id: number;
  user_id: string;
  name: string;
  birthdate: string;
  destiny_number: number;
  soul_urge_number: number;
  personality_number: number;
  life_path_number: number;
  birthday_number: number;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('english');

  const fetchReadings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_readings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReadings(data || []);
    } catch (error) {
      console.error('Error fetching readings:', error);
      alert(language === 'english' 
        ? 'Failed to load saved readings' 
        : 'सेव की गई रीडिंग्स लोड करने में विफल');
    } finally {
      setLoading(false);
    }
  };

  const deleteReading = async (id: number) => {
    if (!confirm(language === 'english' 
      ? 'Are you sure you want to delete this reading?' 
      : 'क्या आप वाकई इस रीडिंग को डिलीट करना चाहते हैं?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_readings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setReadings(readings.filter(reading => reading.id !== id));
      
      alert(language === 'english' 
        ? 'Reading deleted successfully' 
        : 'रीडिंग सफलतापूर्वक डिलीट की गई');
    } catch (error) {
      console.error('Error deleting reading:', error);
      alert(language === 'english' 
        ? 'Failed to delete reading' 
        : 'रीडिंग डिलीट करने में विफल');
    }
  };

  useEffect(() => {
    fetchReadings();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'english' ? 'Dashboard' : 'डैशबोर्ड'}
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchReadings}
              className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400"
            >
              <RefreshCw size={18} />
              <span>{language === 'english' ? 'Refresh' : 'रीफ्रेश'}</span>
            </motion.button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {language === 'english' ? 'Account Information' : 'खाता जानकारी'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {language === 'english' ? 'Email: ' : 'ईमेल: '}{user?.email}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {language === 'english' ? 'Member since: ' : 'सदस्यता तिथि: '}
              {formatDate(user?.created_at || '')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'english' ? 'Saved Readings' : 'सेव की गई रीडिंग्स'}
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : readings.length > 0 ? (
                <div className="space-y-4">
                  {readings.map((reading) => (
                    <motion.div
                      key={reading.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{reading.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {language === 'english' ? 'Birth Date: ' : 'जन्म तिथि: '}
                            {formatDate(reading.birthdate)}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteReading(reading.id)}
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            {language === 'english' ? 'Destiny: ' : 'भाग्य: '}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reading.destiny_number}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            {language === 'english' ? 'Life Path: ' : 'जीवन पथ: '}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reading.life_path_number}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            {language === 'english' ? 'Soul Urge: ' : 'आत्मा की इच्छा: '}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reading.soul_urge_number}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            {language === 'english' ? 'Personality: ' : 'व्यक्तित्व: '}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reading.personality_number}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            {language === 'english' ? 'Birthday: ' : 'जन्मदिन: '}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reading.birthday_number}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  {language === 'english' 
                    ? 'No saved readings yet. Calculate a reading to save it here!' 
                    : 'अभी तक कोई रीडिंग सेव नहीं की गई है। यहाँ सेव करने के लिए एक रीडिंग की गणना करें!'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 