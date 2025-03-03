import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';
import { User, KeyRound, AlertTriangle } from 'lucide-react';

interface ProfileSettingsProps {
  language: Language;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ language }) => {
  const { currentUser, updateProfile, changePassword, deleteAccount } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return setError(language === 'english' ? 'Name is required' : 'नाम आवश्यक है');
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await updateProfile(name);
      setSuccess(language === 'english' ? 'Profile updated successfully' : 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई');
    } catch (err) {
      setError(language === 'english' ? 'Failed to update profile' : 'प्रोफ़ाइल अपडेट करने में विफल');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      return setError(language === 'english' ? 'Passwords do not match' : 'पासवर्ड मेल नहीं खाते');
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      setSuccess(language === 'english' ? 'Password changed successfully' : 'पासवर्ड सफलतापूर्वक बदला गया');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(language === 'english' ? 'Failed to change password' : 'पासवर्ड बदलने में विफल');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setError('');
      setLoading(true);
      await deleteAccount();
      // No need to set success message as user will be redirected
    } catch (err) {
      setError(language === 'english' ? 'Failed to delete account' : 'खाता हटाने में विफल');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6">
        {language === 'english' ? 'Profile Settings' : 'प्रोफ़ाइल सेटिंग्स'}
      </h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
          {success}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <User className="text-indigo-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              {language === 'english' ? 'Personal Information' : 'व्यक्तिगत जानकारी'}
            </h3>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'english' ? 'Full Name' : 'पूरा नाम'}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'english' ? 'Email' : 'ईमेल'}
              </label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {language === 'english' ? 'Email cannot be changed' : 'ईमेल बदला नहीं जा सकता'}
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading 
                ? (language === 'english' ? 'Updating...' : 'अपडेट हो रहा है...') 
                : (language === 'english' ? 'Update Profile' : 'प्रोफ़ाइल अपडेट करें')}
            </button>
          </form>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <KeyRound className="text-indigo-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              {language === 'english' ? 'Change Password' : 'पासवर्ड बदलें'}
            </h3>
          </div>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'english' ? 'Current Password' : 'वर्तमान पासवर्ड'}
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'english' ? 'New Password' : 'नया पासवर्ड'}
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'english' ? 'Confirm New Password' : 'नए पासवर्ड की पुष्टि करें'}
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading 
                ? (language === 'english' ? 'Changing...' : 'बदल रहा है...') 
                : (language === 'english' ? 'Change Password' : 'पासवर्ड बदलें')}
            </button>
          </form>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-red-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              {language === 'english' ? 'Delete Account' : 'खाता हटाएं'}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            {language === 'english' 
              ? 'Once you delete your account, there is no going back. Please be certain.' 
              : 'एक बार जब आप अपना खाता हटा देते हैं, तो वापस नहीं जा सकते। कृपया निश्चित रहें।'}
          </p>
          
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {language === 'english' ? 'Delete Account' : 'खाता हटाएं'}
            </button>
          ) : (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-600 font-medium mb-4">
                {language === 'english' 
                  ? 'Are you sure you want to delete your account? This action cannot be undone.' 
                  : 'क्या आप वाकई अपना खाता हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।'}
              </p>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading 
                    ? (language === 'english' ? 'Deleting...' : 'हटा रहा है...') 
                    : (language === 'english' ? 'Yes, Delete Account' : 'हां, खाता हटाएं')}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {language === 'english' ? 'Cancel' : 'रद्द करें'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;