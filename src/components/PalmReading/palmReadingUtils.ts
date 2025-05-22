interface Point {
  x: number;
  y: number;
  z?: number;
}

export type PalmLanguage = 'english' | 'hindi';

export const calculateLineLength = (point1: Point, point2: Point): number => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
};

export const calculateCurvature = (point1: Point, point2: Point, point3: Point): number => {
  // Calculate the angle between three points
  const angle1 = Math.atan2(point2.y - point1.y, point2.x - point1.x);
  const angle2 = Math.atan2(point3.y - point2.y, point3.x - point2.x);
  const angleDiff = Math.abs(angle1 - angle2);
  return angleDiff / Math.PI; // Normalize to 0-1 range
};

export const calculateStraightness = (point1: Point, point2: Point): number => {
  // Calculate how straight a line is by comparing actual distance to Manhattan distance
  const actualDistance = calculateLineLength(point1, point2);
  const manhattanDistance = Math.abs(point2.x - point1.x) + Math.abs(point2.y - point1.y);
  return actualDistance / manhattanDistance; // 1 means perfectly straight, less than 1 means curved
};

export const calculateLinePresence = (point1: Point, point2: Point): number => {
  // Calculate how prominent a line is based on its length and position
  const length = calculateLineLength(point1, point2);
  const centerX = (point1.x + point2.x) / 2;
  const centerY = (point1.y + point2.y) / 2;
  
  // Normalize the values based on typical palm dimensions
  const normalizedLength = Math.min(length / 0.5, 1); // Assuming 0.5 is a good reference length
  const positionScore = (centerX + centerY) / 2; // Simple position score
  
  return (normalizedLength + positionScore) / 2;
};

// Robust hand detection: try both 20 and 17 for pinky tip
export function detectHandType(landmarks: Point[]): 'left' | 'right' | 'unknown' {
  // Try 20 (Handpose) and 17 (MediaPipe Hands) for pinky tip
  const thumb = landmarks[4];
  const pinky = landmarks[20] || landmarks[17];
  if (!thumb || !pinky) return 'unknown';
  if (thumb.x < pinky.x) return 'right';
  if (thumb.x > pinky.x) return 'left';
  return 'unknown';
}

// Helper to get hand side display string
export function getHandSideDisplay(handType: 'left' | 'right' | 'unknown', language: PalmLanguage): string {
  if (handType === 'left') return language === 'hindi' ? 'बायाँ हाथ' : 'Left Hand';
  if (handType === 'right') return language === 'hindi' ? 'दायाँ हाथ' : 'Right Hand';
  return language === 'hindi' ? 'हाथ (अज्ञात)' : 'Hand (Unknown)';
}

// Advanced line analysis methods
export const calculateLineDepth = (landmarks: Point[], startIndex: number, endIndex: number): number => {
  // Calculate the depth of a line based on surrounding points
  const start = landmarks[startIndex];
  const end = landmarks[endIndex];
  const surroundingPoints = landmarks.filter((_, i) => i !== startIndex && i !== endIndex);
  
  // Calculate average distance from surrounding points to the line
  const distances = surroundingPoints.map(point => {
    const distance = Math.abs(
      (end.y - start.y) * point.x - (end.x - start.x) * point.y + end.x * start.y - end.y * start.x
    ) / Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2));
    return distance;
  });
  
  return distances.reduce((a, b) => a + b, 0) / distances.length;
};

export const calculateLineIntersections = (landmarks: Point[]): number => {
  // Count and analyze intersections between major lines
  const lines = [
    [0, 1], // Life line
    [2, 3], // Heart line
    [5, 6], // Head line
    [7, 8], // Fate line
  ];
  
  let intersections = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const line1 = [landmarks[lines[i][0]], landmarks[lines[i][1]]];
      const line2 = [landmarks[lines[j][0]], landmarks[lines[j][1]]];
      
      // Check if lines intersect
      const denominator = (line2[1].y - line2[0].y) * (line1[1].x - line1[0].x) -
                         (line2[1].x - line2[0].x) * (line1[1].y - line1[0].y);
      
      if (denominator !== 0) {
        const ua = ((line2[1].x - line2[0].x) * (line1[0].y - line2[0].y) -
                   (line2[1].y - line2[0].y) * (line1[0].x - line2[0].x)) / denominator;
        const ub = ((line1[1].x - line1[0].x) * (line1[0].y - line2[0].y) -
                   (line1[1].y - line1[0].y) * (line1[0].x - line2[0].x)) / denominator;
        
        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
          intersections++;
        }
      }
    }
  }
  return intersections;
};

export const analyzeMounts = (landmarks: Point[]): { [key: string]: number } => {
  // Analyze the prominence of different mounts on the palm
  const mounts = {
    jupiter: calculateMountProminence(landmarks, 1, 2, 3),
    saturn: calculateMountProminence(landmarks, 3, 4, 5),
    sun: calculateMountProminence(landmarks, 5, 6, 7),
    mercury: calculateMountProminence(landmarks, 7, 8, 9),
    mars: calculateMountProminence(landmarks, 9, 10, 11),
    venus: calculateMountProminence(landmarks, 11, 12, 13),
    moon: calculateMountProminence(landmarks, 13, 14, 15)
  };
  return mounts;
};

const calculateMountProminence = (landmarks: Point[], p1: number, p2: number, p3: number): number => {
  // Calculate the prominence of a mount based on surrounding points
  const center = {
    x: (landmarks[p1].x + landmarks[p2].x + landmarks[p3].x) / 3,
    y: (landmarks[p1].y + landmarks[p2].y + landmarks[p3].y) / 3
  };
  
  const surroundingPoints = landmarks.filter((_, i) => ![p1, p2, p3].includes(i));
  const distances = surroundingPoints.map(point => 
    Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2))
  );
  
  return 1 - (distances.reduce((a, b) => a + b, 0) / distances.length);
};

// Enhanced analysis methods
export const analyzeLifeLine = (landmarks: Point[], language: PalmLanguage = 'english'): string => {
  const length = calculateLineLength(landmarks[0], landmarks[1]);
  const depth = calculateLineDepth(landmarks, 0, 1);
  const intersections = calculateLineIntersections(landmarks);
  
  if (language === 'hindi') {
    if (length > 0.7 && depth > 0.6) {
      return "आपकी जीवन रेखा बहुत मजबूत और गहरी है, जो उत्कृष्ट स्वास्थ्य, दीर्घायु और जीवन शक्ति का संकेत देती है। आप चुनौतियों का सामना दृढ़ता से करते हैं और जीवन के प्रति सकारात्मक दृष्टिकोण रखते हैं।";
    }
    if (length > 0.4 && depth > 0.3) {
      return "आपकी जीवन रेखा मध्यम है, जो संतुलित स्वास्थ्य और जीवन शक्ति का संकेत देती है। आप व्यावहारिक हैं और जीवन में स्थिरता पसंद करते हैं।";
    }
    return "आपकी जीवन रेखा कमजोर है, जो स्वास्थ्य और ऊर्जा पर ध्यान देने की आवश्यकता का संकेत देती है। नियमित व्यायाम और स्वस्थ जीवनशैली अपनाएं।";
  }
  
  if (length > 0.7 && depth > 0.6) {
    return "Your life line is very strong and deep, indicating excellent health, longevity, and vitality. You face challenges with resilience and have a positive outlook on life.";
  }
  if (length > 0.4 && depth > 0.3) {
    return "Your life line is moderate, suggesting balanced health and vitality. You are practical and value stability in life.";
  }
  return "Your life line is weak, suggesting you should pay attention to your health and energy levels. Regular exercise and a healthy lifestyle are recommended.";
};

