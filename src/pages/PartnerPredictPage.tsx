import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNotification } from '../utils/NotificationContext';
import { Language } from '../types';
import { calculatePartnerCompatibility, getPartnerPrediction } from '../utils/partnerPredictionCalculator';
import type { DetailedPartnerPrediction } from '../utils/partnerPredictionCalculator';

interface FormData {
    name: string;
    birthdate: string;
    gender: 'male' | 'female';
}

export default function PartnerPredictPage({ language }: { language: Language }) {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        birthdate: '',
        gender: 'male'
    });    const [prediction, setPrediction] = useState<DetailedPartnerPrediction | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const compatibility = calculatePartnerCompatibility(
                formData.name,
                formData.birthdate,
        
            );
            const result = getPartnerPrediction(
                compatibility,
                language === 'english' ? 'english' : 'hindi',
                formData.gender
            );
            setPrediction(result);
            showNotification(
                'success',
                language === 'english'
                    ? 'Your partner prediction has been calculated!'
                    : 'आपके साथी की भविष्यवाणी की गणना कर दी गई है!'
            );
        } catch (error) {
            console.error('Prediction error:', error);
            showNotification(
                'error',
                language === 'english'
                    ? 'Failed to calculate prediction. Please try again.'
                    : 'भविष्यवाणी की गणना में विफल। कृपया पुनः प्रयास करें।'
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Helmet>
                <title>{language === 'english' ? 'Partner Prediction - VishwaGuru' : 'साथी की भविष्यवाणी - विश्वगुरु'}</title>
                <meta name="description" content={language === 'english' 
                    ? "Discover insights about your future partner based on numerology and astrology."
                    : "अंकशास्त्र और ज्योतिष के आधार पर अपने भविष्य के साथी के बारे में जानें।"} 
                />
            </Helmet>
            
            <div className="container mx-auto px-4 py-12">
                <Link to="/" className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition w-fit">
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                    </svg>
                    {language === 'english' ? 'Back to Home' : 'होम पेज पर वापस जाएं'}
                </Link>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/3 bg-pink-600 dark:bg-pink-700 text-white p-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <h2 className="text-xl font-semibold mb-4">
                                        {language === 'english' 
                                            ? 'Discover Your Future Partner' 
                                            : 'अपने भविष्य के साथी को जानें'}
                                    </h2>
                                    <p className="mb-6 text-pink-100 dark:text-pink-200">
                                        {language === 'english'
                                            ? 'Enter your details to get insights about your future life partner based on numerology.'
                                            : 'अंकशास्त्र के आधार पर अपने भविष्य के जीवन साथी के बारे में जानकारी प्राप्त करने के लिए अपना विवरण दर्ज करें।'}
                                    </p>
                                </motion.div>
                            </div>

                            <div className="md:w-2/3 p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                                            {language === 'english' ? 'Your Full Name' : 'आपका पूरा नाम'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray 300 shadow-sm px-1 py-2 text-lg focus:border-pink-500 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                                            {language === 'english' ? 'Your Date of Birth' : 'आपकी जन्म तिथि'}
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 py-2 text-lg focus:border-pink-500 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            value={formData.birthdate}
                                            onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                                            {language === 'english' ? 'Your Gender' : 'आपका लिंग'}
                                        </label>
                                        <select
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-1 py-2 text-lg focus:border-rose-500 focus:ring-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                                        >
                                            <option value="male">{language === 'english' ? 'Male' : 'पुरुष'}</option>
                                            <option value="female">{language === 'english' ? 'Female' : 'महिला'}</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                    >
                                        {language === 'english' ? 'Get Prediction' : 'भविष्यवाणी प्राप्त करें'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {prediction && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 space-y-6"
                        >                            {/* Basic Prediction Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {language === 'english' ? 'Partner Prediction' : 'साथी की भविष्यवाणी'}
                                    </h3>
                                    <div className="flex items-center">
                                        <div className="text-2xl font-bold text-rose-600">
                                            {prediction.compatibility}%
                                        </div>
                                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                            {language === 'english' ? 'Compatibility' : 'अनुकूलता'}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    {prediction.personalityMatch}
                                </p>

                                <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900 rounded-lg">
                                    <h4 className="font-medium text-rose-800 dark:text-rose-200 mb-2">
                                        {language === 'english' ? 'Advice' : 'सलाह'}:
                                    </h4>
                                    <p className="text-rose-700 dark:text-rose-300">
                                        {prediction.advice}
                                    </p>
                                </div>
                            </div>

                            {/* Compatibility Factors */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    {language === 'english' ? 'Compatibility Analysis' : 'अनुकूलता विश्लेषण'}
                                </h3>
                                <div className="grid gap-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {language === 'english' ? 'Destiny Compatibility' : 'भाग्य अनुकूलता'}
                                        </span>
                                        <div className="flex items-center">
                                            <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                                                <div 
                                                    className="h-2 bg-rose-500 rounded-full"
                                                    style={{ width: `${prediction.compatibilityFactors.destinyCompatibility}%` }}
                                                />
                                            </div>
                                            <span className="text-rose-600 font-medium">
                                                {prediction.compatibilityFactors.destinyCompatibility}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {language === 'english' ? 'Life Path Compatibility' : 'जीवन पथ अनुकूलता'}
                                        </span>
                                        <div className="flex items-center">
                                            <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                                                <div 
                                                    className="h-2 bg-rose-500 rounded-full"
                                                    style={{ width: `${prediction.compatibilityFactors.lifePathCompatibility}%` }}
                                                />
                                            </div>
                                            <span className="text-rose-600 font-medium">
                                                {prediction.compatibilityFactors.lifePathCompatibility}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Traits Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    {language === 'english' ? 'Detailed Partner Profile' : 'विस्तृत साथी प्रोफाइल'}
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Virtues */}
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {language === 'english' ? 'Virtues' : 'गुण'}
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                            {prediction.detailedTraits.virtues.map((virtue, index) => (
                                                <li key={index}>{virtue}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Personality Traits */}
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {language === 'english' ? 'Personality' : 'व्यक्तित्व'}
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                            {prediction.detailedTraits.personality.map((trait, index) => (
                                                <li key={index}>{trait}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Career */}
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {language === 'english' ? 'Career & Ambitions' : 'करियर और महत्वाकांक्षाएं'}
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                            {prediction.detailedTraits.career.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Lifestyle */}
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {language === 'english' ? 'Lifestyle' : 'जीवनशैली'}
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                            {prediction.detailedTraits.lifestyle.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Relationships */}
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {language === 'english' ? 'Relationship Style' : 'रिश्ते का स्वभाव'}
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                            {prediction.detailedTraits.relationships.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Appearance */}
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {language === 'english' ? 'Appearance & Presence' : 'रूप और उपस्थिति'}
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                            {prediction.detailedTraits.appearance.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Challenges and Growth Areas */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    {language === 'english' ? 'Relationship Dynamics' : 'रिश्ते की गतिशीलता'}
                                </h3>
                                <div className="grid gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                            {language === 'english' ? 'Relationship Style' : 'रिश्ते की शैली'}
                                        </h4>
                                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                            {prediction.detailedTraits.relationships.map((trait, index) => (
                                                <li key={index}>{trait}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                            {language === 'english' ? 'Growth Areas' : 'विकास के क्षेत्र'}
                                        </h4>
                                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                            {prediction.detailedTraits.challenges.map((challenge, index) => (
                                                <li key={index}>{challenge}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
