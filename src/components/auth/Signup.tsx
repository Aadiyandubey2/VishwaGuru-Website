import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Language } from '../../types';

interface SignupProps {
  language: Language;
}

const Signup: React.FC<SignupProps> = ({ language }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError(language === 'english' 
        ? 'Passwords do not match' 
        : 'पासवर्ड मेल नहीं खाते');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, name);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 
        (language === 'english' 
          ? 'Failed to create an account' 
          : 'खाता बनाने में विफल'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
      <div className="flex items-center justify-center mb-6">
        <UserPlus className="text-indigo-600 mr-2" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">
          {language === 'english' ? 'Create Account' : 'खाता बनाएं'}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'english' ? 'Full Name' : 'पूरा नाम'}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={language === 'english' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'english' ? 'Email' : 'ईमेल'}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={language === 'english' ? 'Enter your email' : 'अपना ईमेल दर्ज करें'}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'english' ? 'Password' : 'पासवर्ड'}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={language === 'english' ? 'Create a password' : 'एक पासवर्ड बनाएं'}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'english' ? 'Confirm Password' : 'पासवर्ड की पुष्टि करें'}
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={language === 'english' ? 'Confirm your password' : 'अपने पासवर्ड की पुष्टि करें'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading 
            ? (language === 'english' ? 'Creating Account...' : 'खाता बन रहा है...') 
            : (language === 'english' ? 'Sign Up' : 'साइन अप करें')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {language === 'english' ? 'Already have an account?' : 'पहले से ही एक खाता है?'}{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
            {language === 'english' ? 'Login' : 'लॉग इन करें'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;