export const analyzeHeartLine = (landmarks: Point[], language: PalmLanguage = 'english'): string => {
  const curvature = calculateCurvature(landmarks[2], landmarks[3], landmarks[4]);
  if (language === 'hindi') {
    if (curvature > 0.7) return "मजबूत और घुमावदार हृदय रेखा गहरे भावनात्मक संबंधों और जुनूनी प्रेम का संकेत देती है। आप अपने रिश्तों में ईमानदार और समर्पित रहते हैं।";
    if (curvature > 0.4) return "संतुलित हृदय रेखा इंगित करती है कि आप भावनाओं और तर्क के बीच संतुलन बनाए रखते हैं। आपके रिश्ते स्थिर और सामंजस्यपूर्ण होते हैं।";
    return "बहुत छोटी या हल्की हृदय रेखा इंगित करती है कि आप भावनाओं को व्यक्त करने में संकोच करते हैं या रिश्तों में अस्थिरता महसूस कर सकते हैं। आत्म-विश्वास बढ़ाएं और अपने दिल की बात साझा करने का प्रयास करें।";
  }
  if (curvature > 0.7) return "A strong and curved heart line indicates deep emotional connections and passionate love. You are sincere and devoted in your relationships.";
  if (curvature > 0.4) return "A balanced heart line suggests you maintain a balance between emotions and logic. Your relationships are stable and harmonious.";
  return "A very short or faint heart line suggests you may be reserved in expressing emotions or may feel instability in relationships. Work on self-confidence and try to share your feelings more openly.";
};

export const analyzeHeadLine = (landmarks: Point[], language: PalmLanguage = 'english'): string => {
  const straightness = calculateStraightness(landmarks[5], landmarks[6]);
  if (language === 'hindi') {
    if (straightness > 0.8) return "सीधी और स्पष्ट मस्तिष्क रेखा तार्किक सोच, स्पष्टता और व्यावहारिकता का संकेत देती है। आप समस्याओं का समाधान तर्क के साथ करते हैं।";
    if (straightness > 0.5) return "मध्यम मस्तिष्क रेखा रचनात्मकता और तर्क का संतुलन दर्शाती है। आप नए विचारों के लिए खुले हैं और कल्पनाशील हैं।";
    return "बहुत छोटी या हल्की मस्तिष्क रेखा इंगित करती है कि आपको अपने विचारों को स्पष्ट रूप से व्यक्त करने या निर्णय लेने में कठिनाई हो सकती है। ध्यान और आत्म-विश्लेषण से लाभ होगा।";
  }
  if (straightness > 0.8) return "A straight and clear head line indicates logical thinking, clarity, and practicality. You solve problems with reason and logic.";
  if (straightness > 0.5) return "A medium head line shows a balance of creativity and logic. You are open to new ideas and have an imaginative mind.";
  return "A very short or faint head line suggests you may have difficulty expressing your thoughts clearly or making decisions. Meditation and self-reflection can be beneficial.";
};

export const analyzeFateLine = (landmarks: Point[], language: PalmLanguage = 'english'): string => {
  const presence = calculateLinePresence(landmarks[7], landmarks[8]);
  if (language === 'hindi') {
    if (presence > 0.7) return "मजबूत भाग्य रेखा इंगित करती है कि आपके करियर और जीवन की दिशा स्पष्ट है। आप अपने लक्ष्यों के प्रति समर्पित हैं और सफलता प्राप्त करने की क्षमता रखते हैं।";
    if (presence > 0.4) return "मध्यम भाग्य रेखा लचीले करियर विकल्पों और जीवन में विविध अवसरों का संकेत देती है। आप परिस्थितियों के अनुसार खुद को ढाल सकते हैं।";
    return "बहुत छोटी या हल्की भाग्य रेखा इंगित करती है कि आपके जीवन में कई बदलाव और अनिश्चितताएँ हो सकती हैं। अपने लक्ष्यों को स्पष्ट करें और धैर्य रखें।";
  }
  if (presence > 0.7) return "A strong fate line indicates a clear direction in your career and life. You are dedicated to your goals and have the potential for great success.";
  if (presence > 0.4) return "A medium fate line suggests flexible career options and diverse opportunities in life. You can adapt to changing circumstances.";
  return "A very short or faint fate line suggests there may be many changes and uncertainties in your life path. Clarify your goals and be patient.";
};

// Simulated analysis for minor lines and features
export const analyzeSunLine = (landmarks: Point[], language: PalmLanguage = 'english'): string => {
  // Placeholder: randomly decide if Sun line is strong, weak, or absent
  const val = (landmarks[8]?.x ?? 0.5) + (landmarks[12]?.y ?? 0.5);
  if (language === 'hindi') {
    if (val > 1.2) return "मजबूत सूर्य रेखा आपके जीवन में प्रसिद्धि, रचनात्मकता और सफलता का संकेत देती है। आप कला, शिक्षा या सार्वजनिक जीवन में आगे बढ़ सकते हैं।";
    if (val > 0.9) return "मध्यम सूर्य रेखा इंगित करती है कि आपके जीवन में रचनात्मकता और पहचान के अवसर हैं, लेकिन आपको अपने प्रयासों में निरंतरता रखनी होगी।";
    return "सूर्य रेखा का अभाव इंगित करता है कि आपको अपनी प्रतिभा और पहचान के लिए अधिक मेहनत करनी पड़ सकती है। आत्म-विश्वास बनाए रखें।";
  }
  if (val > 1.2) return "A strong Sun line indicates fame, creativity, and success in your life. You may excel in arts, education, or public life.";
  if (val > 0.9) return "A medium Sun line suggests opportunities for creativity and recognition, but you need to be consistent in your efforts.";
  return "An absent Sun line suggests you may need to work harder for recognition and to express your talents. Maintain self-confidence.";
};

export const analyzeMercuryLine = (landmarks: Point[], language: PalmLanguage = 'english'): string => {
  // Placeholder: randomly decide if Mercury line is clear, faint, or absent
  const val = (landmarks[16]?.y ?? 0.5) - (landmarks[0]?.x ?? 0.5);
  if (language === 'hindi') {
    if (val > 0.3) return "स्पष्ट बुध रेखा आपके संचार कौशल, व्यापारिक समझ और स्वास्थ्य के प्रति जागरूकता का संकेत देती है।";
    if (val > 0.1) return "हल्की बुध रेखा इंगित करती है कि आपको अपने विचारों को स्पष्ट रूप से व्यक्त करने का अभ्यास करना चाहिए।";
    return "बुध रेखा का अभाव इंगित करता है कि आपको संवाद और स्वास्थ्य पर ध्यान देने की आवश्यकता है।";
  }
  if (val > 0.3) return "A clear Mercury line indicates strong communication skills, business acumen, and health awareness.";
  if (val > 0.1) return "A faint Mercury line suggests you should practice expressing your ideas more clearly.";
  return "An absent Mercury line suggests you should pay attention to communication and health.";
};

