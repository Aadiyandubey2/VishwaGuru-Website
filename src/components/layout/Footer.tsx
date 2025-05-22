import React from 'react';
import { motion } from 'framer-motion';
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
      gradient: 'from-yellow-500 via-pink-500 to-purple-500',
      bg: 'bg-gradient-to-tr from-[#FFDC80] via-[#FC4C4C] to-[#405DE6]'
    }
  },
  { 
    name: 'LinkedIn', 
    url: 'https://www.linkedin.com/in/aadiyan-dubey-234ab5274', 
    icon: LinkedinIcon,
    colors: {
      gradient: 'from-blue-500 to-blue-700',
      bg: 'bg-gradient-to-r from-[#0077B5] to-[#0077B5]'
    }
  },
  { 
    name: 'GitHub', 
    url: 'https://github.com/Aadiyandubey2', 
    icon: GithubIcon,
    colors: {
      gradient: 'from-gray-700 to-black',
      bg: 'bg-gradient-to-r from-[#24292E] to-black'
    }
  },
  { 
    name: 'Gmail', 
    url: 'mailto:dubey0079@gmail.com', 
    icon: MailIcon,
    colors: {
      gradient: 'from-red-500 to-red-700',
      bg: 'bg-gradient-to-r from-[#EA4335] to-[#BB001B]'
    }
  }
];

const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative text-blue-900 dark:text-blue-100 py-6 mt-16 overflow-hidden bg-white dark:bg-gray-800 w-full"
    >
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ 
          duration: 1, 
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 origin-left"
      />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          {language === 'english' 
            ? '© VishwaGuru Website. All rights reserved. Owner Aadiyan Dubey'
            : '© विश्वगुरु वेबसाइट। सर्वाधिकार सुरक्षित। स्वामी आदियन दुबे'}
        </motion.p>
        
        <div className="w-full flex justify-center mt-6">
          <div className="grid grid-cols-4 gap-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  scale: 1.13,
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                  filter: "brightness(1.15) drop-shadow(0 0 12px #fff7)"
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ 
                  delay: index * 0.18,
                  type: "spring",
                  stiffness: 300
                }}
                className={`
                  relative flex flex-col items-center justify-center px-0 py-2 rounded-xl
                  text-white shadow-2xl border border-white/30
                  bg-white/20 dark:bg-gray-900/30
                  backdrop-blur-md
                  transition-all duration-300
                  ${link.colors.bg} hover:shadow-3xl dark:shadow-gray-900/60
                  before:absolute before:inset-0 before:rounded-xl before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                  overflow-hidden
                  min-w-[90px] max-w-[120px] w-full h-[48px]
                `}
                style={{
                  boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.17)",
                  zIndex: 1
                }}
              >
                <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm shadow-md mb-1">
                  <link.icon size={18} strokeWidth={2} className="drop-shadow-lg" />
                </span>
                <span className="relative z-10 text-sm font-semibold drop-shadow-sm">
                  {link.name}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ 
          duration: 1, 
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
      />
    </motion.footer>
  );
};

export default Footer;