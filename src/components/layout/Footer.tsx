import React from 'react';
import { Language } from '../../types';
import { Instagram, Linkedin, Github, Mail } from 'lucide-react';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="relative text-blue-900 py-6 mt-16 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 animate-pulse" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <p className="text-lg font-semibold">
          {language === 'english' 
            ? '© VishwaGuru Website. All rights reserved. Owner Aadiyan Dubey'
            : '© विश्वगुरु वेबसाइट। सर्वाधिकार सुरक्षित। स्वामी आदियन दुबे'}
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-full">
          {[
            { name: 'Instagram', url: 'https://instagram.com/aadiyan_dubey0', icon: <Instagram size={14} /> },
            { name: 'LinkedIn', url: 'https://www.linkedin.com/in/aadiyan-dubey-234ab5274', icon: <Linkedin size={14} /> },
            { name: 'GitHub', url: 'https://github.com/Aadiyandubey2', icon: <Github size={14} /> },
            { name: 'Gmail', url: 'mailto:dubey0079@gmail.com', icon: <Mail size={14} /> }
          ].map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center space-x-1 px-2 py-1 font-medium text-blue-900 rounded-md transition-transform transform hover:scale-105 hover:shadow-md max-w-xs sm:max-w-sm md:max-w-md flex-shrink"
            >
              <span className="absolute inset-0 rounded-md border border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[0.2px]" />
              <span className="relative flex items-center space-x-1 bg-white rounded-md px-2 py-1 text-xs sm:text-sm md:text-base">
                {link.icon} <span>{link.name}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
    </footer>
  );
};

export default Footer;