import React from 'react';
import { Language } from '../../types';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="relative text-blue-900 py-6 mt-16 overflow-hidden">
      {}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 animate-pulse" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <p className="text-lg font-semibold">
          {language === 'english' 
            ? '© VishwaGuru Website. All rights reserved. Owner Aadiyan Dubey'
            : '© विश्वगुरु वेबसाइट। सर्वाधिकार सुरक्षित। स्वामी आदियन दुबे'}
        </p>
        
        <div className="flex justify-center space-x-4 mt-4">
          {[
            { name: 'Instagram', url: 'https://instagram.com/aadiyan_dubey0' },
            { name: 'LinkedIn', url: 'https://www.linkedin.com/in/aadiyan-dubey-234ab5274' },
            { name: 'GitHub', url: 'https://github.com/Aadiyandubey2' },
            { name: 'Gmail', url: 'mailto:dubey0079@gmail.com' }
          ].map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative px-1.5 py-1.5 font-medium text-blue-900 rounded-lg transition-transform transform hover:scale-110 hover:shadow-xl"
            >
              <span className="absolute inset-0 rounded-lg border border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[0.5px]" />
              <span className="relative block px-1.5 py-1.5 bg-white rounded-lg">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
      
      {}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
    </footer>
  );
};

export default Footer;
