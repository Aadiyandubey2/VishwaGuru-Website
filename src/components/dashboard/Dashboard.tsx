import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Language, NumerologyResult } from '../../types';
import NumerologyResultDisplay from '../NumerologyResult';
import { History, Save, Trash2 } from 'lucide-react';
import { numerologyService } from '../../services/api';

interface DashboardProps {
  language: Language;
}

interface SavedReading {
  id: string;
  date: string;
  name: string;
  result: NumerologyResult;
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const { currentUser } = useAuth();
  const [savedResults, setSavedResults] = useState<SavedReading[]>([]);
  const [selectedResult, setSelectedResult] = useState<NumerologyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        setLoading(true);
        setError(null);
        const readings = await numerologyService.getUserReadings();
        setSavedResults(readings || []);
      } catch (err) {
        setError(language === 'english' 
          ? 'Failed to load your readings. Please try again later.' 
          : 'आपके पठन लोड करने में विफल। कृपया बाद में पुनः प्रयास करें।');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchReadings();
    } else {
      setLoading(false);
      setSavedResults([]);
    }
  }, [language, currentUser]);

  const handleViewResult = (result: NumerologyResult) => {
    setSelectedResult(result);
  };

  const handleDeleteReading = async (id: string) => {
    try {
      setDeleting(id);
      await numerologyService.deleteReading(id);
      setSavedResults(prev => prev.filter(reading => reading.id !== id));
      
      // Clear selected result if it was deleted
      if (selectedResult && savedResults.find(r => r.id === id)?.result === selectedResult) {
        setSelectedResult(null);
      }
    } catch (err) {
      setError(language === 'english' 
        ? 'Failed to delete reading. Please try again.' 
        : 'पठन हटाने में विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setDeleting(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 mb-8 text-center">
          <p className="text-lg text-gray-600">
            {language === 'english' 
              ? 'Please log in to view your dashboard.' 
              : 'अपना डैशबोर्ड देखने के लिए कृपया लॉग इन करें।'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 mb-8">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6">
          {language === 'english' 
            ? `Welcome, ${currentUser?.name || 'User'}!` 
            : `स्वागत है, ${currentUser?.name || 'उपयोगकर्ता'}!`}
        </h2>
        
        <div className="flex items-center mb-6">
          <History className="text-indigo-600 mr-2" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">
            {language === 'english' ? 'Your Saved Readings' : 'आपके सहेजे गए पठन'}
          </h3>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">
              {language === 'english' ? 'Loading your readings...' : 'आपके पठन लोड हो रहे हैं...'}
            </p>
          </div>
        ) : savedResults.length > 0 ? (
          <div className="space-y-4">
            {savedResults.map((item) => (
              <div 
                key={item.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-indigo-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="cursor-pointer" onClick={() => handleViewResult(item.result)}>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {language === 'english' ? 'Destiny: ' : 'भाग्य: '}{item.result.destinyNumber}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {language === 'english' ? 'Life Path: ' : 'जीवन पथ: '}{item.result.lifePathNumber}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteReading(item.id)}
                      disabled={deleting === item.id}
                      className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
                      aria-label="Delete reading"
                    >
                      {deleting === item.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-red-600 border-r-transparent"></div>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {language === 'english' 
              ? 'You have no saved readings yet. Calculate your numerology to save readings.' 
              : 'आपके पास अभी तक कोई सहेजा गया पठन नहीं है। पठन सहेजने के लिए अपना अंकशास्त्र गणना करें।'}
          </div>
        )}
      </div>
      
      {selectedResult && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {language === 'english' ? 'Reading Details' : 'पठन विवरण'}
            </h3>
          </div>
          <NumerologyResultDisplay result={selectedResult} language={language} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;