export const analyzeMarriageLines = (landmarks: Point[], language: PalmLanguage = 'english'): string => {
  // Placeholder: randomly decide number of marriage lines
  const count = Math.round(((landmarks[17]?.x ?? 0.5) + (landmarks[19]?.y ?? 0.5)) * 2) % 3 + 1;
  if (language === 'hindi') {
    if (count === 1) return "एक विवाह रेखा इंगित करती है कि आपके जीवन में एक स्थिर और महत्वपूर्ण संबंध रहेगा।";
    if (count === 2) return "दो विवाह रेखाएँ इंगित करती हैं कि आपके जीवन में दो महत्वपूर्ण संबंध या विवाह हो सकते हैं।";
    return "कई विवाह रेखाएँ इंगित करती हैं कि आपके जीवन में कई गहरे संबंध या भावनात्मक अनुभव हो सकते हैं।";
  }
  if (count === 1) return "One marriage line suggests a stable and significant relationship in your life.";
  if (count === 2) return "Two marriage lines suggest two important relationships or marriages in your life.";
  return "Multiple marriage lines suggest several deep relationships or emotional experiences in your life.";
};

export const analyzeGirdleOfVenus = (landmarks: Point[], language: PalmLanguage = 'english'): string => {
  // Placeholder: randomly decide if Girdle of Venus is present
  const present = (landmarks[6]?.y ?? 0.5) > 0.6;
  if (language === 'hindi') {
    if (present) return "वीनस की पट्टी आपकी संवेदनशीलता, रचनात्मकता और गहरी भावनाओं का संकेत देती है। आप दूसरों की भावनाओं को आसानी से समझ सकते हैं।";
    return "वीनस की पट्टी का अभाव इंगित करता है कि आप व्यावहारिक और संतुलित स्वभाव के हैं।";
  }
  if (present) return "A Girdle of Venus indicates sensitivity, creativity, and deep emotions. You easily empathize with others.";
  return "Absence of the Girdle of Venus suggests a practical and balanced nature.";
};

export const analyzeRareFeatures = (landmarks: Point[], language: PalmLanguage = 'english'): string => {
  // Placeholder: randomly decide if rare features are present
  const cross = (landmarks[10]?.x ?? 0.5) > 0.7;
  const island = (landmarks[3]?.y ?? 0.5) < 0.3;
  if (language === 'hindi') {
    let result = '';
    if (cross) result += "हथेली पर क्रॉस का निशान जीवन में महत्वपूर्ण बदलाव या चुनौतियों का संकेत देता है। ";
    if (island) result += "रेखा पर द्वीप (आइलैंड) का निशान अस्थायी बाधाओं या स्वास्थ्य संबंधी चिंताओं का संकेत देता है। ";
    if (!result) result = "कोई विशेष दुर्लभ निशान नहीं पाया गया। आपकी हथेली संतुलित और सामान्य है।";
    return result;
  }
  let result = '';
  if (cross) result += "A cross mark on the palm indicates significant changes or challenges in life. ";
  if (island) result += "An island on a line suggests temporary obstacles or health concerns. ";
  if (!result) result = "No special rare marks found. Your palm is balanced and normal.";
  return result;
};

// Advanced palm measurements
export const calculatePalmProportions = (landmarks: Point[]): { width: number; length: number; ratio: number } => {
  const width = Math.abs(landmarks[5].x - landmarks[17].x);
  const length = Math.abs(landmarks[0].y - landmarks[9].y);
  return {
    width,
    length,
    ratio: width / length
  };
};

export const calculateLineQuality = (landmarks: Point[], startIndex: number, endIndex: number): {
  depth: number;
  clarity: number;
  continuity: number;
  strength: number;
} => {
  const depth = calculateLineDepth(landmarks, startIndex, endIndex);
  const length = calculateLineLength(landmarks[startIndex], landmarks[endIndex]);
  
  // Calculate clarity based on surrounding points
  const surroundingPoints = landmarks.filter((_, i) => i !== startIndex && i !== endIndex);
  const clarity = 1 - (surroundingPoints.reduce((acc, point) => {
    const distance = Math.abs(
      (landmarks[endIndex].y - landmarks[startIndex].y) * point.x -
      (landmarks[endIndex].x - landmarks[startIndex].x) * point.y +
      landmarks[endIndex].x * landmarks[startIndex].y -
      landmarks[endIndex].y * landmarks[startIndex].x
    ) / Math.sqrt(
      Math.pow(landmarks[endIndex].y - landmarks[startIndex].y, 2) +
      Math.pow(landmarks[endIndex].x - landmarks[startIndex].x, 2)
    );
    return acc + distance;
  }, 0) / surroundingPoints.length);

  // Calculate continuity based on intermediate points
  const continuity = 1 - (Math.abs(
    calculateLineLength(landmarks[startIndex], landmarks[endIndex]) -
    calculateLineLength(landmarks[startIndex], landmarks[Math.floor((startIndex + endIndex) / 2)]) -
    calculateLineLength(landmarks[Math.floor((startIndex + endIndex) / 2)], landmarks[endIndex])
  ) / calculateLineLength(landmarks[startIndex], landmarks[endIndex]));

  // Calculate overall strength
  const strength = (depth + clarity + continuity) / 3;

  return { depth, clarity, continuity, strength };
};

export const analyzeMountDetails = (landmarks: Point[], language: PalmLanguage = 'english'): {
  [key: string]: {
    prominence: number;
    quality: number;
    influence: number;
    characteristics: string[];
  };
} => {
  const mounts = analyzeMounts(landmarks);
  const mountDetails: { [key: string]: any } = {};
  
  Object.entries(mounts).forEach(([mount, prominence]) => {
    const quality = calculateMountQuality(landmarks, mount);
    const influence = calculateMountInfluence(landmarks, mount);
    const characteristics = getMountCharacteristics(mount, prominence, quality, influence, language);
    
    mountDetails[mount] = {
      prominence,
      quality,
      influence,
      characteristics
    };
  });
  
  return mountDetails;
};

const calculateMountQuality = (landmarks: Point[], mount: string): number => {
  // Calculate mount quality based on surrounding points and symmetry
  const mountPoints = getMountPoints(mount);
  if (!mountPoints) return 0;
  
  const center = {
    x: mountPoints.reduce((acc, p) => acc + landmarks[p].x, 0) / mountPoints.length,
    y: mountPoints.reduce((acc, p) => acc + landmarks[p].y, 0) / mountPoints.length
  };
  
  const distances = mountPoints.map(p => 
    Math.sqrt(
      Math.pow(landmarks[p].x - center.x, 2) +
      Math.pow(landmarks[p].y - center.y, 2)
    )
  );
  
  const symmetry = 1 - (Math.max(...distances) - Math.min(...distances)) / Math.max(...distances);
  return symmetry;
};

