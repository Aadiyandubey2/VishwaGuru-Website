// Panchang calculation logic for Hindu calendar (step 1: basic structure, step 2/3 will add accuracy and interpretation)

interface MasaInfo {
  name: string;
  nameHindi: string;
  number: number;
}

interface PanchangData {
  tithi: {
    name: string;
    nameHindi: string;
    number: number;
    paksha: string;
    pakshaHindi: string;
    end: Date;
  };
  nakshatra: {
    name: string;
    nameHindi: string;
    number: number;
    end: Date;
  };
  yoga: {
    name: string;
    nameHindi: string;
    number: number;
    end: Date;
  };
  karana: Array<{
    name: string;
    nameHindi: string;
    number: number;
    end: Date;
  }>;
  weekday: {
    name: string;
    nameHindi: string;
    number: number;
  };
  masa: {
    amanta: MasaInfo;
    purnimanta: MasaInfo;
  };
  zodiac: {
    sun: {
      sign: string;
      signHindi: string;
      number: number;
    };
    moon: {
      sign: string;
      signHindi: string;
      number: number;
      endTime: Date;
    };
  };
  samvat: {
    shaka: {
      year: number;
      name: string;
    };
    vikram: {
      year: number;
      name: string;
    };
    gujarati: {
      year: number;
      name: string;
    };
  };
}

const tithiList = [
  { name: 'Pratipada', nameHindi: 'प्रतिपदा' },
  { name: 'Dwitiya', nameHindi: 'द्वितीया' },
  { name: 'Tritiya', nameHindi: 'तृतीया' },
  { name: 'Chaturthi', nameHindi: 'चतुर्थी' },
  { name: 'Panchami', nameHindi: 'पंचमी' },
  { name: 'Shashthi', nameHindi: 'षष्ठी' },
  { name: 'Saptami', nameHindi: 'सप्तमी' },
  { name: 'Ashtami', nameHindi: 'अष्टमी' },
  { name: 'Navami', nameHindi: 'नवमी' },
  { name: 'Dashami', nameHindi: 'दशमी' },
  { name: 'Ekadashi', nameHindi: 'एकादशी' },
  { name: 'Dwadashi', nameHindi: 'द्वादशी' },
  { name: 'Trayodashi', nameHindi: 'त्रयोदशी' },
  { name: 'Chaturdashi', nameHindi: 'चतुर्दशी' },
  { name: 'Purnima/Amavasya', nameHindi: 'पूर्णिमा/अमावस्या' }
];

const nakshatraList = [
  { name: 'Ashwini', nameHindi: 'अश्विनी' },
  { name: 'Bharani', nameHindi: 'भरणी' },
  { name: 'Krittika', nameHindi: 'कृत्तिका' },
  { name: 'Rohini', nameHindi: 'रोहिणी' },
  { name: 'Mrigashira', nameHindi: 'मृगशिरा' },
  { name: 'Ardra', nameHindi: 'आर्द्रा' },
  { name: 'Punarvasu', nameHindi: 'पुनर्वसु' },
  { name: 'Pushya', nameHindi: 'पुष्य' },
  { name: 'Ashlesha', nameHindi: 'आश्लेषा' },
  { name: 'Magha', nameHindi: 'मघा' },
  { name: 'Purva Phalguni', nameHindi: 'पूर्व फाल्गुनी' },
  { name: 'Uttara Phalguni', nameHindi: 'उत्तर फाल्गुनी' },
  { name: 'Hasta', nameHindi: 'हस्त' },
  { name: 'Chitra', nameHindi: 'चित्रा' },
  { name: 'Swati', nameHindi: 'स्वाति' },
  { name: 'Vishakha', nameHindi: 'विशाखा' },
  { name: 'Anuradha', nameHindi: 'अनुराधा' },
  { name: 'Jyeshtha', nameHindi: 'ज्येष्ठा' },
  { name: 'Mula', nameHindi: 'मूल' },
  { name: 'Purva Ashadha', nameHindi: 'पूर्व आषाढ़ा' },
  { name: 'Uttara Ashadha', nameHindi: 'उत्तर आषाढ़ा' },
  { name: 'Shravana', nameHindi: 'श्रवण' },
  { name: 'Dhanishta', nameHindi: 'धनिष्ठा' },
  { name: 'Shatabhisha', nameHindi: 'शतभिषा' },
  { name: 'Purva Bhadrapada', nameHindi: 'पूर्व भाद्रपद' },
  { name: 'Uttara Bhadrapada', nameHindi: 'उत्तर भाद्रपद' },
  { name: 'Revati', nameHindi: 'रेवती' }
];

