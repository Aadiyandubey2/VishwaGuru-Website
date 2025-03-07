import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NumerologyResult as NumerologyResultType, Language } from '../types';
import { destinyInterpretations, lifePathInterpretations, getInterpretation } from '../data/interpretations';

interface NumerologyResultProps {
  result: NumerologyResultType | null;
  language: Language;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const NumberCard: React.FC<{ title: string; number: number; description: string; className?: string; }> = ({ title, number, description, className = '' }) => {
  const [isTouched, setIsTouched] = useState(false);

  return (
    <motion.div 
      className={`relative bg-white p-3 rounded-md shadow-md border-2 transition-all transform hover:scale-105 ${isTouched ? 'border-red-500 text-red-700 font-bold' : ''} ${className}`}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setIsTouched(false)}
    >
      <motion.div
        className="absolute inset-0 rounded-md border-2 animate-gradient-border"
        style={{ borderImage: 'linear-gradient(90deg, red, purple) 1' }}
      ></motion.div>
      <h3 className="text-md font-semibold mb-1 relative z-10">{title}</h3>
      <div className="flex items-center justify-center mb-2 relative z-10">
        <motion.span className="text-2xl font-bold text-indigo-600">{number}</motion.span>
      </div>
      <p className="text-gray-700 text-sm relative z-10">{description}</p>
    </motion.div>
  );
};

const NumerologyResultDisplay: React.FC<NumerologyResultProps> = ({ result, language }) => {
  if (!result) return null;

  const destinyInterp = getInterpretation(result.destinyNumber, destinyInterpretations);
  const lifePathInterp = getInterpretation(result.lifePathNumber, lifePathInterpretations);

  const defaultDescription = language === 'english' 
    ? 'Prediction will come in further updates.' 
    : 'भविष्यवाणी आगामी अपडेट में उपलब्ध होगी।';

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={fadeIn}>
      <motion.div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100" variants={fadeIn}>
        <h2 className="text-lg font-bold text-indigo-800 mb-3">
          {language === 'english' ? 'Your Numerology Profile' : 'आपका अंकशास्त्र प्रोफ़ाइल'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <NumberCard 
            title={language === 'english' ? 'Destiny Number' : 'भाग्य अंक'} 
            number={result.destinyNumber} 
            description={destinyInterp ? (language === 'english' ? destinyInterp.englishTitle : destinyInterp.hindiTitle) : defaultDescription} 
          />
          <NumberCard 
            title={language === 'english' ? 'Life Path Number' : 'जीवन पथ अंक'} 
            number={result.lifePathNumber} 
            description={lifePathInterp ? (language === 'english' ? lifePathInterp.englishTitle : lifePathInterp.hindiTitle) : defaultDescription} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <NumberCard 
            title={language === 'english' ? 'Soul Urge Number' : 'आत्मा की इच्छा अंक'} 
            number={result.soulUrgeNumber} 
            description={defaultDescription} 
          />
          <NumberCard 
            title={language === 'english' ? 'Personality Number' : 'व्यक्तित्व अंक'} 
            number={result.personalityNumber} 
            description={defaultDescription} 
          />
          <NumberCard 
            title={language === 'english' ? 'Birthday Number' : 'जन्मदिन अंक'} 
            number={result.birthdayNumber} 
            description={defaultDescription} 
          />
        </div>
      </motion.div>

      <motion.div className="space-y-4" variants={fadeIn}>
        <motion.div className="bg-white p-4 rounded-lg shadow-md" variants={fadeIn}>
          <h3 className="text-md font-semibold mb-2 text-indigo-800">
            {language === 'english' 
              ? `Destiny Number ${result.destinyNumber}: ${destinyInterp?.englishTitle || 'Prediction coming soon'}` 
              : `भाग्य अंक ${result.destinyNumber}: ${destinyInterp?.hindiTitle || 'भविष्यवाणी जल्द ही आएगी'}`}
          </h3>
          <p className="text-gray-700 text-sm">
            {language === 'english' 
              ? destinyInterp?.englishDescription || 'Prediction will come in further updates.' 
              : destinyInterp?.hindiDescription || 'भविष्यवाणी आगामी अपडेट में उपलब्ध होगी।'}
          </p>
        </motion.div>

        <motion.div className="bg-white p-4 rounded-lg shadow-md" variants={fadeIn}>
          <h3 className="text-md font-semibold mb-2 text-indigo-800">
            {language === 'english' 
              ? `Life Path Number ${result.lifePathNumber}: ${lifePathInterp?.englishTitle || 'Prediction coming soon'}` 
              : `जीवन पथ अंक ${result.lifePathNumber}: ${lifePathInterp?.hindiTitle || 'भविष्यवाणी जल्द ही आएगी'}`}
          </h3>
          <p className="text-gray-700 text-sm">
            {language === 'english' 
              ? lifePathInterp?.englishDescription || 'Prediction will come in further updates.' 
              : lifePathInterp?.hindiDescription || 'भविष्यवाणी आगामी अपडेट में उपलब्ध होगी।'}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NumerologyResultDisplay;