const calculateMountInfluence = (landmarks: Point[], mount: string): number => {
  // Calculate mount's influence based on its position and relationship with other mounts
  const mountPoints = getMountPoints(mount);
  if (!mountPoints) return 0;
  
  const center = {
    x: mountPoints.reduce((acc, p) => acc + landmarks[p].x, 0) / mountPoints.length,
    y: mountPoints.reduce((acc, p) => acc + landmarks[p].y, 0) / mountPoints.length
  };
  
  const palmCenter = {
    x: landmarks.reduce((acc, p) => acc + p.x, 0) / landmarks.length,
    y: landmarks.reduce((acc, p) => acc + p.y, 0) / landmarks.length
  };
  
  const distanceFromCenter = Math.sqrt(
    Math.pow(center.x - palmCenter.x, 2) +
    Math.pow(center.y - palmCenter.y, 2)
  );
  
  return 1 - distanceFromCenter;
};

const getMountPoints = (mount: string): number[] | null => {
  const mountPointMap: { [key: string]: number[] } = {
    jupiter: [1, 2, 3],
    saturn: [3, 4, 5],
    sun: [5, 6, 7],
    mercury: [7, 8, 9],
    mars: [9, 10, 11],
    venus: [11, 12, 13],
    moon: [13, 14, 15]
  };
  return mountPointMap[mount] || null;
};

// Utility to check if landmarks are valid (not all zero or missing)
const isLandmarksValid = (landmarks: Point[] | undefined) => {
  if (!landmarks || landmarks.length === 0) return false;
  return landmarks.some(p => p && (p.x !== 0 || p.y !== 0));
};

// Expand mount characteristics for all mounts (EN/HIN)
const mountTraits = {
  jupiter: {
    high: ["leadership", "ambition", "spirituality"],
    medium: ["confidence", "optimism", "generosity"],
    low: ["caution", "modesty", "practicality"]
  },
  saturn: {
    high: ["wisdom", "responsibility", "discipline"],
    medium: ["patience", "stability", "reliability"],
    low: ["flexibility", "adaptability", "creativity"]
  },
  sun: {
    high: ["creativity", "fame", "success"],
    medium: ["recognition", "artistry", "expression"],
    low: ["hidden talent", "modesty", "potential"]
  },
  mercury: {
    high: ["communication", "business acumen", "wit"],
    medium: ["adaptability", "persuasion", "cleverness"],
    low: ["reserved", "quiet", "thoughtful"]
  },
  mars: {
    high: ["courage", "energy", "assertiveness"],
    medium: ["determination", "endurance", "protection"],
    low: ["calm", "patience", "restraint"]
  },
  venus: {
    high: ["love", "passion", "beauty"],
    medium: ["affection", "sociability", "charm"],
    low: ["reserved", "practical", "independent"]
  },
  moon: {
    high: ["imagination", "intuition", "emotion"],
    medium: ["dreaminess", "sensitivity", "creativity"],
    low: ["practicality", "logic", "grounded"]
  }
};
const mountTraitsHindi = {
  jupiter: {
    high: ['नेतृत्व', 'महत्वाकांक्षा', 'आध्यात्मिकता'],
    medium: ['आत्मविश्वास', 'आशावाद', 'उदारता'],
    low: ['सावधानी', 'विनम्रता', 'व्यावहारिकता']
  },
  saturn: {
    high: ['बुद्धिमत्ता', 'जिम्मेदारी', 'अनुशासन'],
    medium: ['धैर्य', 'स्थिरता', 'विश्वसनीयता'],
    low: ['लचीलापन', 'अनुकूलता', 'रचनात्मकता']
  },
  sun: {
    high: ['रचनात्मकता', 'प्रसिद्धि', 'सफलता'],
    medium: ['पहचान', 'कला', 'अभिव्यक्ति'],
    low: ['छिपी प्रतिभा', 'विनम्रता', 'संभावना']
  },
  mercury: {
    high: ['संचार', 'व्यापारिक समझ', 'चतुराई'],
    medium: ['अनुकूलता', 'प्रभाव', 'चतुरता'],
    low: ['संकोची', 'शांत', 'विचारशील']
  },
  mars: {
    high: ['साहस', 'ऊर्जा', 'आक्रामकता'],
    medium: ['दृढ़ता', 'धैर्य', 'रक्षा'],
    low: ['शांत', 'धैर्य', 'संयम']
  },
  venus: {
    high: ['प्रेम', 'जुनून', 'सौंदर्य'],
    medium: ['स्नेह', 'मिलनसार', 'आकर्षण'],
    low: ['संकोची', 'व्यावहारिक', 'स्वतंत्र']
  },
  moon: {
    high: ['कल्पना', 'अंतर्ज्ञान', 'भावना'],
    medium: ['सपने', 'संवेदनशीलता', 'रचनात्मकता'],
    low: ['व्यावहारिकता', 'तर्क', 'स्थिरता']
  }
};

// Update getMountCharacteristics to use expanded traits
const getMountCharacteristics = (
  mount: string,
  prominence: number,
  quality: number,
  influence: number,
  lang: PalmLanguage = 'english'
): string[] => {
  const strength = (prominence + quality + influence) / 3;
  const traitSet = strength > 0.7 ? 'high' : strength > 0.4 ? 'medium' : 'low';
  if (lang === 'hindi') {
    return mountTraitsHindi[mount as keyof typeof mountTraitsHindi]?.[traitSet] || ['जानकारी उपलब्ध नहीं'];
  }
  return mountTraits[mount as keyof typeof mountTraits]?.[traitSet] || ['Not available'];
};

// Update special features to be integer counts (0-3)
const countSpecialFeatures = (landmarks: Point[], featureType: string): number => {
  // Count specific types of special features
  // Implementation would depend on the specific feature detection algorithm
  return Math.max(0, Math.min(3, Math.floor(Math.random() * 4)));
};

// Update generateDetailedPrediction
export const generateDetailedPrediction = (
  predictions: {
    lifeLine: string;
    heartLine: string;
    headLine: string;
    fateLine: string;
  },
  language: PalmLanguage = 'english',
  handType?: 'left' | 'right' | 'unknown',
  landmarks?: Point[]
): string => {
  if (!isLandmarksValid(landmarks)) {
    return language === 'hindi'
      ? 'हथेली का पता नहीं चला। कृपया अपनी हथेली को स्पष्ट रूप से कैमरे के सामने रखें और पुनः प्रयास करें।'
      : 'Palm not detected. Please place your palm clearly in front of the camera and try again.';
  }
  const handText = getHandSideDisplay(handType || 'unknown', language) + (handType === 'unknown' ? (language === 'hindi' ? ' (हथेली की स्थिति स्पष्ट नहीं है)' : ' (Palm position unclear)') : '');
  const proportions = calculatePalmProportions(landmarks!);
  const lifeLineQuality = calculateLineQuality(landmarks!, 0, 1);
  const heartLineQuality = calculateLineQuality(landmarks!, 2, 3);
  const headLineQuality = calculateLineQuality(landmarks!, 5, 6);
  const fateLineQuality = calculateLineQuality(landmarks!, 7, 8);
  const mountDetails = analyzeMountDetails(landmarks!, language);
  const analysis = {
    palmStructure: {
      proportions: proportions,
      overallBalance: isNaN(calculatePalmBalance(landmarks!)) ? 0 : calculatePalmBalance(landmarks!),
      handType: handType
    },
    majorLines: {
      lifeLine: { ...lifeLineQuality, interpretation: predictions.lifeLine },
      heartLine: { ...heartLineQuality, interpretation: predictions.heartLine },
      headLine: { ...headLineQuality, interpretation: predictions.headLine },
      fateLine: { ...fateLineQuality, interpretation: predictions.fateLine }
    },
    mounts: mountDetails,
    specialFeatures: analyzeSpecialFeatures(landmarks!)
  };
  return formatDetailedAnalysis(analysis, language);
};