const yogaList = [
  { name: 'Vishkumbha', nameHindi: 'विष्कुम्भ' },
  { name: 'Priti', nameHindi: 'प्रीति' },
  { name: 'Ayushman', nameHindi: 'आयुष्मान' },
  { name: 'Saubhagya', nameHindi: 'सौभाग्य' },
  { name: 'Shobhana', nameHindi: 'शोभन' },
  { name: 'Atiganda', nameHindi: 'अतिगण्ड' },
  { name: 'Sukarma', nameHindi: 'सुकर्मा' },
  { name: 'Dhriti', nameHindi: 'धृति' },
  { name: 'Shula', nameHindi: 'शूल' },
  { name: 'Ganda', nameHindi: 'गण्ड' },
  { name: 'Vriddhi', nameHindi: 'वृद्धि' },
  { name: 'Dhruva', nameHindi: 'ध्रुव' },
  { name: 'Vyaghata', nameHindi: 'व्याघात' },
  { name: 'Harshana', nameHindi: 'हर्षण' },
  { name: 'Vajra', nameHindi: 'वज्र' },
  { name: 'Siddhi', nameHindi: 'सिद्धि' },
  { name: 'Vyatipata', nameHindi: 'व्यतिपात' },
  { name: 'Variyan', nameHindi: 'वरीयान' },
  { name: 'Parigha', nameHindi: 'परिघ' },
  { name: 'Shiva', nameHindi: 'शिव' },
  { name: 'Siddha', nameHindi: 'सिद्ध' },
  { name: 'Sadhya', nameHindi: 'साध्य' },
  { name: 'Shubha', nameHindi: 'शुभ' },
  { name: 'Shukla', nameHindi: 'शुक्ल' },
  { name: 'Brahma', nameHindi: 'ब्रह्म' },
  { name: 'Indra', nameHindi: 'इन्द्र' },
  { name: 'Vaidhriti', nameHindi: 'वैधृति' }
];

const karanaList = [
  { name: 'Bava', nameHindi: 'बव' },
  { name: 'Balava', nameHindi: 'बालव' },
  { name: 'Kaulava', nameHindi: 'कौलव' },
  { name: 'Taitila', nameHindi: 'तैतिल' },
  { name: 'Garaja', nameHindi: 'गरज' },
  { name: 'Vanija', nameHindi: 'वणिज' },
  { name: 'Vishti', nameHindi: 'विष्टि' },
  { name: 'Shakuni', nameHindi: 'शकुनि' },
  { name: 'Chatushpada', nameHindi: 'चतुष्पद' },
  { name: 'Naga', nameHindi: 'नाग' },
  { name: 'Kimstughna', nameHindi: 'किंस्तुघ्न' }
];

const weekDays = [
  { name: 'Sunday', nameHindi: 'रविवार' },
  { name: 'Monday', nameHindi: 'सोमवार' },
  { name: 'Tuesday', nameHindi: 'मंगलवार' },
  { name: 'Wednesday', nameHindi: 'बुधवार' },
  { name: 'Thursday', nameHindi: 'गुरुवार' },
  { name: 'Friday', nameHindi: 'शुक्रवार' },
  { name: 'Saturday', nameHindi: 'शनिवार' }
];

const masaList = [
  { name: 'Chaitra', nameHindi: 'चैत्र' },
  { name: 'Vaishakha', nameHindi: 'वैशाख' },
  { name: 'Jyeshtha', nameHindi: 'ज्येष्ठ' },
  { name: 'Ashadha', nameHindi: 'आषाढ़' },
  { name: 'Shravana', nameHindi: 'श्रवण' },
  { name: 'Bhadrapada', nameHindi: 'भाद्रपद' },
  { name: 'Ashwin', nameHindi: 'आश्विन' },
  { name: 'Kartika', nameHindi: 'कार्तिक' },
  { name: 'Margashirsha', nameHindi: 'मार्गशीर्ष' },
  { name: 'Pausha', nameHindi: 'पौष' },
  { name: 'Magha', nameHindi: 'माघ' },
  { name: 'Phalguna', nameHindi: 'फाल्गुन' }
];

// Astronomical constants
const AYANAMSA = 24.1066; // Lahiri Ayanamsa for 2025
const J2000 = 2451545.0; // Julian date for Jan 1.5, 2000
const RAD = Math.PI / 180; // Convert degrees to radians
const DEG = 180 / Math.PI; // Convert radians to degrees
const SIDEREAL_YEAR = 365.256363004; // Sidereal year in days
const ZODIAC_NAMES = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
const ZODIAC_NAMES_HINDI = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'];

// Mathematical utility functions
function mod360(x: number): number {
  return x - Math.floor(x / 360.0) * 360.0;
}

