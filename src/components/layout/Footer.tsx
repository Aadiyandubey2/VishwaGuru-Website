import React, { useMemo } from 'react';
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

// Move socialLinks outside component to prevent recreating on each render
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
] as const;

// Memoize animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: { 
    scaleX: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Footer: React.FC<FooterProps> = React.memo(({ language }) => {
  // Memoize copyright text
  const copyrightText = useMemo(() => {
    return language === 'english' 
      ? '© VishwaGuru Website. All rights reserved. Owner Aadiyan Dubey'
      : '© विश्वगुरु वेबसाइट। सर्वाधिकार सुरक्षित। स्वामी आदियन दुबे';
  }, [language]);

  const socialLinksList = useMemo(() => (
    socialLinks.map((link, index) => (
      <motion.a
        key={link.name}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ 
          scale: 1.1,
          filter: "brightness(1.1)"
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ 
          duration: 0.2,
          delay: index * 0.1
        }}
        className={`
          relative flex flex-col items-center justify-center
          px-0 py-2 rounded-xl text-white
          shadow-lg border border-white/20
          backdrop-blur-md transition-all
          ${link.colors.bg}
          min-w-[90px] max-w-[120px] w-full h-[48px]
        `}
      >
        <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/30 mb-1">
          <link.icon size={18} strokeWidth={2} />
        </span>
        <span className="relative z-10 text-sm font-semibold">
          {link.name}
        </span>
      </motion.a>
    ))
  ), []);

  return (
    <motion.footer 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative text-blue-900 dark:text-blue-100 py-6 mt-16 bg-white dark:bg-gray-800 w-full"
    >
      <motion.div 
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 origin-left"
      />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
          {copyrightText}
        </motion.p>
        
        <div className="w-full flex justify-center mt-6">
          <div className="grid grid-cols-4 gap-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
            {socialLinksList}
          </div>
        </div>
      </div>
      
      <motion.div 
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
      />
    </motion.footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;