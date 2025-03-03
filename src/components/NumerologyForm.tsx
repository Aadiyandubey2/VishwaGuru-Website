import React, { useState } from 'react';
import { Language } from '../types';
import { useAuth } from '../context/AuthContext';
import { numerologyService } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface NumerologyFormProps {
  onCalculate: (name: string, birthdate: string) => void;
  language: Language;
}

const NumerologyForm: React.FC<NumerologyFormProps> = ({ onCalculate, language }) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [errors, setErrors] = useState({ name: '', birthdate: '' });
  const [saveToProfile, setSaveToProfile] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors = { name: '', birthdate: '' };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = language === 'english' ? 'Name is required' : 'नाम आवश्यक है';
      isValid = false;
    }

    if (!birthdate) {
      newErrors.birthdate = language === 'english' ? 'Birthdate is required' : 'जन्मतिथि आवश्यक है';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Calculate numerology
      onCalculate(name, birthdate);
      
      // Save to profile if user is logged in and option is selected
      if (currentUser && saveToProfile) {
        try {
          await numerologyService.saveReading(name, birthdate);
        } catch (error) {
          console.error('Error saving reading:', error);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'english' ? 'Full Name' : 'पूरा नाम'}
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={language === 'english' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
          {language === 'english' ? 'Date of Birth' : 'जन्म तिथि'}
        </label>
        <input
          type="date"
          id="birthdate"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.birthdate && <p className="mt-1 text-sm text-red-600">{errors.birthdate}</p>}
      </div>

      {currentUser && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveToProfile"
            checked={saveToProfile}
            onChange={(e) => setSaveToProfile(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="saveToProfile" className="ml-2 block text-sm text-gray-700">
            {language === 'english' ? 'Save this reading to my profile' : 'इस पठन को मेरी प्रोफ़ाइल में सहेजें'}
          </label>
        </div>
      )}

      {!currentUser && (
        <div className="text-sm text-gray-600 italic">
          <p>
            {language === 'english' 
              ? 'Sign in to save your readings to your profile.' 
              : 'अपने पठन को अपनी प्रोफ़ाइल में सहेजने के लिए साइन इन करें।'}
            {' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {language === 'english' ? 'Sign in' : 'साइन इन करें'}
            </button>
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {language === 'english' ? 'Calculate Numerology' : 'अंकशास्त्र की गणना करें'}
      </button>
    </form>
  );
};

export default NumerologyForm;