function sinDeg(x: number): number {
  return Math.sin(x * RAD);
}

function cosDeg(x: number): number {
  return Math.cos(x * RAD);
}

function tanDeg(x: number): number {
  return Math.tan(x * RAD);
}

function asinDeg(x: number): number {
  return Math.asin(x) * DEG;
}

function atan2Deg(y: number, x: number): number {
  return Math.atan2(y, x) * DEG;
}

function calculateJulianDay(date: Date): number {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  const d = date.getDate() + date.getHours()/24.0 + date.getMinutes()/(24.0*60.0) + date.getSeconds()/(24.0*3600.0);
  
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
  return jd;
}

// Calculate sun's position
function calculateSunPosition(jd: number): number {
  const T = (jd - J2000) / 36525.0; // Julian centuries since J2000
  
  // Sun's mean longitude
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  L0 = mod360(L0);
  
  // Sun's mean anomaly
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  M = mod360(M);
  
  // Sun's equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sinDeg(M)
    + (0.019993 - 0.000101 * T) * sinDeg(2 * M)
    + 0.000289 * sinDeg(3 * M);
    
  // Sun's true longitude
  const L = L0 + C;
  
  return mod360(L);
}

// Calculate moon's position
function calculateMoonPosition(jd: number): number {
  const T = (jd - J2000) / 36525.0;
  
  // Moon's mean longitude
  let L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841.0 - T * T * T * T / 65194000.0;
  L = mod360(L);
  
  // Moon's mean elongation
  let D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868.0 - T * T * T * T / 113065000.0;
  D = mod360(D);
  
  // Sun's mean anomaly
  let M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000.0;
  M = mod360(M);
  
  // Moon's mean anomaly
  let Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699.0 - T * T * T * T / 14712000.0;
  Mp = mod360(Mp);
  
  // Correction terms
  let dL = 6288.06 * sinDeg(Mp)
    + 1274.02 * sinDeg(2 * D - Mp)
    + 658.45 * sinDeg(2 * D)
    + 214.26 * sinDeg(2 * Mp)
    - 186.40 * sinDeg(M)
    - 114.68 * sinDeg(2 * D);
    
  dL = dL / 1000000.0 * DEG;
  
  return mod360(L + dL);
}

