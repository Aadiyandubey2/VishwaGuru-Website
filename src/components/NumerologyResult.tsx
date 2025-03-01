import React from 'react';
import { NumerologyResult as NumerologyResultType, Language } from '../types';
import { destinyInterpretations, lifePathInterpretations, getInterpretation } from '../data/interpretations';

interface NumerologyResultProps {
  result: NumerologyResultType | null;
  language: Language;
}

const NumberCard: React.FC<{
  title: string;
  number: number;
  description: string;
  className?: string;
}> = ({ title, number, description, className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex items-center justify-center mb-4">
        <span className="text-4xl font-bold text-indigo-600">{number}</span>
      </div>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

const NumerologyResultDisplay: React.FC<NumerologyResultProps> = ({ result, language }) => {
  if (!result) return null;

  const destinyInterp = getInterpretation(result.destinyNumber, destinyInterpretations);
  const lifePathInterp = getInterpretation(result.lifePathNumber, lifePathInterpretations);

  return (
    <div className="space-y-8">
      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
        <h2 className="text-xl font-bold text-indigo-800 mb-4">
          {language === 'english' ? 'Your Numerology Profile' : 'आपका अंकशास्त्र प्रोफ़ाइल'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <span className="text-sm text-gray-500">
              {language === 'english' ? 'Destiny Number' : 'भाग्य अंक'}
            </span>
            <div className="flex items-center mt-1">
              <span className="text-3xl font-bold text-indigo-600">{result.destinyNumber}</span>
              <span className="ml-2 text-indigo-800 font-medium">
                {language === 'english' 
                  ? destinyInterp?.englishTitle 
                  : destinyInterp?.hindiTitle}
              </span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <span className="text-sm text-gray-500">
              {language === 'english' ? 'Life Path Number' : 'जीवन पथ अंक'}
            </span>
            <div className="flex items-center mt-1">
              <span className="text-3xl font-bold text-indigo-600">{result.lifePathNumber}</span>
              <span className="ml-2 text-indigo-800 font-medium">
                {language === 'english' 
                  ? lifePathInterp?.englishTitle 
                  : lifePathInterp?.hindiTitle}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <span className="text-sm text-gray-500">
              {language === 'english' ? 'Soul Urge Number' : 'आत्मा की इच्छा अंक'}
            </span>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold text-indigo-600">{result.soulUrgeNumber}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <span className="text-sm text-gray-500">
              {language === 'english' ? 'Personality Number' : 'व्यक्तित्व अंक'}
            </span>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold text-indigo-600">{result.personalityNumber}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <span className="text-sm text-gray-500">
              {language === 'english' ? 'Birthday Number' : 'जन्मदिन अंक'}
            </span>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold text-indigo-600">{result.birthdayNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-indigo-800">
            {language === 'english' 
              ? `Destiny Number ${result.destinyNumber}: ${destinyInterp?.englishTitle}` 
              : `भाग्य अंक ${result.destinyNumber}: ${destinyInterp?.hindiTitle}`}
          </h3>
          <p className="text-gray-700">
            {language === 'english' 
              ? destinyInterp?.englishDescription 
              : destinyInterp?.hindiDescription}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-indigo-800">
            {language === 'english' 
              ? `Life Path Number ${result.lifePathNumber}: ${lifePathInterp?.englishTitle}` 
              : `जीवन पथ अंक ${result.lifePathNumber}: ${lifePathInterp?.hindiTitle}`}
          </h3>
          <p className="text-gray-700">
            {language === 'english' 
              ? lifePathInterp?.englishDescription 
              : lifePathInterp?.hindiDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NumerologyResultDisplay;