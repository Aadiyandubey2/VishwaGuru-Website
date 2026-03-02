import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { NumerologyResult as NumerologyResultType, Language } from '../types';
import { destinyInterpretations, lifePathInterpretations, getInterpretation } from '../data/interpretations';
import SaveReadingButton from './SaveReadingButton';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';
import { sendPromotionalEmail } from '../utils/emailService';

interface NumerologyResultProps {
  result: NumerologyResultType;
  language: Language;
  name: string;
  birthdate: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const NumberCard: React.FC<{ title: string; number: number; description: string; className?: string; }> = ({ title, number, description, className = '' }) => {
  const [isTouched, setIsTouched] = React.useState(false);

  return (
    <motion.div 
      className={`relative bg-white dark:bg-gray-800 p-3 rounded-md shadow-md border-2 transition-all transform hover:scale-105 ${isTouched ? 'border-red-500 text-red-700 dark:text-red-400 font-bold' : ''} ${className}`}
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
      <h3 className="text-md font-semibold mb-1 relative z-10 text-gray-900 dark:text-gray-100">{title}</h3>
      <div className="flex items-center justify-center mb-2 relative z-10">
        <motion.span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{number}</motion.span>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm relative z-10">{description}</p>
    </motion.div>
  );
};

const NumerologyResultDisplay: React.FC<NumerologyResultProps> = ({
  result,
  language,
  name,
  birthdate
}) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [emailSent, setEmailSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  if (!result) return null;

  const destinyInterp = getInterpretation(result.destinyNumber, destinyInterpretations);
  const lifePathInterp = getInterpretation(result.lifePathNumber, lifePathInterpretations);

  const defaultDescription = language === 'english' 
    ? 'Prediction will come in further updates.' 
    : 'भविष्यवाणी आगामी अपडेट में उपलब्ध होगी।';

  const getInterpDescription = (interp: any) => {
    if (!interp) return defaultDescription;
    return language === 'english' ? interp.englishDescription : interp.hindiDescription;
  };

  const handleSendEmail = async () => {
    if (!user?.email || emailSent) return;

    setSending(true);
    try {
      const success = await sendPromotionalEmail(
        user.email,
        name,
        language,
        result
      );

      if (success) {
        setEmailSent(true);
        showNotification('success', language === 'english'
          ? 'Your reading has been sent to your email!'
          : 'आपकी रीडिंग आपके ईमेल पर भेज दी गई है!');
      } else {
        showNotification('error', language === 'english'
          ? 'Failed to send email. Please try again.'
          : 'ईमेल भेजने में विफल। कृपया पुनः प्रयास करें।');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showNotification('error', language === 'english'
        ? 'Error sending email'
        : 'ईमेल भेजने में त्रुटि');
    } finally {
      setSending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const numberDescriptions = {
    destinyNumber: {
      english: user 
        ? "Your Destiny Number represents your life's purpose and the opportunities that await you. Here's your detailed prediction: " + getInterpDescription(destinyInterp)
        : "Your Destiny Number represents your life's purpose and the opportunities that await you. Sign in to get the complete reading with predictions.",
      hindi: user
        ? "आपका भाग्य अंक आपके जीवन के उद्देश्य और आपकी प्रतीक्षा कर रहे अवसरों का प्रतिनिधित्व करता है। यहां आपकी विस्तृत भविष्यवाणी है: " + getInterpDescription(destinyInterp)
        : "आपका भाग्य अंक आपके जीवन के उद्देश्य और आपकी प्रतीक्षा कर रहे अवसरों का प्रतिनिधित्व करता है। पूर्ण पठन और भविष्यवाणियां प्राप्त करने के लिए साइन इन करें।"
    },
    soulUrgeNumber: {
      english: user
        ? "Your Soul Urge Number reveals your inner desires and what truly motivates you. Here's your detailed prediction: " + getInterpDescription(getInterpretation(result.soulUrgeNumber, destinyInterpretations))
        : "Your Soul Urge Number reveals your inner desires and what truly motivates you. Sign in to get the complete reading with predictions.",
      hindi: user
        ? "आपका आत्मा अंक आपकी आंतरिक इच्छाओं और आपको वास्तव में क्या प्रेरित करता है, यह दर्शाता है। यहां आपकी विस्तृत भविष्यवाणी है: " + getInterpDescription(getInterpretation(result.soulUrgeNumber, destinyInterpretations))
        : "आपका आत्मा अंक आपकी आंतरिक इच्छाओं और आपको वास्तव में क्या प्रेरित करता है, यह दर्शाता है। पूर्ण पठन और भविष्यवाणियां प्राप्त करने के लिए साइन इन करें।"
    },
    personalityNumber: {
      english: user
        ? "Your Personality Number shows how others perceive you and your outer personality. Here's your detailed prediction: " + getInterpDescription(getInterpretation(result.personalityNumber, destinyInterpretations))
        : "Your Personality Number shows how others perceive you and your outer personality. Sign in to get the complete reading with predictions.",
      hindi: user
        ? "आपका व्यक्तित्व अंक दर्शाता है कि दूसरे आपको कैसे देखते हैं और आपका बाहरी व्यक्तित्व कैसा है। यहां आपकी विस्तृत भविष्यवाणी है: " + getInterpDescription(getInterpretation(result.personalityNumber, destinyInterpretations))
        : "आपका व्यक्तित्व अंक दर्शाता है कि दूसरे आपको कैसे देखते हैं और आपका बाहरी व्यक्तित्व कैसा है। पूर्ण पठन और भविष्यवाणियां प्राप्त करने के लिए साइन इन करें।"
    },
    lifePathNumber: {
      english: user
        ? "Your Life Path Number indicates the path you'll take in life and your natural abilities. Here's your detailed prediction: " + getInterpDescription(lifePathInterp)
        : "Your Life Path Number indicates the path you'll take in life and your natural abilities. Sign in to get the complete reading with predictions.",
      hindi: user
        ? "आपका जीवन पथ अंक जीवन में आपके द्वारा लिए जाने वाले मार्ग और आपकी प्राकृतिक क्षमताओं को दर्शाता है। यहां आपकी विस्तृत भविष्यवाणी है: " + getInterpDescription(lifePathInterp)
        : "आपका जीवन पथ अंक जीवन में आपके द्वारा लिए जाने वाले मार्ग और आपकी प्राकृतिक क्षमताओं को दर्शाता है। पूर्ण पठन और भविष्यवाणियां प्राप्त करने के लिए साइन इन करें।"
    },
    birthdayNumber: {
      english: user
        ? "Your Birthday Number reveals special talents and abilities you possess. Here's your detailed prediction: " + getInterpDescription(getInterpretation(result.birthdayNumber, destinyInterpretations))
        : "Your Birthday Number reveals special talents and abilities you possess. Sign in to get the complete reading with predictions.",
      hindi: user
        ? "आपका जन्मदिन अंक आपके पास मौजूद विशेष प्रतिभाओं और क्षमताओं को प्रकट करता है। यहां आपकी विस्तृत भविष्यवाणी है: " + getInterpDescription(getInterpretation(result.birthdayNumber, destinyInterpretations))
        : "आपका जन्मदिन अंक आपके पास मौजूद विशेष प्रतिभाओं और क्षमताओं को प्रकट करता है। पूर्ण पठन और भविष्यवाणियां प्राप्त करने के लिए साइन इन करें।"
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center"
      >
        {language === 'english' 
          ? `Numerology Reading for ${name}`
          : `${name} के लिए अंकशास्त्र रीडिंग`}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(result) as Array<keyof NumerologyResultType>).map((key) => (
          <motion.div
            key={key}
            variants={itemVariants}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
              {language === 'english'
                ? key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                : key === 'destinyNumber' ? 'भाग्य अंक'
                : key === 'soulUrgeNumber' ? 'आत्मा अंक'
                : key === 'personalityNumber' ? 'व्यक्तित्व अंक'
                : key === 'lifePathNumber' ? 'जीवन पथ अंक'
                : 'जन्मदिन अंक'}
            </h3>
            <div className="flex items-center mb-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {result[key]}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {numberDescriptions[key][language]}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        {language === 'english'
          ? `Reading calculated on ${formatDate(new Date().toISOString())} for birthdate: ${formatDate(birthdate)}`
          : `${formatDate(birthdate)} की जन्मतिथि के लिए ${formatDate(new Date().toISOString())} को गणना की गई`}
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        {user?.email && (
          <motion.button
            onClick={handleSendEmail}
            disabled={emailSent || sending}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              emailSent
                ? 'bg-green-500 cursor-not-allowed'
                : sending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            whileHover={!emailSent && !sending ? { scale: 1.05 } : {}}
            whileTap={!emailSent && !sending ? { scale: 0.95 } : {}}
          >
            <Mail className="w-5 h-5 mr-2" />
            {emailSent 
              ? (language === 'english' ? 'Email Sent!' : 'ईमेल भेज दिया गया!')
              : sending
              ? (language === 'english' ? 'Sending...' : 'भेज रहा है...')
              : (language === 'english' ? 'Send to Email' : 'ईमेल पर भेजें')}
          </motion.button>
        )}
        {name && birthdate && (
          <SaveReadingButton 
            result={result} 
            name={name} 
            birthdate={birthdate} 
            language={language} 
          />
        )}
      </div>
    </motion.div>
  );
};

export default NumerologyResultDisplay;