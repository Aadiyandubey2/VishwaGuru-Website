import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Language, NumerologyResult } from '../../types';
import NumerologyResultDisplay from '../NumerologyResult';
import { History, Save } from 'lucide-react';

interface DashboardProps {
  language: Language;
}
const mockSavedResults: { id: string; date: string; name: string; result: NumerologyResult }[] = [
  {
    id: '1',
    date: '2025-04-15',
    name: 'John Doe',
    result: {
      destinyNumber: 7,
      soulUrgeNumber: 5,
      personalityNumber: 2,
      lifePathNumber: 9,
      birthdayNumber: 4
    }
  },
  {
    id: '2',
    date: '2025-04-10',
    name: 'Jane Smith',
    result: {
      destinyNumber: 3,
      soulUrgeNumber: 1,
      personalityNumber: 2,
      lifePathNumber: 6,
      birthdayNumber: 8
    }
  }
];

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const { currentUser } = useAuth();
  const [savedResults, setSavedResults] = useState<typeof mockSavedResults>([]);
  const [selectedResult, setSelectedResult] = useState<NumerologyResult | null>(null);

  useEffect(() => {
    setSavedResults(mockSavedResults);
  }, []);

  const handleViewResult = (result: NumerologyResult) => {
    setSelectedResult(result);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 mb-8">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6">
          {language === 'english' 
            ? `Welcome, ${currentUser?.displayName || 'User'}!` 
            : `स्वागत है, ${currentUser?.displayName || 'उपयोगकर्ता'}!`}
        </h2>
        
        <div className="flex items-center mb-6">
          <History className="text-indigo-600 mr-2" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">
            {language === 'english' ? 'Your Saved Readings' : 'आपके सहेजे गए पठन'}
          </h3>
        </div>
        
        {savedResults.length > 0 ? (
          <div className="space-y-4">
            {savedResults.map((item) => (
              <div 
                key={item.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-indigo-50 transition-colors cursor-pointer"
                onClick={() => handleViewResult(item.result)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {language === 'english' ? 'Destiny: ' : 'भाग्य: '}{item.result.destinyNumber}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {language === 'english' ? 'Life Path: ' : 'जीवन पथ: '}{item.result.lifePathNumber}
                    </span>
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
            <button className="flex items-center text-indigo-600 hover:text-indigo-800">
              <Save size={18} className="mr-1" />
              <span className="text-sm font-medium">
                {language === 'english' ? 'Save to Profile' : 'प्रोफ़ाइल में सहेजें'}
              </span>
            </button>
          </div>
          <NumerologyResultDisplay result={selectedResult} language={language} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;