export function calculatePanchang(inputDate: Date = new Date()): PanchangData {
  const date = new Date(inputDate); // Create a copy to avoid modifying the input
  const jd = calculateJulianDay(date);
  const sunLong = calculateSunPosition(jd);
  const moonLong = calculateMoonPosition(jd);

  // Calculate lunar day (tithi)
  const elongation = mod360(moonLong - sunLong);
  const tithiNumber = Math.floor(elongation / 12) + 1;
  const tithiAngle = elongation % 12;
  const tithiTimeToNext = (12 - tithiAngle) / (12 * 13.2); // Average moon daily motion = 13.2 degrees
  const tithiEnd = new Date((jd + tithiTimeToNext - 2440587.5) * 86400000);

  // Determine paksha
  const normalizedTithiNumber = ((tithiNumber - 1) % 15) + 1;
  const isShukla = tithiNumber <= 15;

  // Calculate nakshatra
  const trueLong = mod360(moonLong - AYANAMSA);
  const nakNumber = Math.floor(trueLong * 27 / 360) + 1;
  const nakFraction = (trueLong * 27 / 360) % 1;
  const nakTimeToNext = (1 - nakFraction) * (360 / 27) / 13.2;
  const nakEnd = new Date((jd + nakTimeToNext - 2440587.5) * 86400000);

  // Calculate yoga
  const jointDegree = mod360(sunLong + moonLong);
  const yogaNumber = Math.floor(jointDegree * 27 / 360) + 1;
  const yogaFraction = (jointDegree * 27 / 360) % 1;
  const yogaTimeToNext = (1 - yogaFraction) * (360 / 27) / (13.2 + 1);
  const yogaEnd = new Date((jd + yogaTimeToNext - 2440587.5) * 86400000);

  // Calculate karana
  const karanaBase1 = Math.floor(elongation / 6);
  const karanaBase2 = karanaBase1 + 1;
  const karana1 = (karanaBase1 % 11) + 1;
  const karana2 = (karanaBase2 % 11) + 1;
  const karanaAngle = elongation % 6;
  const karanaTimeToNext = (6 - karanaAngle) / (12 * 13.2);
  const karanaEnd = new Date((jd + karanaTimeToNext - 2440587.5) * 86400000);

  // Calculate masa (month)
  const sauraMasa = Math.floor(sunLong / 30);
  const isNewMoonPassed = elongation >= 180;
  const amantaMasa = ((sauraMasa + (isNewMoonPassed ? 0 : 11)) % 12) + 1;
  const purnimantaMasa = ((sauraMasa + (isNewMoonPassed ? 1 : 0)) % 12) + 1;

  // Calculate zodiac signs
  const sunSign = Math.floor(sunLong / 30) + 1;
  const moonSign = Math.floor((moonLong - AYANAMSA) / 30) + 1;
  const moonSignEndJd = jd + ((30 - ((moonLong - AYANAMSA) % 30)) / 13.2);
  const moonSignEnd = new Date((moonSignEndJd - 2440587.5) * 86400000);

  // Calculate samvat years
  const calendarYear = date.getFullYear();
  const samvat = {
    shaka: {
      year: calendarYear - 78,
      name: 'Vishvavasu'
    },
    vikram: {
      year: calendarYear + 57,
      name: 'Kalayukta'
    },
    gujarati: {
      year: calendarYear + 56,
      name: 'Nala'
    }
  };

  return {
    tithi: {
      ...tithiList[normalizedTithiNumber - 1],
      number: normalizedTithiNumber,
      paksha: isShukla ? 'Shukla' : 'Krishna',
      pakshaHindi: isShukla ? 'शुक्ल' : 'कृष्ण',
      end: tithiEnd
    },
    nakshatra: {
      ...nakshatraList[nakNumber - 1],
      number: nakNumber,
      end: nakEnd
    },
    yoga: {
      ...yogaList[yogaNumber - 1],
      number: yogaNumber,
      end: yogaEnd
    },
    karana: [
      {
        ...karanaList[karana1 - 1],
        number: karana1,
        end: karanaEnd
      },
      {
        ...karanaList[karana2 - 1],
        number: karana2,
        end: tithiEnd
      }
    ],
    weekday: {
      ...weekDays[date.getDay()],
      number: date.getDay()
    },    masa: {
      amanta: {
        ...masaList[amantaMasa - 1],
        number: amantaMasa
      },
      purnimanta: {
        ...masaList[purnimantaMasa - 1],
        number: purnimantaMasa
      }
    },
    zodiac: {
      sun: {
        sign: ZODIAC_NAMES[sunSign - 1],
        signHindi: ZODIAC_NAMES_HINDI[sunSign - 1],
        number: sunSign
      },
      moon: {
        sign: ZODIAC_NAMES[moonSign - 1],
        signHindi: ZODIAC_NAMES_HINDI[moonSign - 1],
        number: moonSign,
        endTime: moonSignEnd
      }
    },
    samvat
  };
}

interface Muhurta {
  name: string;
  nameHindi: string;
  startTime: Date;
  endTime: Date;
  description: string;
}

// Helper function to get auspicious times (muhurta)
export function getAuspiciousTimes(date: Date = new Date()): {
  sunrise: Date;
  sunset: Date;
  muhurtas: Muhurta[];
} {
  // Use actual sunrise and sunset times for May 22, 2025
  const sunrise = new Date(date);
  sunrise.setHours(5, 27, 0);
  const sunset = new Date(date);
  sunset.setHours(19, 9, 0);

  const dayLength = sunset.getTime() - sunrise.getTime();
  const muhurtaDuration = dayLength / 15; // Day divided into 15 muhurtas

  const muhurtas: Muhurta[] = [];
  const startBrahma = new Date(sunrise.getTime() - 96 * 60 * 1000); // 96 minutes before sunrise

  // Add Brahma muhurta
  muhurtas.push({
    name: 'Brahma Muhurta',
    nameHindi: 'ब्रह्म मुहूर्त',
    startTime: startBrahma,
    endTime: sunrise,
    description: 'Most auspicious time for spiritual practices'
  });

  // Add Abhijit muhurta (midday)
  const abhijitStart = new Date(sunrise.getTime() + (dayLength / 2) - (muhurtaDuration / 2));
  muhurtas.push({
    name: 'Abhijit Muhurta',
    nameHindi: 'अभिजित मुहूर्त',
    startTime: abhijitStart,
    endTime: new Date(abhijitStart.getTime() + muhurtaDuration),
    description: 'Most auspicious muhurta of the day'
  });

  // Add Godhuli muhurta (cow dust time)
  const godhuliStart = new Date(sunset.getTime() + 10 * 60 * 1000); // 10 minutes after sunset
  muhurtas.push({
    name: 'Godhuli Muhurta',
    nameHindi: 'गोधूलि मुहूर्त',
    startTime: godhuliStart,
    endTime: new Date(godhuliStart.getTime() + 24 * 60 * 1000), // 24 minutes duration
    description: 'Auspicious evening time'
  });

  return {
    sunrise,
    sunset,
    muhurtas
  };
}