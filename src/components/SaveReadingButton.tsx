import React from 'react';
import { motion } from 'framer-motion';
import { BookmarkPlus } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';
import { supabase } from '../utils/supabase';
import { NumerologyResult, Language } from '../types';

interface SaveReadingButtonProps {
  result: NumerologyResult;
  name: string;
  birthdate: string;
  language: Language;
}

const SaveReadingButton: React.FC<SaveReadingButtonProps> = ({ result, name, birthdate, language }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const handleSave = async () => {
    if (!user) {
      showNotification('info', language === 'english' 
        ? 'Please sign in to save your reading' 
        : 'अपनी रीडिंग सेव करने के लिए साइन इन करें');
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_readings')
        .insert([
          {
            user_id: user.id,
            name,
            birthdate,
            destiny_number: result.destinyNumber,
            soul_urge_number: result.soulUrgeNumber,
            personality_number: result.personalityNumber,
            life_path_number: result.lifePathNumber,
            birthday_number: result.birthdayNumber,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      showNotification('success', language === 'english' 
        ? 'Reading saved successfully!' 
        : 'रीडिंग सफलतापूर्वक सेव की गई!');
    } catch (error) {
      console.error('Error saving reading:', error);
      showNotification('error', language === 'english' 
        ? 'Failed to save reading. Please try again.' 
        : 'रीडिंग सेव करने में विफल। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSave}
      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
    >
      <BookmarkPlus size={18} />
      <span>
        {language === 'english' ? 'Save Reading' : 'रीडिंग सेव करें'}
      </span>
    </motion.button>
  );
};

export default SaveReadingButton; 