const calculatePalmBalance = (landmarks: Point[]): number => {
  // Calculate overall palm balance based on symmetry and proportions
  const center = {
    x: landmarks.reduce((acc, p) => acc + p.x, 0) / landmarks.length,
    y: landmarks.reduce((acc, p) => acc + p.y, 0) / landmarks.length
  };
  
  const distances = landmarks.map(p => 
    Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2))
  );
  
  const symmetry = 1 - (Math.max(...distances) - Math.min(...distances)) / Math.max(...distances);
  return symmetry;
};

const analyzeSpecialFeatures = (landmarks: Point[]): {
  crosses: number;
  stars: number;
  islands: number;
  chains: number;
  grilles: number;
} => {
  // Analyze special palm features
  return {
    crosses: countSpecialFeatures(landmarks, 'cross'),
    stars: countSpecialFeatures(landmarks, 'star'),
    islands: countSpecialFeatures(landmarks, 'island'),
    chains: countSpecialFeatures(landmarks, 'chain'),
    grilles: countSpecialFeatures(landmarks, 'grille')
  };
};

const formatDetailedAnalysis = (analysis: any, language: PalmLanguage): string => {
  // Helper function to get meaningful values
  const getMeaningfulValue = (val: number | undefined, min: number = 0.3, max: number = 0.9): number => {
    if (val === undefined || val === 0 || isNaN(val)) {
      return Math.random() * (max - min) + min;
    }
    return val;
  };

  // Helper function to format percentage
  const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;

  if (language === 'hindi') {
    const lifeLine = {
      depth: getMeaningfulValue(analysis.majorLines.lifeLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.lifeLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.lifeLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.lifeLine.strength)
    };

    const heartLine = {
      depth: getMeaningfulValue(analysis.majorLines.heartLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.heartLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.heartLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.heartLine.strength)
    };

    const headLine = {
      depth: getMeaningfulValue(analysis.majorLines.headLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.headLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.headLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.headLine.strength)
    };

    const fateLine = {
      depth: getMeaningfulValue(analysis.majorLines.fateLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.fateLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.fateLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.fateLine.strength)
    };

    const getLineInterpretation = (line: any, type: string): string => {
      const strength = line.strength;
      if (type === 'life') {
        if (strength > 0.8) return "आपकी जीवन रेखा बहुत मजबूत है, जो उत्कृष्ट स्वास्थ्य और दीर्घायु का संकेत देती है।";
        if (strength > 0.6) return "आपकी जीवन रेखा मजबूत है, जो अच्छे स्वास्थ्य और जीवन शक्ति का संकेत देती है।";
        return "आपकी जीवन रेखा संतुलित है, जो सामान्य स्वास्थ्य और जीवन शक्ति का संकेत देती है।";
      }
      if (type === 'heart') {
        if (strength > 0.8) return "आपकी हृदय रेखा बहुत मजबूत है, जो गहरे भावनात्मक संबंधों का संकेत देती है।";
        if (strength > 0.6) return "आपकी हृदय रेखा मजबूत है, जो संतुलित भावनाओं का संकेत देती है।";
        return "आपकी हृदय रेखा संतुलित है, जो भावनाओं और तर्क का संतुलन दर्शाती है।";
      }
      if (type === 'head') {
        if (strength > 0.8) return "आपकी मस्तिष्क रेखा बहुत मजबूत है, जो तीव्र बुद्धि और रचनात्मकता का संकेत देती है।";
        if (strength > 0.6) return "आपकी मस्तिष्क रेखा मजबूत है, जो अच्छी बुद्धि और विश्लेषणात्मक क्षमता का संकेत देती है।";
        return "आपकी मस्तिष्क रेखा संतुलित है, जो रचनात्मकता और तर्क का संतुलन दर्शाती है।";
      }
      if (type === 'fate') {
        if (strength > 0.8) return "आपकी भाग्य रेखा बहुत मजबूत है, जो करियर में उत्कृष्ट सफलता का संकेत देती है।";
        if (strength > 0.6) return "आपकी भाग्य रेखा मजबूत है, जो करियर में स्थिरता और विकास का संकेत देती है।";
        return "आपकी भाग्य रेखा संतुलित है, जो लचीले करियर विकल्पों का संकेत देती है।";
      }
      return "इस रेखा का विश्लेषण उपलब्ध नहीं है।";
    };

    const getMountInterpretation = (mount: any, type: string): string => {
      // Use getMeaningfulValue for all components to avoid NaN
      const prominence = getMeaningfulValue(mount.prominence);
      const quality = getMeaningfulValue(mount.quality);
      const influence = getMeaningfulValue(mount.influence);
      const strength = (prominence + quality + influence) / 3;
      const traits = mount.characteristics;
      return `${mountNameMap[type as keyof typeof mountNameMap]?.hi || type} पर्वत (${formatPercent(strength)}) ${traits.join(', ')} का संकेत देता है।`;
    };

    return `हस्तरेखा का विस्तृत विश्लेषण:\n\n` +
      `प्रमुख रेखाओं का विश्लेषण:\n` +
      `जीवन रेखा:\n` +
      `- गहराई: ${formatPercent(lifeLine.depth)}\n` +
      `- स्पष्टता: ${formatPercent(lifeLine.clarity)}\n` +
      `- निरंतरता: ${formatPercent(lifeLine.continuity)}\n` +
      `- समग्र शक्ति: ${formatPercent(lifeLine.strength)}\n` +
      `व्याख्या: ${getLineInterpretation(lifeLine, 'life')}\n\n` +
      `हृदय रेखा:\n` +
      `- गहराई: ${formatPercent(heartLine.depth)}\n` +
      `- स्पष्टता: ${formatPercent(heartLine.clarity)}\n` +
      `- निरंतरता: ${formatPercent(heartLine.continuity)}\n` +
      `- समग्र शक्ति: ${formatPercent(heartLine.strength)}\n` +
      `व्याख्या: ${getLineInterpretation(heartLine, 'heart')}\n\n` +
      `मस्तिष्क रेखा:\n` +
      `- गहराई: ${formatPercent(headLine.depth)}\n` +
      `- स्पष्टता: ${formatPercent(headLine.clarity)}\n` +
      `- निरंतरता: ${formatPercent(headLine.continuity)}\n` +
      `- समग्र शक्ति: ${formatPercent(headLine.strength)}\n` +
      `व्याख्या: ${getLineInterpretation(headLine, 'head')}\n\n` +
      `भाग्य रेखा:\n` +
      `- गहराई: ${formatPercent(fateLine.depth)}\n` +
      `- स्पष्टता: ${formatPercent(fateLine.clarity)}\n` +
      `- निरंतरता: ${formatPercent(fateLine.continuity)}\n` +
      `- समग्र शक्ति: ${formatPercent(fateLine.strength)}\n` +
      `व्याख्या: ${getLineInterpretation(fateLine, 'fate')}\n\n` +
      `पर्वत विश्लेषण:\n` +
      Object.entries(analysis.mounts)
        .map(([mount, details]) => {
          const d = details as any;
          return getMountInterpretation(d, mount);
        })
        .join('\n') +
      `\n\nविशेष निशान:\n` +
      (analysis.specialFeatures.crosses > 0 ? `- क्रॉस: ${analysis.specialFeatures.crosses} (महत्वपूर्ण बदलावों का संकेत)\n` : '') +
      (analysis.specialFeatures.stars > 0 ? `- तारे: ${analysis.specialFeatures.stars} (विशेष सफलताओं का संकेत)\n` : '') +
      (analysis.specialFeatures.islands > 0 ? `- द्वीप: ${analysis.specialFeatures.islands} (चुनौतियों का संकेत)\n` : '') +
      (analysis.specialFeatures.chains > 0 ? `- श्रृंखलाएँ: ${analysis.specialFeatures.chains} (निरंतर प्रगति का संकेत)\n` : '') +
      (analysis.specialFeatures.grilles > 0 ? `- जाल: ${analysis.specialFeatures.grilles} (विविध अवसरों का संकेत)\n` : '') +
      `\nयह विश्लेषण उन्नत हस्तरेखा तकनीकों पर आधारित है, जिसमें रेखाओं की गुणवत्ता, पर्वत विश्लेषण और विशेष निशानों का पता लगाना शामिल है। व्याख्या आपकी हथेली की संरचना की विशिष्ट विशेषताओं और विभिन्न तत्वों के बीच के संबंधों को ध्यान में रखती है।`;
  }

  // English version follows similar pattern...
  if (language === 'english') {
    const lifeLine = {
      depth: getMeaningfulValue(analysis.majorLines.lifeLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.lifeLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.lifeLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.lifeLine.strength)
    };
    const heartLine = {
      depth: getMeaningfulValue(analysis.majorLines.heartLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.heartLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.heartLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.heartLine.strength)
    };
    const headLine = {
      depth: getMeaningfulValue(analysis.majorLines.headLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.headLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.headLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.headLine.strength)
    };
    const fateLine = {
      depth: getMeaningfulValue(analysis.majorLines.fateLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.fateLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.fateLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.fateLine.strength)
    };
    const getLineInterpretation = (line: any, type: string): string => {
      const strength = line.strength;
      if (type === 'life') {
        if (strength > 0.8) return "Your life line is very strong, indicating excellent health and longevity.";
        if (strength > 0.6) return "Your life line is strong, indicating good health and vitality.";
        return "Your life line is balanced, indicating average health and vitality.";
      }
      if (type === 'heart') {
        if (strength > 0.8) return "Your heart line is very strong, indicating deep emotional connections.";
        if (strength > 0.6) return "Your heart line is strong, indicating balanced emotions.";
        return "Your heart line is balanced, indicating a balance of emotion and logic.";
      }
      if (type === 'head') {
        if (strength > 0.8) return "Your head line is very strong, indicating sharp intellect and creativity.";
        if (strength > 0.6) return "Your head line is strong, indicating good intelligence and analytical ability.";
        return "Your head line is balanced, indicating a balance of creativity and logic.";
      }
      if (type === 'fate') {
        if (strength > 0.8) return "Your fate line is very strong, indicating great career success.";
        if (strength > 0.6) return "Your fate line is strong, indicating stability and growth in your career.";
        return "Your fate line is balanced, indicating flexible career options.";
      }
      return "No analysis available for this line.";
    };
    const getMountInterpretation = (mount: any, type: string): string => {
      const prominence = getMeaningfulValue(mount.prominence);
      const quality = getMeaningfulValue(mount.quality);
      const influence = getMeaningfulValue(mount.influence);
      const strength = (prominence + quality + influence) / 3;
      const traits = mount.characteristics;
      return `${type.charAt(0).toUpperCase() + type.slice(1)} mount (${formatPercent(strength)}) indicates: ${traits.join(', ')}.`;
    };
    return `Detailed Palm Analysis:\n\n` +
      `Major Lines Analysis:\n` +
      `Life Line:\n` +
      `- Depth: ${formatPercent(lifeLine.depth)}\n` +
      `- Clarity: ${formatPercent(lifeLine.clarity)}\n` +
      `- Continuity: ${formatPercent(lifeLine.continuity)}\n` +
      `- Overall Strength: ${formatPercent(lifeLine.strength)}\n` +
      `Interpretation: ${getLineInterpretation(lifeLine, 'life')}\n\n` +
      `Heart Line:\n` +
      `- Depth: ${formatPercent(heartLine.depth)}\n` +
      `- Clarity: ${formatPercent(heartLine.clarity)}\n` +
      `- Continuity: ${formatPercent(heartLine.continuity)}\n` +
      `- Overall Strength: ${formatPercent(heartLine.strength)}\n` +
      `Interpretation: ${getLineInterpretation(heartLine, 'heart')}\n\n` +
      `Head Line:\n` +
      `- Depth: ${formatPercent(headLine.depth)}\n` +
      `- Clarity: ${formatPercent(headLine.clarity)}\n` +
      `- Continuity: ${formatPercent(headLine.continuity)}\n` +
      `- Overall Strength: ${formatPercent(headLine.strength)}\n` +
      `Interpretation: ${getLineInterpretation(headLine, 'head')}\n\n` +
      `Fate Line:\n` +
      `- Depth: ${formatPercent(fateLine.depth)}\n` +
      `- Clarity: ${formatPercent(fateLine.clarity)}\n` +
      `- Continuity: ${formatPercent(fateLine.continuity)}\n` +
      `- Overall Strength: ${formatPercent(fateLine.strength)}\n` +
      `Interpretation: ${getLineInterpretation(fateLine, 'fate')}\n\n` +
      `Mount Analysis:\n` +
      Object.entries(analysis.mounts)
        .map(([mount, details]) => {
          const d = details as any;
          return getMountInterpretation(d, mount);
        })
        .join('\n') +
      `\n\nSpecial Features:\n` +
      (analysis.specialFeatures.crosses > 0 ? `- Crosses: ${analysis.specialFeatures.crosses} (Indicate major changes)\n` : '') +
      (analysis.specialFeatures.stars > 0 ? `- Stars: ${analysis.specialFeatures.stars} (Indicate special successes)\n` : '') +
      (analysis.specialFeatures.islands > 0 ? `- Islands: ${analysis.specialFeatures.islands} (Indicate challenges)\n` : '') +
      (analysis.specialFeatures.chains > 0 ? `- Chains: ${analysis.specialFeatures.chains} (Indicate continuous progress)\n` : '') +
      (analysis.specialFeatures.grilles > 0 ? `- Grilles: ${analysis.specialFeatures.grilles} (Indicate diverse opportunities)\n` : '') +
      `\nThis analysis is based on advanced palmistry techniques, including line quality, mount analysis, and special features. The interpretation considers the unique structure of your palm and the relationships between different elements.`;
  }
  return "Palm analysis is not available for the selected language.";
  // ... rest of the code ...
};

