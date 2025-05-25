import React from 'react';
import { Language } from '../../types';
import { 
  Instagram as InstagramIcon, 
  Linkedin as LinkedinIcon, 
  Github as GithubIcon, 
  Mail as MailIcon 
} from 'lucide-react';

interface FooterProps {
  language: Language;
}

const socialLinks = [
  { 
    name: 'Instagram', 
    url: 'https://instagram.com/aadiyan_dubey0', 
    icon: InstagramIcon,
    colors: {
      bg: 'bg-gradient-to-tr from-[#FFDC80] via-[#FC4C4C] to-[#405DE6]'
    }
  },
  { 
    name: 'LinkedIn', 
    url: 'https://www.linkedin.com/in/aadiyan-dubey-234ab5274', 
    icon: LinkedinIcon,
    colors: {
      bg: 'bg-gradient-to-r from-[#0077B5] to-[#0077B5]'
    }
  },
  { 
    name: 'GitHub', 
    url: 'https://github.com/Aadiyandubey2', 
    icon: GithubIcon,
    colors: {
      bg: 'bg-gradient-to-r from-[#24292E] to-black'
    }
  },
  { 
    name: 'Gmail', 
    url: 'mailto:dubey0079@gmail.com', 
    icon: MailIcon,
    colors: {
      bg: 'bg-gradient-to-r from-[#EA4335] to-[#BB001B]'
    }
  }
];

const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="relative text-blue-900 dark:text-blue-100 py-6 mt-16 bg-white dark:bg-gray-800 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {language === 'english' 
            ? '© VishwaGuru . All rights reserved. Founder Aadiyan Dubey'
            : '© विश्वगुरु । सर्वाधिकार सुरक्षित। संस्थापक आदियन दुबे'}<br />
          {language === 'english' 
            ? 'Made with ❤️ in India'
            : 'भारत में ❤️ से बनाया गया'}
        </p>

        <div className="w-full flex justify-center mt-6">
          <div className="grid grid-cols-4 gap-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  relative flex flex-col items-center justify-center px-0 py-2 rounded-xl
                  text-white shadow-md border border-white/30
                  ${link.colors.bg}
                  overflow-hidden
                  min-w-[90px] max-w-[120px] w-full h-[48px]
                `}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/30 mb-1">
                  <link.icon size={18} strokeWidth={2} />
                </span>
                <span className="text-sm font-semibold">
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
