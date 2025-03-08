import emailjs from '@emailjs/browser';

// EmailJS credentials
const SERVICE_ID = 'service_oweox77';
const TEMPLATE_ID = 'template_6oixb1w';
const PUBLIC_KEY = 'LvCN8g3VTGyJAV8vY';

// Default sender info
const FROM_NAME = 'Aadiyan Dubey';
const REPLY_TO = 'dubey0079@gmail.com';

export const sendPromotionalEmail = async (
  email: string,
  name: string,
  language: 'english' | 'hindi',
  numerologyResult: {
    destinyNumber: number;
    lifePathNumber: number;
    soulUrgeNumber: number;
    personalityNumber: number;
    birthdayNumber: number;
  }
) => {
  try {
    if (!email || !name || !numerologyResult) {
      throw new Error('Missing required parameters');
    }

    // Create email content based on language
    const emailContent = language === 'english' 
      ? `
        Dear ${name},

        Here is your numerology reading:

        Destiny Number: ${numerologyResult.destinyNumber}
        Life Path Number: ${numerologyResult.lifePathNumber}
        Soul Urge Number: ${numerologyResult.soulUrgeNumber}
        Personality Number: ${numerologyResult.personalityNumber}
        Birthday Number: ${numerologyResult.birthdayNumber}

        Visit VishwaGuru for more insights!

        Best regards,
        ${FROM_NAME}
        VishwaGuru Team
      `
      : `
        प्रिय ${name},

        यहाँ आपकी अंकशास्त्र रीडिंग है:

        भाग्य अंक: ${numerologyResult.destinyNumber}
        जीवन पथ अंक: ${numerologyResult.lifePathNumber}
        आत्मा की इच्छा अंक: ${numerologyResult.soulUrgeNumber}
        व्यक्तित्व अंक: ${numerologyResult.personalityNumber}
        जन्मदिन अंक: ${numerologyResult.birthdayNumber}

        अधिक जानकारी के लिए विश्वगुरु पर जाएं!

        शुभकामनाओं सहित,
        ${FROM_NAME}
        विश्वगुरु टीम
      `;

    const templateParams = {
      to_email: email,
      to_name: name,
      from_name: FROM_NAME,
      reply_to: REPLY_TO,
      message: emailContent,
      subject: language === 'english' 
        ? 'Your Numerology Reading from VishwaGuru'
        : 'विश्वगुरु से आपकी अंकशास्त्र रीडिंग'
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 