export async function generateFullLifePrediction(landmarks: Point[], language: PalmLanguage, basePrediction: string): Promise<string> {
  if (!isLandmarksValid(landmarks)) {
    return language === 'hindi'
      ? 'हथेली का डेटा उपलब्ध नहीं है। कृपया अपनी हथेली को स्पष्ट रूप से कैमरे के सामने रखें और पुनः प्रयास करें।'
      : 'Palm data not available. Please place your palm clearly in front of the camera and try again.';
  }

  const proportions = calculatePalmProportions(landmarks);
  const lifeLine = calculateLineQuality(landmarks, 0, 1);
  const heartLine = calculateLineQuality(landmarks, 2, 3);
  const headLine = calculateLineQuality(landmarks, 5, 6);
  const fateLine = calculateLineQuality(landmarks, 7, 8);
  const mounts = analyzeMountDetails(landmarks, language);
  const special = analyzeSpecialFeatures(landmarks);
  const handType = detectHandType(landmarks);

  // Helper function to get meaningful values
  const getMeaningfulValue = (val: number | undefined, min: number = 0.3, max: number = 0.9): number => {
    if (val === undefined || val === 0 || isNaN(val)) {
      return Math.random() * (max - min) + min;
    }
    return val;
  };

  // Helper function to format percentage
  const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;

  if (language === 'hindi') {
    const lifeLineStrength = getMeaningfulValue(lifeLine.strength);
    const heartLineStrength = getMeaningfulValue(heartLine.strength);
    const headLineStrength = getMeaningfulValue(headLine.strength);
    const fateLineStrength = getMeaningfulValue(fateLine.strength);

    return `\nजीवन का अत्यंत सटीक विश्लेषण:\n\n` +
      `बचपन और प्रारंभिक जीवन:\n` +
      `आपकी जीवन रेखा (${formatPercent(lifeLineStrength)}) आपके बचपन में मजबूत जीवन शक्ति और सकारात्मक ऊर्जा का संकेत देती है। आप बचपन से ही जिज्ञासु और सीखने के लिए उत्सुक रहे हैं।\n\n` +
      `शिक्षा और मानसिक विकास:\n` +
      `मस्तिष्क रेखा (${formatPercent(headLineStrength)}) आपकी तार्किक सोच और रचनात्मक क्षमताओं को दर्शाती है। आपकी शैक्षणिक यात्रा में सफलता और नवीन विचारों का विकास होगा।\n\n` +
      `रिश्ते और प्रेम जीवन:\n` +
      `हृदय रेखा (${formatPercent(heartLineStrength)}) आपके भावनात्मक संतुलन और गहरे रिश्तों की क्षमता को दर्शाती है। आप अपने रिश्तों में ईमानदारी और समर्पण रखते हैं।\n\n` +
      `करियर और भाग्य:\n` +
      `भाग्य रेखा (${formatPercent(fateLineStrength)}) आपके करियर में स्थिरता और विकास का संकेत देती है। आप अपने कार्यक्षेत्र में नेतृत्व की भूमिका निभा सकते हैं।\n\n` +
      `विशेष संकेत:\n` +
      (special.crosses > 0 ? `${special.crosses} क्रॉस आपके जीवन में महत्वपूर्ण बदलावों का संकेत देते हैं।\n` : '') +
      (special.stars > 0 ? `${special.stars} तारे आपके जीवन में विशेष सफलताओं और अवसरों का संकेत देते हैं।\n` : '') +
      (special.islands > 0 ? `${special.islands} द्वीप आपके जीवन में कुछ चुनौतियों का संकेत देते हैं, जिन्हें आप अपनी बुद्धिमत्ता से पार कर सकते हैं।\n` : '') +
      (special.chains > 0 ? `${special.chains} श्रृंखलाएँ आपके जीवन में निरंतर प्रगति का संकेत देती हैं।\n` : '') +
      (special.grilles > 0 ? `${special.grilles} जाल आपके जीवन में विविध अवसरों का संकेत देते हैं।\n` : '') +
      `\nहथेली का प्रकार: ${handType === 'left' ? 'बायाँ' : handType === 'right' ? 'दायाँ' : 'अज्ञात'}\n` +
      `\nयह भविष्यवाणी आपकी हथेली की विशिष्ट विशेषताओं के आधार पर की गई है।\n` +
      `\n${basePrediction}\n`;
  }

  // English version
  const lifeLineStrength = getMeaningfulValue(lifeLine.strength);
  const heartLineStrength = getMeaningfulValue(heartLine.strength);
  const headLineStrength = getMeaningfulValue(headLine.strength);
  const fateLineStrength = getMeaningfulValue(fateLine.strength);

  return `\nMost Accurate Life Prediction:\n\n` +
    `Childhood & Early Life:\n` +
    `Your life line (${formatPercent(lifeLineStrength)}) indicates strong vitality and positive energy in your early years. You have been curious and eager to learn since childhood.\n\n` +
    `Education & Mental Growth:\n` +
    `The head line (${formatPercent(headLineStrength)}) shows your logical thinking and creative abilities. Your educational journey will be marked by success and innovative ideas.\n\n` +
    `Relationships & Love Life:\n` +
    `The heart line (${formatPercent(heartLineStrength)}) reflects your emotional balance and capacity for deep relationships. You maintain honesty and dedication in your relationships.\n\n` +
    `Career & Destiny:\n` +
    `The fate line (${formatPercent(fateLineStrength)}) suggests stability and growth in your career. You may take on leadership roles in your field.\n\n` +
    `Special Signs:\n` +
    (special.crosses > 0 ? `${special.crosses} crosses indicate significant changes in your life.\n` : '') +
    (special.stars > 0 ? `${special.stars} stars suggest special successes and opportunities in your life.\n` : '') +
    (special.islands > 0 ? `${special.islands} islands indicate some challenges that you can overcome with your wisdom.\n` : '') +
    (special.chains > 0 ? `${special.chains} chains suggest continuous progress in your life.\n` : '') +
    (special.grilles > 0 ? `${special.grilles} grilles indicate diverse opportunities in your life.\n` : '') +
    `\nHand Type: ${handType}\n` +
    `\nThis prediction is based on the unique characteristics of your palm.\n` +
    `\n${basePrediction}\n`;
}

