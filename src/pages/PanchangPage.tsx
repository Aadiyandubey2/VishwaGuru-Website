import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { motion } from 'framer-motion';
import { calculatePanchang, getAuspiciousTimes } from '../utils/panchangCalculator';

function PanchangPage({ language }: { language: Language }) {
  const panchang = calculatePanchang(new Date());
  const auspiciousTimes = getAuspiciousTimes(new Date());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Panchang - VishwaGuru</title>
        <meta name="description" content="Daily Panchang calculations and Hindu astrological calendar information." />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition w-fit">
          <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          {language === 'english' ? 'Back to Home' : 'होम पेज पर वापस जाएं'}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              {language === 'english' ? 'Daily Panchang' : 'दैनिक पंचांग'}
            </h1>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PanchangCard
                title={language === 'english' ? 'Tithi' : 'तिथि'}
                value={`${panchang.tithi[language === 'english' ? 'name' : 'nameHindi']} (${panchang.tithi[language === 'english' ? 'paksha' : 'pakshaHindi']})`}
                subtitle={language === 'english' ? 'Ends at' : 'समाप्ति'}
                subtitleValue={panchang.tithi.end.toLocaleTimeString()}
                language={language}
              />
              <PanchangCard
                title={language === 'english' ? 'Nakshatra' : 'नक्षत्र'}
                value={panchang.nakshatra[language === 'english' ? 'name' : 'nameHindi']}
                subtitle={language === 'english' ? 'Ends at' : 'समाप्ति'}
                subtitleValue={panchang.nakshatra.end.toLocaleTimeString()}
                language={language}
              />
              <PanchangCard
                title={language === 'english' ? 'Yoga' : 'योग'}
                value={panchang.yoga[language === 'english' ? 'name' : 'nameHindi']}
                subtitle={language === 'english' ? 'Ends at' : 'समाप्ति'}
                subtitleValue={panchang.yoga.end.toLocaleTimeString()}
                language={language}
              />              <PanchangCard
                title={language === 'english' ? 'Karana' : 'करण'}
                value={`${panchang.karana[0][language === 'english' ? 'name' : 'nameHindi']}, ${panchang.karana[1][language === 'english' ? 'name' : 'nameHindi']}`}
                subtitle={language === 'english' ? 'First Karana ends at' : 'प्रथम करण समाप्ति'}
                subtitleValue={panchang.karana[0].end.toLocaleTimeString()}
                language={language}
              />
              <PanchangCard
                title={language === 'english' ? 'Day' : 'वार'}
                value={panchang.weekday[language === 'english' ? 'name' : 'nameHindi']}
                language={language}
              />
              <PanchangCard
                title={language === 'english' ? 'Month (Amanta/Purnimanta)' : 'मास (अमांत/पूर्णिमांत)'}
                value={`${panchang.masa.amanta[language === 'english' ? 'name' : 'nameHindi']} / ${panchang.masa.purnimanta[language === 'english' ? 'name' : 'nameHindi']}`}
                language={language}
              />
            </div>
              <h2 className="text-2xl font-bold mt-8 mb-4 text-center text-gray-900 dark:text-white">
              {language === 'english' ? 'Auspicious Times' : 'शुभ मुहूर्त'}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <PanchangCard
                title={language === 'english' ? 'Sunrise' : 'सूर्योदय'}
                value={auspiciousTimes.sunrise.toLocaleTimeString()}
                language={language}
              />
              <PanchangCard
                title={language === 'english' ? 'Sunset' : 'सूर्यास्त'}
                value={auspiciousTimes.sunset.toLocaleTimeString()}
                language={language}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-3 mt-6">
              {auspiciousTimes.muhurtas.map((muhurta, index) => (
                <PanchangCard
                  key={index}
                  title={language === 'english' ? muhurta.name : muhurta.nameHindi}
                  value={`${muhurta.startTime.toLocaleTimeString()} - ${muhurta.endTime.toLocaleTimeString()}`}
                  subtitle={language === 'english' ? 'Description' : 'विवरण'}
                  subtitleValue={muhurta.description}
                  language={language}
                />
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-center text-gray-900 dark:text-white">
              {language === 'english' ? 'Zodiac Signs' : 'राशि'}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <PanchangCard
                title={language === 'english' ? 'Sun Sign' : 'सूर्य राशि'}
                value={panchang.zodiac.sun[language === 'english' ? 'sign' : 'signHindi']}
                language={language}
              />
              <PanchangCard
                title={language === 'english' ? 'Moon Sign' : 'चंद्र राशि'}
                value={panchang.zodiac.moon[language === 'english' ? 'sign' : 'signHindi']}
                subtitle={language === 'english' ? 'Changes at' : 'परिवर्तन'}
                subtitleValue={panchang.zodiac.moon.endTime.toLocaleTimeString()}
                language={language}
              />
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-center text-gray-900 dark:text-white">
              {language === 'english' ? 'Samvat Years' : 'संवत'}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <PanchangCard
                title={language === 'english' ? 'Shaka Samvat' : 'शक संवत'}
                value={`${panchang.samvat.shaka.year} (${panchang.samvat.shaka.name})`}
                language={language}
              />
              <PanchangCard
                title={language === 'english' ? 'Vikram Samvat' : 'विक्रम संवत'}
                value={`${panchang.samvat.vikram.year} (${panchang.samvat.vikram.name})`}
                language={language}
              />
              <PanchangCard
                title={language === 'english' ? 'Gujarati Samvat' : 'गुजराती संवत'}
                value={`${panchang.samvat.gujarati.year} (${panchang.samvat.gujarati.name})`}
                language={language}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PanchangCard({ 
  title, 
  value, 
  subtitle, 
  subtitleValue, 
  language 
}: { 
  title: string; 
  value: string; 
  subtitle?: string; 
  subtitleValue?: string; 
  language: Language;
}) {
  // Use language parameter to determine the text direction
  const isHindi = language === 'hindi';
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md ${isHindi ? 'text-right' : 'text-left'}`}
      dir={isHindi ? 'rtl' : 'ltr'}
    >
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 text-lg">{value}</p>
      {subtitle && subtitleValue && (
        <div className="mt-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">{subtitle}{isHindi ? ' :' : ':'}</span>
          <span className={`${isHindi ? 'ml-0 mr-1' : 'ml-1'} text-gray-600 dark:text-gray-300`}>{subtitleValue}</span>
        </div>
      )}
    </motion.div>
  );
}

export default PanchangPage;
