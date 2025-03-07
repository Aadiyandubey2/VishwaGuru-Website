import React, { useState } from 'react';
import { Language } from '../types';
import { useNavigate } from 'react-router-dom';

interface NumerologyFormProps {
  onCalculate: (name: string, birthdate: string) => void;
  language: Language;
}

const NumerologyForm: React.FC<NumerologyFormProps> = ({ onCalculate, language }) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [errors, setErrors] = useState({ name: '', birthdate: '' });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCalculate(name, birthdate);
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

      <div className="text-sm text-gray-600 italic">
        <p>
          {language === 'english' 
            ? 'Need personal guidance? Scan the QR code for support.'
            : 'व्यक्तिगत मार्गदर्शन चाहिए? सहायता के लिए QR कोड स्कैन करें।'}
          {' '}
          <button
            type="button"
            onClick={() => navigate('/personal-support')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {language === 'english' ? 'Get Support' : 'सहायता प्राप्त करें'}
          </button>
        </p>
      </div>

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
