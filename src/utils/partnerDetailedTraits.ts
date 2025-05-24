interface DetailedTraits {
  virtues: string[];
  challenges: string[];
  relationships: string[];
  career: string[];
  lifestyle: string[];
  appearance: string[];
  personality: string[];
  compatibility_level: 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good';
}

interface GenderSpecificTraits {
  very_bad: DetailedTraits;
  bad: DetailedTraits;
  neutral: DetailedTraits;
  good: DetailedTraits;
  very_good: DetailedTraits;
}

interface LanguageSpecificTraits {
  en: GenderSpecificTraits;
  hi: GenderSpecificTraits;
}

interface GenderTraits {
  male: LanguageSpecificTraits;
  female: LanguageSpecificTraits;
}

export const DetailedTraits: GenderTraits = {
  male: {
    en: {
      very_bad: {
        compatibility_level: 'very_bad',
        virtues: [
          "Rarely truthful", "Lacks empathy", "Unreliable and secretive", "Disrespectful in relationships", "Dishonest nature"
        ],
        challenges: [
          "Frequent emotional instability", "Manipulative behavior", "Trust issues", "Financial recklessness", "Tendency to gossip"
        ],
        relationships: [
          "Unable to sustain long-term commitment", "Jealous and controlling", "Emotionally distant", "Unfaithful behavior", "Argumentative nature"
        ],
        career: [
          "Unstable work history", "Lacks discipline", "Easily distracted", "Irresponsible at work", "Unmotivated"
        ],
        lifestyle: [
          "Unhealthy routines", "Poor hygiene habits", "Lack of self-care", "Chaotic lifestyle", "Materialistic focus"
        ],
        appearance: [
          "Neglects grooming", "Unkempt look", "Sloppy dressing", "Lack of hygiene", "Disheveled appearance"
        ],
        personality: [
          "Narcissistic tendencies", "Overly dramatic", "Emotionally volatile", "Vindictive", "Insensitive to others"
        ]
      },      bad: {
        compatibility_level: 'bad',
        virtues: [
          "Occasionally compassionate", "Some sense of honesty", "Can be kind at times", "Shows empathy sometimes", "Somewhat dependable"
        ],
        challenges: [
          "Stubborn behavior", "Mood swings", "Struggles with honesty", "Lack of ambition", "Irresponsibility"
        ],
        relationships: [
          "Emotionally reactive", "Trust concerns", "Poor emotional support", "Jealousy issues", "Conflict-prone"
        ],
        career: [
          "Mediocre performance", "Lacks consistency", "Not career-driven", "Avoids leadership", "Limited focus"
        ],
        lifestyle: [
          "Disorganized living", "Inconsistent habits", "Avoids physical activity", "Minimal personal growth", "Unplanned lifestyle"
        ],
        appearance: [
          "Careless dressing", "Basic grooming", "Plain style", "Often looks tired", "Little attention to health"
        ],
        personality: [
          "Easily offended", "Defensive attitude", "Insecure", "Can be selfish", "Emotionally reserved"
        ]
      },      neutral: {
        compatibility_level: 'neutral',
        virtues: [
          "Generally honest", "Caring when needed", "Maintains basic integrity", "Shows responsibility", "Emotionally stable overall"
        ],
        challenges: [
          "Mild anxiety", "Occasional communication gaps", "Sometimes indecisive", "Moderate stress response", "Can be inconsistent"
        ],
        relationships: [
          "Average relationship skills", "Respects commitment", "Communicates adequately", "Generally supportive", "Values family bonds"
        ],
        career: [
          "Stable performance", "Average ambition", "Consistent worker", "Handles responsibilities well", "Meets expectations"
        ],
        lifestyle: [
          "Moderately organized", "Balanced habits", "Focus on routine", "Tries to stay healthy", "Engages in social life"
        ],
        appearance: [
          "Average grooming", "Presents well", "Neat appearance", "Healthy overall look", "Dresses appropriately"
        ],
        personality: [
          "Balanced emotions", "Open-minded", "Reasonable thinker", "Friendly", "Trustworthy"
        ]
      },      good: {
        compatibility_level: 'good',
        virtues: [
          "Caring and considerate", "Emotionally mature", "Consistently honest", "Responsible in actions", "Uplifting nature"
        ],
        challenges: [
          "May overthink situations", "Slight work-life imbalance", "Can be overly cautious", "Perfectionist at times", "Struggles with delegating"
        ],
        relationships: [
          "Supportive and loving partner", "Strong commitment", "Good listener", "Values honesty", "Loyal and nurturing"
        ],
        career: [
          "Steady growth", "Goal-oriented", "Efficient worker", "Takes initiative", "Respected by peers"
        ],
        lifestyle: [
          "Health-aware", "Emotionally balanced", "Active in community", "Personal development oriented", "Time-conscious"
        ],
        appearance: [
          "Neat and tidy", "Stylish yet modest", "Glowing skin", "Confident appearance", "Energetic outlook"
        ],
        personality: [
          "Warm-hearted", "Good decision-maker", "Encouraging to others", "Emotionally aware", "Positive attitude"
        ]
      },      very_good: {
        compatibility_level: 'very_good',
        virtues: [
          "Inspires others", "Highly principled", "Deep empathy", "Emotionally strong", "Trustworthy and graceful"
        ],
        challenges: [
          "Takes on too much responsibility", "Hard on himself", "Can neglect personal time", "Perfectionist expectations", "Overcommits emotionally"
        ],
        relationships: [
          "Deep and meaningful connections", "Unconditional love", "Complete loyalty", "Emotionally empowering partner", "Devoted to family and loved ones"
        ],
        career: [
          "Leader in his field", "Mentors others", "Exemplary work ethic", "Consistently exceeds expectations", "Highly respected"
        ],
        lifestyle: [
          "Disciplined routine", "Highly health-conscious", "Socially active and influential", "Invests in personal growth", "Peaceful and organized living"
        ],
        appearance: [
          "Polished and graceful", "Exudes confidence", "Elegant fashion sense", "Perfect grooming", "Striking personality"
        ],
        personality: [
          "Natural mentor", "Emotionally balanced leader", "Wise and kind", "Exceptionally intuitive", "Leads with compassion"
        ]
      }
    },    hi: {
     very_bad: {
        compatibility_level: 'very_bad',
        virtues: [
          "ईमानदारी की कमी",
          "भावनात्मक गहराई की कमी",
          "प्रतिबद्धताओं में अस्थिर",
          "खराब संवाद कौशल",
          "भौतिकवादी सोच"
        ],
        challenges: [
          "गंभीर गुस्से की समस्या",
          "वित्तीय लापरवाही",
          "प्रतिबद्धता से डर",
          "विश्वास की समस्या",
          "छल करने वाला स्वभाव"
        ],
        relationships: [
          "धोखेबाजी का इतिहास",
          "लंबे संबंध बनाए रखने में असमर्थ",
          "भावनात्मक नियंत्रण",
          "खराब पारिवारिक मूल्य",
          "जिम्मेदारी से बचाव"
        ],
        career: [
          "अनियमित नौकरी इतिहास",
          "करियर के लिए कोई महत्वाकांक्षा नहीं",
          "खराब कार्य नैतिकता",
          "लगातार नौकरी बदलना",
          "काम में भरोसेमंद नहीं"
        ],
        lifestyle: [
          "अस्वस्थ आदतें",
          "अनियमित दिनचर्या",
          "नशे की प्रवृत्ति",
          "वित्तीय कुप्रबंधन",
          "स्वयं के विकास की उपेक्षा"
        ],
        appearance: [
          "व्यक्तिगत स्वच्छता की उपेक्षा",
          "अव्यवस्थित रूप",
          "खराब देखभाल",
          "अस्वस्थ जीवनशैली के लक्षण",
          "प्रस्तुति की परवाह नहीं"
        ],
        personality: [
          "आक्रामक स्वभाव",
          "छलपूर्ण प्रकृति",
          "भावनात्मक अस्थिरता",
          "अहंकारी प्रवृत्ति",
          "सहानुभूति की कमी"
        ]
      },
      bad: {
        compatibility_level: 'bad',
        virtues: [
          "कभी-कभी ईमानदार",
          "मूल नैतिक समझ",
          "कुछ हद तक जिम्मेदारी",
          "दयालुता दिखा सकते हैं",
          "बुनियादी भावनात्मक समझ"
        ],
        challenges: [
          "अक्सर मूड बदलता है",
          "प्रतिबद्धता में कठिनाई",
          "खराब संवाद क्षमता",
          "अनियमित व्यवहार",
          "वित्तीय अस्थिरता"
        ],
        relationships: [
          "निकटता में समस्या",
          "संघर्ष सुलझाने में कमी",
          "विश्वास की कमी",
          "भावनात्मक दूरी",
          "प्रतिबद्धता से डर"
        ],
        career: [
          "सीमित करियर लक्ष्य",
          "व्यावसायिक विकास की कमी",
          "अनियमित कार्य निष्पादन",
          "टीम वर्क में कठिनाई",
          "प्रेरणा की कमी"
        ],
        lifestyle: [
          "अव्यवस्थित जीवनशैली",
          "अनियमित दिनचर्या",
          "सीमित सामाजिक संबंध",
          "स्वास्थ्य की उपेक्षा",
          "जीवन में दिशा की कमी"
        ],
        appearance: [
          "असंगत सौंदर्य ध्यान",
          "सीमित शैली समझ",
          "शारीरिक देखभाल में कमी",
          "अस्वस्थ लक्षण",
          "प्रस्तुति कौशल की कमी"
        ],
        personality: [
          "मूड में उतार-चढ़ाव",
          "अप्रत्यक्ष रूप से आक्रामक",
          "आत्मकेंद्रित",
          "भावनाओं पर नियंत्रण की कमी",
          "सीमित सहानुभूति"
        ]
      },
      neutral: {
        compatibility_level: 'neutral',
        virtues: [
          "सामान्यतः ईमानदार",
          "मूल नैतिकता",
          "औसत विश्वसनीयता",
          "कुछ भावनात्मक परिपक्वता",
          "दूसरों के लिए बुनियादी सम्मान"
        ],
        challenges: [
          "कभी-कभी चिड़चिड़ापन",
          "संवाद में कुछ समस्या",
          "मध्यम स्तर का तनाव प्रबंधन",
          "औसत वित्तीय प्रबंधन",
          "सामान्य जीवन संघर्ष"
        ],
        relationships: [
          "मध्यम प्रतिबद्धता स्तर",
          "सामान्य संवाद कौशल",
          "बुनियादी भावनात्मक समर्थन",
          "कुछ पारिवारिक मूल्य",
          "औसत संबंध बनाए रखने की क्षमता"
        ],
        career: [
          "स्थिर करियर रास्ता",
          "औसत महत्वाकांक्षा",
          "सामान्य कार्य नैतिकता",
          "मध्यम प्रदर्शन",
          "बुनियादी पेशेवर कौशल"
        ],
        lifestyle: [
          "नियमित दिनचर्या",
          "बुनियादी स्वास्थ्य जागरूकता",
          "सामान्य सामाजिक जीवन",
          "साधारण आदतें",
          "सामान्य दैनिक संरचना"
        ],
        appearance: [
          "औसत सौंदर्य ध्यान",
          "नियमित रख-रखाव",
          "सामान्य शैली",
          "सामान्य प्रस्तुति",
          "बुनियादी आत्म देखभाल"
        ],
        personality: [
          "संतुलित स्वभाव",
          "औसत सामाजिकता",
          "सामान्य भावनात्मक रेंज",
          "सामान्य संवाद कौशल",
          "बुनियादी सहानुभूति"
        ]
      },
      good: {
        compatibility_level: 'good',
        virtues: [
          "मजबूत नैतिक मूल्यों वाला",
          "विश्वसनीय और ईमानदार",
          "जिम्मेदार साथी",
          "भावनात्मक रूप से परिपक्व",
          "अच्छा चरित्र"
        ],
        challenges: [
          "हल्की संवाद समस्याएं",
          "कभी-कभी तनाव",
          "थोड़ा परफेक्शनिस्ट",
          "कार्य और जीवन संतुलन में संघर्ष",
          "मध्यम चिंता"
        ],
        relationships: [
          "प्रतिबद्ध और समर्पित साथी",
          "अच्छे संवादकर्ता",
          "भावनात्मक रूप से उपलब्ध",
          "परिवार के प्रति समर्पित",
          "सहायक स्वभाव"
        ],
        career: [
          "सफल करियर पथ",
          "अच्छी महत्वाकांक्षा",
          "मजबूत कार्य नैतिकता",
          "व्यावसायिक विकास",
          "नेतृत्व की क्षमता"
        ],
        lifestyle: [
          "स्वस्थ जीवनशैली",
          "सक्रिय दिनचर्या",
          "अच्छा सामाजिक जीवन",
          "संतुलित जीवनशैली",
          "स्व-विकास पर ध्यान"
        ],
        appearance: [
          "साफ-सुथरी उपस्थिति",
          "अच्छा फैशन सेंस",
          "स्वस्थ रूप",
          "पेशेवर प्रस्तुति",
          "अच्छी आत्म देखभाल"
        ],
        personality: [
          "सकारात्मक सोच",
          "अच्छी भावनात्मक समझ",
          "प्रभावशाली संवाद कौशल",
          "सहानुभूति पूर्ण स्वभाव",
          "विश्वसनीय व्यक्तित्व"
        ]
      },
      very_good: {
        compatibility_level: 'very_good',
        virtues: [
          "असाधारण ईमानदारी",
          "उच्च नैतिक मानक",
          "गहरी भावनात्मक समझ",
          "मजबूत विश्वसनीयता",
          "उत्कृष्ट चरित्र"
        ],
        challenges: [
          "पूर्णता की प्रवृत्ति",
          "स्वयं से अधिक अपेक्षाएं",
          "अत्यधिक परिश्रम",
          "आत्म आलोचना",
          "अधिक जिम्मेदारी लेने की प्रवृत्ति"
        ],
        relationships: [
          "गहरी भावनात्मक जुड़ाव",
          "मजबूत प्रतिबद्धता",
          "उत्कृष्ट संवाद कौशल",
          "मजबूत पारिवारिक मूल्य",
          "बेहद सहायक"
        ],
        career: [
          "उच्च स्तर की उपलब्धियां",
          "मजबूत नेतृत्व",
          "उत्कृष्ट कार्य नैतिकता",
          "करियर में श्रेष्ठता",
          "व्यावसायिक सफलता"
        ],
        lifestyle: [
          "बेहद स्वस्थ जीवनशैली",
          "सक्रिय और संतुलित",
          "समृद्ध सामाजिक जीवन",
          "निजी विकास पर केंद्रित",
          "उत्कृष्ट दिनचर्या"
        ],
        appearance: [
          "उत्कृष्ट रूप-रंग",
          "परिष्कृत शैली",
          "स्वस्थ और फिट",
          "पेशेवर छवि",
          "प्रभावशाली उपस्थिति"
        ],
        personality: [
          "प्राकृतिक नेतृत्वकर्ता",
          "उच्च भावनात्मक बुद्धिमत्ता",
          "मजबूत व्यक्तित्व",
          "उत्कृष्ट संवाद",
          "गहरी सहानुभूति"
        ]
      }
    }
  },
  female: {
    en: {
            very_bad: {
                compatibility_level: 'very_bad',
                virtues: [
                    "Can be charming when needed",
                    "Strong-willed in conflict",
                    "Independent-minded",
                    "Resilient under pressure",
                    "Emotionally tough"
                ],
                challenges: [
                    "Dishonest tendencies",
                    "Manipulative behavior",
                    "Unreliable nature",
                    "Emotionally detached",
                    "High conflict tendencies"
                ],
                relationships: [
                    "Inconsistent partner",
                    "Frequent relationship issues",
                    "Lacks empathy",
                    "Poor family values",
                    "Tendency to cheat"
                ],
                career: [
                    "Unstable job history",
                    "Lacks direction",
                    "Conflict with colleagues",
                    "Irresponsible at work",
                    "Frequent job changes"
                ],
                lifestyle: [
                    "Chaotic routines",
                    "Neglects health",
                    "Impulsive spending",
                    "Addictive habits",
                    "Low motivation"
                ],
                appearance: [
                    "Neglects grooming",
                    "Unclean habits",
                    "Lack of hygiene",
                    "Careless clothing",
                    "Poor self-presentation"
                ],
                personality: [
                    "Aggressive",
                    "Emotionally immature",
                    "Jealous nature",
                    "Controlling tendencies",
                    "Narcissistic traits"
                ]
            },
            bad: {
                compatibility_level: 'bad',
                virtues: [
                    "Sporadically empathetic",
                    "Some sense of responsibility",
                    "Occasional kindness",
                    "Has emotional depth in rare moments",
                    "Mildly caring"
                ],
                challenges: [
                    "Self-centered",
                    "Poor communication skills",
                    "Frequent mood swings",
                    "Inconsistent behavior",
                    "Passive-aggressive"
                ],
                relationships: [
                    "Struggles with commitment",
                    "Trust issues",
                    "Emotional distance",
                    "Disagreements with family",
                    "Argumentative in relationships"
                ],
                career: [
                    "Minimal ambition",
                    "Workplace conflicts",
                    "Inconsistent efforts",
                    "Low performance",
                    "Unclear goals"
                ],
                lifestyle: [
                    "Unhealthy habits",
                    "Lazy routines",
                    "Spends irresponsibly",
                    "Messy living space",
                    "Avoids responsibilities"
                ],
                appearance: [
                    "Basic grooming",
                    "Unrefined fashion sense",
                    "Neglects skincare",
                    "Tired appearance",
                    "Occasionally presentable"
                ],
                personality: [
                    "Judgmental",
                    "Unmotivated",
                    "Defensive attitude",
                    "Limited self-awareness",
                    "Emotionally unpredictable"
                ]
            },
            neutral: {
                compatibility_level: 'neutral',
                virtues: [
                    "Generally kind",
                    "Some emotional intelligence",
                    "Moderately reliable",
                    "Decent moral compass",
                    "Open to feedback"
                ],
                challenges: [
                    "Occasional mood swings",
                    "Sometimes indecisive",
                    "Gets stressed easily",
                    "Average communication",
                    "Moderate self-doubt"
                ],
                relationships: [
                    "Emotionally fair",
                    "Can maintain relationships with effort",
                    "Some commitment strength",
                    "Family involvement is average",
                    "Sometimes overthinks"
                ],
                career: [
                    "Stable job choices",
                    "Standard productivity",
                    "Growth-oriented mindset",
                    "Work-life balance attempts",
                    "Basic leadership"
                ],
                lifestyle: [
                    "Reasonable routines",
                    "Average diet and health habits",
                    "Engages in hobbies",
                    "Occasional laziness",
                    "Tries to be balanced"
                ],
                appearance: [
                    "Neat and clean",
                    "Casual style",
                    "Healthy appearance",
                    "Average confidence",
                    "Modest presence"
                ],
                personality: [
                    "Introvert/extrovert balance",
                    "Usually calm",
                    "Tries to understand others",
                    "Emotionally aware",
                    "Flexible thinker"
                ]
            },
            good: {
                compatibility_level: 'good',
                virtues: [
                    "Compassionate nature",
                    "High reliability",
                    "Honest and loyal",
                    "Empathetic personality",
                    "Strong emotional understanding"
                ],
                challenges: [
                    "Occasional overthinking",
                    "Can be overly sensitive",
                    "Slight fear of failure",
                    "Takes criticism to heart",
                    "Struggles with letting go"
                ],
                relationships: [
                    "Committed and loyal partner",
                    "Deep emotional bonds",
                    "Communicates well",
                    "Caring and considerate",
                    "Supportive during hard times"
                ],
                career: [
                    "Consistent performer",
                    "Career-focused",
                    "Goal-driven",
                    "Good leadership skills",
                    "Ethical professional behavior"
                ],
                lifestyle: [
                    "Well-structured daily life",
                    "Fitness and health conscious",
                    "Balanced use of time",
                    "Positive habits",
                    "Socially active"
                ],
                appearance: [
                    "Well-dressed",
                    "Professional presence",
                    "Healthy physique",
                    "Cleans up well",
                    "Good skincare and hygiene"
                ],
                personality: [
                    "Warm-hearted",
                    "Analytical mindset",
                    "Good sense of humor",
                    "Emotionally grounded",
                    "Trustworthy and calm"
                ]
            },
            very_good: {
                compatibility_level: 'very_good',
                virtues: [
                    "Highly empathetic",
                    "Exceptionally trustworthy",
                    "Deep sense of loyalty",
                    "Strong moral integrity",
                    "Emotionally evolved"
                ],
                challenges: [
                    "May neglect self while caring for others",
                    "Can overwork herself",
                    "Tends to take too much responsibility",
                    "Occasionally doubts her worth",
                    "Can be too giving"
                ],
                relationships: [
                    "Extremely loyal partner",
                    "Deeply loving and nurturing",
                    "Resolves conflicts maturely",
                    "Creates lasting bonds",
                    "Prioritizes family"
                ],
                career: [
                    "Leader by nature",
                    "Visionary professional",
                    "Highly respected",
                    "Driven by purpose",
                    "Balancing personal and professional life efficiently"
                ],
                lifestyle: [
                    "Highly disciplined",
                    "Excellent time management",
                    "Regular wellness practices",
                    "Cultural engagement",
                    "Balanced priorities"
                ],
                appearance: [
                    "Elegant and poised",
                    "Charismatic presence",
                    "Confident and graceful",
                    "Inspiring style",
                    "Groomed to perfection"
                ],
                personality: [
                    "Inspiring motivator",
                    "Naturally wise",
                    "Highly intuitive",
                    "Exceptionally composed",
                    "Deeply reflective and kind"
                ]
            }
    },
    hi: {
      very_bad: {
                compatibility_level: 'very_bad',
                virtues: [
                    "जरूरत पड़ने पर आकर्षक व्यवहार",
                    "संघर्ष में दृढ़ संकल्प",
                    "स्वतंत्र विचार",
                    "दबाव में मजबूत",
                    "भावनात्मक रूप से कठोर"
                ],
                challenges: [
                    "असत्य प्रवृत्ति",
                    "छलपूर्ण व्यवहार",
                    "अविश्वसनीय स्वभाव",
                    "भावनात्मक रूप से दूर",
                    "अत्यधिक झगड़ालू प्रवृत्ति"
                ],
                relationships: [
                    "अस्थिर साथी",
                    "लगातार रिश्तों में समस्याएं",
                    "सहानुभूति की कमी",
                    "कम पारिवारिक मूल्य",
                    "धोखा देने की प्रवृत्ति"
                ],
                career: [
                    "अस्थिर करियर इतिहास",
                    "दिशाहीनता",
                    "सहकर्मियों से टकराव",
                    "काम में लापरवाही",
                    "नौकरियां बार-बार बदलना"
                ],
                lifestyle: [
                    "अव्यवस्थित दिनचर्या",
                    "स्वास्थ्य की उपेक्षा",
                    "आकस्मिक खर्च",
                    "लत की प्रवृत्ति",
                    "प्रेरणा की कमी"
                ],
                appearance: [
                    "गंदे कपड़े",
                    "गंदे बाल और त्वचा",
                    "स्वास्थ्य का अभाव",
                    "उपेक्षित रूप",
                    "अस्वच्छता"
                ],
                personality: [
                    "आक्रामक स्वभाव",
                    "भावनात्मक अपरिपक्वता",
                    "ईर्ष्यालु प्रवृत्ति",
                    "नियंत्रणकारी व्यवहार",
                    "आत्ममुग्धता"
                ]
            },
            bad: {
                compatibility_level: 'bad',
                virtues: [
                    "कभी-कभी सहानुभूति",
                    "थोड़ी जिम्मेदारी की भावना",
                    "कभी-कभी दयालुता",
                    "कभी-कभी भावनात्मक समझ",
                    "थोड़ी देखभाल की भावना"
                ],
                challenges: [
                    "आत्मकेंद्रित व्यवहार",
                    "खराब संवाद कौशल",
                    "बार-बार मूड बदलना",
                    "अस्थिर व्यवहार",
                    "अप्रत्यक्ष आक्रामकता"
                ],
                relationships: [
                    "प्रतिबद्धता में संघर्ष",
                    "विश्वास की कमी",
                    "भावनात्मक दूरी",
                    "पारिवारिक विवाद",
                    "तर्कों की प्रवृत्ति"
                ],
                career: [
                    "कम महत्वाकांक्षा",
                    "कार्यक्षेत्र में टकराव",
                    "असंगत प्रयास",
                    "कम प्रदर्शन",
                    "अनिश्चित लक्ष्य"
                ],
                lifestyle: [
                    "अस्वस्थ आदतें",
                    "आलसी दिनचर्या",
                    "लापरवाह खर्च",
                    "गंदा रहन-सहन",
                    "जिम्मेदारी से बचाव"
                ],
                appearance: [
                    "मूल सौंदर्यबोध",
                    "असंपूर्ण पहनावा",
                    "त्वचा की देखभाल की कमी",
                    "थकी हुई छवि",
                    "कभी-कभी संवारना"
                ],
                personality: [
                    "आलोचनात्मक",
                    "प्रेरणा की कमी",
                    "रक्षात्मक रवैया",
                    "सीमित आत्मजागरूकता",
                    "भावनात्मक अस्थिरता"
                ]
            },
            neutral: {
                compatibility_level: 'neutral',
                virtues: [
                    "आम तौर पर दयालु",
                    "थोड़ी भावनात्मक समझ",
                    "मध्यम जिम्मेदारी",
                    "ठोस नैतिकता",
                    "प्रतिक्रिया स्वीकारने को तैयार"
                ],
                challenges: [
                    "कभी-कभी मूड बदलना",
                    "कभी-कभी असमंजस",
                    "आसान तनाव",
                    "औसत संवाद",
                    "मध्यम आत्म-संदेह"
                ],
                relationships: [
                    "भावनात्मक रूप से संतुलित",
                    "रिश्तों को संभाल सकती है",
                    "मध्यम प्रतिबद्धता",
                    "औसत पारिवारिक भागीदारी",
                    "अधिक सोचने की प्रवृत्ति"
                ],
                career: [
                    "स्थिर नौकरी विकल्प",
                    "सामान्य उत्पादकता",
                    "विकास की सोच",
                    "काम और जीवन में संतुलन",
                    "मूल नेतृत्व कौशल"
                ],
                lifestyle: [
                    "संतुलित दिनचर्या",
                    "औसत स्वास्थ्य आदतें",
                    "शौकों में भागीदारी",
                    "कभी-कभी आलस्य",
                    "संतुलन बनाने की कोशिश"
                ],
                appearance: [
                    "स्वच्छ और साफ-सुथरा",
                    "आसान स्टाइल",
                    "स्वस्थ उपस्थिति",
                    "औसत आत्मविश्वास",
                    "साधारण मौजूदगी"
                ],
                personality: [
                    "संतुलित स्वभाव",
                    "आम तौर पर शांत",
                    "समझने की कोशिश करती है",
                    "भावनात्मक रूप से जागरूक",
                    "लचीली सोच"
                ]
            },
            good: {
                compatibility_level: 'good',
                virtues: [
                    "दयालु स्वभाव",
                    "उच्च विश्वसनीयता",
                    "ईमानदार और वफादार",
                    "सहानुभूतिपूर्ण व्यक्तित्व",
                    "मजबूत भावनात्मक समझ"
                ],
                challenges: [
                    "कभी-कभी अधिक सोचना",
                    "अत्यधिक संवेदनशील हो सकती है",
                    "असफलता का हल्का डर",
                    "आलोचना को दिल से लगाना",
                    "छोड़ने में कठिनाई"
                ],
                relationships: [
                    "प्रतिबद्ध और वफादार साथी",
                    "गहरे भावनात्मक बंधन",
                    "अच्छा संवाद करती है",
                    "देखभाल करने वाली और विचारशील",
                    "कठिन समय में सहायक"
                ],
                career: [
                    "निरंतर प्रदर्शनकर्ता",
                    "करियर-केंद्रित",
                    "लक्ष्य-संचालित",
                    "अच्छे नेतृत्व कौशल",
                    "नैतिक पेशेवर व्यवहार"
                ],
                lifestyle: [
                    "अच्छी तरह से संरचित दैनिक जीवन",
                    "फिटनेस और स्वास्थ्य के प्रति सचेत",
                    "समय का संतुलित उपयोग",
                    "सकारात्मक आदतें",
                    "सामाजिक रूप से सक्रिय"
                ],
                appearance: [
                    "अच्छे कपड़े पहनती है",
                    "पेशेवर उपस्थिति",
                    "स्वस्थ शरीर",
                    "अच्छी तरह से तैयार होती है",
                    "अच्छी त्वचा देखभाल और स्वच्छता"
                ],
                personality: [
                    "गर्मजोशी से भरी",
                    "विश्लेषणात्मक मानसिकता",
                    "अच्छी हास्य भावना",
                    "भावनात्मक रूप से स्थिर",
                    "भरोसेमंद और शांत"
                ]
            },
            very_good: {
                compatibility_level: 'very_good',
                virtues: [
                    "अत्यधिक सहानुभूतिपूर्ण",
                    "असाधारण रूप से भरोसेमंद",
                    "गहरी वफादारी की भावना",
                    "मजबूत नैतिक अखंडता",
                    "भावनात्मक रूप से विकसित"
                ],
                challenges: [
                    "दूसरों की देखभाल करते समय खुद की उपेक्षा कर सकती है",
                    "खुद को अधिक काम दे सकती है",
                    "बहुत अधिक जिम्मेदारी लेने की प्रवृत्ति",
                    "कभी-कभी अपनी योग्यता पर संदेह",
                    "बहुत अधिक देने वाली हो सकती है"
                ],
                relationships: [
                    "अत्यंत वफादार साथी",
                    "गहरी प्रेम और पोषण करने वाली",
                    "संघर्षों को परिपक्वता से सुलझाती है",
                    "स्थायी बंधन बनाती है",
                    "परिवार को प्राथमिकता देती है"
                ],
                career: [
                    "प्राकृतिक नेता",
                    "दूरदर्शी पेशेवर",
                    "अत्यधिक सम्मानित",
                    "उद्देश्य से प्रेरित",
                    "व्यक्तिगत और पेशेवर जीवन को कुशलता से संतुलित करती है"
                ],
                lifestyle: [
                    "अत्यधिक अनुशासित",
                    "उत्कृष्ट समय प्रबंधन",
                    "नियमित कल्याण प्रथाएं",
                    "सांस्कृतिक सहभागिता",
                    "संतुलित प्राथमिकताएं"
                ],
                appearance: [
                    "सुरुचिपूर्ण और संयमित",
                    "करिश्माई उपस्थिति",
                    "आत्मविश्वास से भरी और सुंदर",
                    "प्रेरणादायक शैली",
                    "पूर्णता तक संवारी गई"
                ],
                personality: [
                    "प्रेरणादायक प्रेरक",
                    "प्राकृतिक रूप से बुद्धिमान",
                    "अत्यधिक सहज ज्ञान युक्त",
                    "असाधारण रूप से संयमित",
                    "गहराई से चिंतनशील और दयालु"
                ]
            }
        }
    }
};
export default DetailedTraits;