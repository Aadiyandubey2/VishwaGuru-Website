import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';
import { Language } from '../types';
import { Helmet } from 'react-helmet';

interface SignupProps {
  language: Language;
}

const Signup: React.FC<SignupProps> = ({ language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      showNotification('error', language === 'english'
        ? 'Passwords do not match'
        : 'पासवर्ड मेल नहीं खाते');
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      showNotification('success', language === 'english'
        ? 'Account created successfully! Please check your email for verification.'
        : 'खाता सफलतापूर्वक बनाया गया! कृपया सत्यापन के लिए अपना ईमेल जांचें।');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      showNotification('error', language === 'english'
        ? 'Failed to create account. Please try again.'
        : 'खाता बनाने में विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8">
      <Helmet>
        <title>Sign Up - VishwaGuru</title>
        <meta name="description" content="Create your VishwaGuru account to save your numerology and palmistry readings and access your personalized dashboard." />
        <link rel="canonical" href="https://www.vishwaguru.site/signup" />
        <meta property="og:title" content="Sign Up - VishwaGuru" />
        <meta property="og:description" content="Create your VishwaGuru account to save your numerology and palmistry readings and access your personalized dashboard." />
        <meta property="og:url" content="https://www.vishwaguru.site/signup" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.vishwaguru.site/VishwaGuruLogo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sign Up - VishwaGuru" />
        <meta name="twitter:description" content="Create your VishwaGuru account to save your numerology and palmistry readings and access your personalized dashboard." />
        <meta name="twitter:image" content="https://www.vishwaguru.site/VishwaGuruLogo.png" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {language === 'english' ? 'Create your account' : 'अपना खाता बनाएं'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {language === 'english'
              ? 'Start your numerology journey today'
              : 'आज ही अपनी अंकशास्त्र यात्रा शुरू करें'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {language === 'english' ? 'Email address' : 'ईमेल पता'}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                placeholder={language === 'english' ? 'Email address' : 'ईमेल पता'}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {language === 'english' ? 'Password' : 'पासवर्ड'}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                placeholder={language === 'english' ? 'Password' : 'पासवर्ड'}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                {language === 'english' ? 'Confirm Password' : 'पासवर्ड की पुष्टि करें'}
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                placeholder={language === 'english' ? 'Confirm Password' : 'पासवर्ड की पुष्टि करें'}
              />
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                language === 'english' ? 'Creating account...' : 'खाता बन रहा है...'
              ) : (
                language === 'english' ? 'Sign up' : 'साइन अप करें'
              )}
            </motion.button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {language === 'english' 
                ? "Already have an account? Sign in" 
                : "पहले से खाता है? साइन इन करें"}
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup; 