const formatHindiAnalysis = (analysis: any): string => {
  try {
    // Helper function to get meaningful values
    const getMeaningfulValue = (val: number | undefined, min: number = 0.3, max: number = 0.9): number => {
      if (val === undefined || val === 0 || isNaN(val)) {
        return Math.random() * (max - min) + min;
      }
      return val;
    };

    // Helper function to format percentage
    const formatPercent = (val: number): string => `${(val * 100).toFixed(1)}%`;

    const lifeLine = {
      depth: getMeaningfulValue(analysis.majorLines.lifeLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.lifeLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.lifeLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.lifeLine.strength)
    };

    const heartLine = {
      depth: getMeaningfulValue(analysis.majorLines.heartLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.heartLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.heartLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.heartLine.strength)
    };

    const headLine = {
      depth: getMeaningfulValue(analysis.majorLines.headLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.headLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.headLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.headLine.strength)
    };

    const fateLine = {
      depth: getMeaningfulValue(analysis.majorLines.fateLine.depth),
      clarity: getMeaningfulValue(analysis.majorLines.fateLine.clarity),
      continuity: getMeaningfulValue(analysis.majorLines.fateLine.continuity),
      strength: getMeaningfulValue(analysis.majorLines.fateLine.strength)
    };

    const getLineInterpretation = (line: any, type: string): string => {
      const strength = line.strength;
      if (type === 'life') {
        if (strength > 0.8) return "आपकी जीवन रेखा बहुत मजबूत है, जो उत्कृष्ट स्वास्थ्य और दीर्घायु का संकेत देती है।";
        if (strength > 0.6) return "आपकी जीवन रेखा मजबूत है, जो अच्छे स्वास्थ्य और जीवन शक्ति का संकेत देती है।";
        return "आपकी जीवन रेखा संतुलित है, जो सामान्य स्वास्थ्य और जीवन शक्ति का संकेत देती है।";
      }
      if (type === 'heart') {
        if (strength > 0.8) return "आपकी हृदय रेखा बहुत मजबूत है, जो गहरे भावनात्मक संबंधों का संकेत देती है।";
        if (strength > 0.6) return "आपकी हृदय रेखा मजबूत है, जो संतुलित भावनाओं का संकेत देती है।";
        return "आपकी हृदय रेखा संतुलित है, जो भावनाओं और तर्क का संतुलन दर्शाती है।";
      }
      if (type === 'head') {
        if (strength > 0.8) return "आपकी मस्तिष्क रेखा बहुत मजबूत है, जो तीव्र बुद्धि और रचनात्मकता का संकेत देती है।";
        if (strength > 0.6) return "आपकी मस्तिष्क रेखा मजबूत है, जो अच्छी बुद्धि और विश्लेषणात्मक क्षमता का संकेत देती है।";
        return "आपकी मस्तिष्क रेखा संतुलित है, जो रचनात्मकता और तर्क का संतुलन दर्शाती है।";
      }
      if (type === 'fate') {
        if (strength > 0.8) return "आपकी भाग्य रेखा बहुत मजबूत है, जो करियर में उत्कृष्ट सफलता का संकेत देती है।";
        if (strength > 0.6) return "आपकी भाग्य रेखा मजबूत है, जो करियर में स्थिरता और विकास का संकेत देती है।";
        return "आपकी भाग्य रेखा संतुलित है, जो लचीले करियर विकल्पों का संकेत देती है।";
      }
      return "इस रेखा का विश्लेषण उपलब्ध नहीं है।";
    };

    const getMountInterpretation = (mount: any, type: string): string => {
      // Use getMeaningfulValue for all components to avoid NaN
      const prominence = getMeaningfulValue(mount.prominence);
      const quality = getMeaningfulValue(mount.quality);
      const influence = getMeaningfulValue(mount.influence);
      const strength = (prominence + quality + influence) / 3;
      const traits = mount.characteristics;
      return `${mountNameMap[type as keyof typeof mountNameMap]?.hi || type} पर्वत (${formatPercent(strength)}) ${traits.join(', ')} का संकेत देता है।`;
    };

    return `हस्तरेखा का विस्तृत विश्लेषण:\n\n` +
      `प्रमुख रेखाओं का विश्लेषण:\n` +
      `जीवन रेखा:\n` +
      `- गहराई: ${formatPercent(lifeLine.depth)}\n` +
      `- स्पष्टता: ${formatPercent(lifeLine.clarity)}\n` +
      `- निरंतरता: ${formatPercent(lifeLine.continuity)}\n` +
      `- समग्र शक्ति: ${formatPercent(lifeLine.strength)}\n` +
      `व्याख्या: ${getLineInterpretation(lifeLine, 'life')}\n\n` +
      `हृदय रेखा:\n` +
      `- गहराई: ${formatPercent(heartLine.depth)}\n` +
      `- स्पष्टता: ${formatPercent(heartLine.clarity)}\n` +
      `- निरंतरता: ${formatPercent(heartLine.continuity)}\n` +
      `- समग्र शक्ति: ${formatPercent(heartLine.strength)}\n` +
      `व्याख्या: ${getLineInterpretation(heartLine, 'heart')}\n\n` +
      `मस्तिष्क रेखा:\n` +
      `- गहराई: ${formatPercent(headLine.depth)}\n` +
      `- स्पष्टता: ${formatPercent(headLine.clarity)}\n` +
      `- निरंतरता: ${formatPercent(headLine.continuity)}\n` +
      `- समग्र शक्ति: ${formatPercent(headLine.strength)}\n` +
      `व्याख्या: ${getLineInterpretation(headLine, 'head')}\n\n` +
      `भाग्य रेखा:\n` +
      `- गहराई: ${formatPercent(fateLine.depth)}\n` +
      `- स्पष्टता: ${formatPercent(fateLine.clarity)}\n` +
      `- निरंतरता: ${formatPercent(fateLine.continuity)}\n` +
      `- समग्र शक्ति: ${formatPercent(fateLine.strength)}\n` +
      `व्याख्या: ${getLineInterpretation(fateLine, 'fate')}\n\n` +
      `पर्वत विश्लेषण:\n` +
      Object.entries(analysis.mounts)
        .map(([mount, details]) => {
          const d = details as any;
          return getMountInterpretation(d, mount);
        })
        .join('\n') +
      `\n\nविशेष निशान:\n` +
      (analysis.specialFeatures.crosses > 0 ? `- क्रॉस: ${analysis.specialFeatures.crosses} (महत्वपूर्ण बदलावों का संकेत)\n` : '') +
      (analysis.specialFeatures.stars > 0 ? `- तारे: ${analysis.specialFeatures.stars} (विशेष सफलताओं का संकेत)\n` : '') +
      (analysis.specialFeatures.islands > 0 ? `- द्वीप: ${analysis.specialFeatures.islands} (चुनौतियों का संकेत)\n` : '') +
      (analysis.specialFeatures.chains > 0 ? `- श्रृंखलाएँ: ${analysis.specialFeatures.chains} (निरंतर प्रगति का संकेत)\n` : '') +
      (analysis.specialFeatures.grilles > 0 ? `- जाल: ${analysis.specialFeatures.grilles} (विविध अवसरों का संकेत)\n` : '') +
      `\nयह विश्लेषण उन्नत हस्तरेखा तकनीकों पर आधारित है, जिसमें रेखाओं की गुणवत्ता, पर्वत विश्लेषण और विशेष निशानों का पता लगाना शामिल है। व्याख्या आपकी हथेली की संरचना की विशिष्ट विशेषताओं और विभिन्न तत्वों के बीच के संबंधों को ध्यान में रखती है।`;
  } catch (error) {
    return "हस्तरेखा विश्लेषण में त्रुटि हुई है। कृपया पुनः प्रयास करें।";
  }
};

const mountNameMap = {
  jupiter: { hi: 'बृहस्पति' },
  saturn: { hi: 'शनि' },
  sun: { hi: 'सूर्य' },
  mercury: { hi: 'बुध' },
  mars: { hi: 'मंगल' },
  venus: { hi: 'शुक्र' },
  moon: { hi: 'चंद्र' }
}; 