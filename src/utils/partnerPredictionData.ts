export interface PartnerPrediction {
    compatibility: number;
    traits: string[];
    personalityMatch: string;
    challenges: string[];
    advice: string;
}

interface PredictionSet {
    veryBad: PartnerPrediction;
    bad: PartnerPrediction;
    neutral: PartnerPrediction;
    good: PartnerPrediction;
    veryGood: PartnerPrediction;
}

interface LocalizedPredictionData {
    en: PredictionSet;
    hi: PredictionSet;
}

export const predictionData: LocalizedPredictionData = {
    en: {
        veryBad: {
            compatibility: 20,
            traits: ["Highly conflicting personalities", "Opposite life goals", "Different core values"],
            personalityMatch: "Your potential partner may be emotionally distant and have contrasting views on important life matters. Communication will be a major challenge.",
            challenges: ["Frequent misunderstandings", "Trust issues", "Different life priorities"],
            advice: "This match suggests significant challenges. Consider the differences carefully before proceeding."
        },
        bad: {
            compatibility: 40,
            traits: ["Different communication styles", "Misaligned expectations", "Varying lifestyle preferences"],
            personalityMatch: "While there may be initial attraction, fundamental differences in approach to life and relationships could cause friction.",
            challenges: ["Communication gaps", "Different social preferences", "Varying emotional needs"],
            advice: "Success would require substantial effort and compromise from both parties."
        },
        neutral: {
            compatibility: 60,
            traits: ["Some shared interests", "Similar basic values", "Different but complementary personalities"],
            personalityMatch: "A balanced match with both positive aspects and challenges. Growth potential exists with mutual understanding.",
            challenges: ["Occasional miscommunication", "Different approaches to problems", "Some lifestyle adjustments needed"],
            advice: "This partnership has potential but will need work and understanding from both sides."
        },
        good: {
            compatibility: 80,
            traits: ["Strong emotional connection", "Similar life goals", "Complementary personalities"],
            personalityMatch: "A harmonious match with strong potential for long-term happiness. Your differences complement each other well.",
            challenges: ["Minor adjustments in routine", "Some different interests", "Occasional disagreements"],
            advice: "This match shows promising potential for a fulfilling relationship."
        },
        veryGood: {
            compatibility: 95,
            traits: ["Deep emotional connection", "Aligned life goals", "Strong mutual understanding"],
            personalityMatch: "An exceptional match with great potential for lasting happiness. Your energies naturally complement each other.",
            challenges: ["Maintaining individual growth", "Balancing independence", "Keeping romance alive"],
            advice: "This match indicates a highly compatible partnership with excellent prospects for long-term happiness."
        }
    },
    hi: {
        veryBad: {
            compatibility: 20,
            traits: ["बहुत विरोधी व्यक्तित्व", "विपरीत जीवन लक्ष्य", "अलग मूल मूल्य"],
            personalityMatch: "आपका संभावित साथी भावनात्मक रूप से दूर हो सकता है और महत्वपूर्ण जीवन मामलों पर विपरीत विचार रख सकता है। संवाद एक बड़ी चुनौती होगी।",
            challenges: ["लगातार गलतफहमियां", "विश्वास की कमी", "अलग जीवन प्राथमिकताएं"],
            advice: "यह मेल महत्वपूर्ण चुनौतियों का संकेत देता है। आगे बढ़ने से पहले मतभेदों पर सावधानीपूर्वक विचार करें।"
        },
        bad: {
            compatibility: 40,
            traits: ["अलग संचार शैलियां", "गलत अपेक्षाएं", "विभिन्न जीवनशैली प्राथमिकताएं"],
            personalityMatch: "हालांकि प्रारंभिक आकर्षण हो सकता है, जीवन और रिश्तों के प्रति बुनियादी दृष्टिकोण में अंतर तनाव का कारण बन सकता है।",
            challenges: ["संवाद की कमी", "अलग सामाजिक प्राथमिकताएं", "विभिन्न भावनात्मक जरूरतें"],
            advice: "सफलता के लिए दोनों पक्षों से पर्याप्त प्रयास और समझौते की आवश्यकता होगी।"
        },
        neutral: {
            compatibility: 60,
            traits: ["कुछ साझा रुचियां", "समान बुनियादी मूल्य", "अलग लेकिन पूरक व्यक्तित्व"],
            personalityMatch: "आपसी समझ के साथ सकारात्मक पहलुओं और चुनौतियों का संतुलित मेल। विकास की संभावना मौजूद है।",
            challenges: ["कभी-कभी गलत संचार", "समस्याओं के प्रति अलग दृष्टिकोण", "कुछ जीवनशैली समायोजन आवश्यक"],
            advice: "इस साझेदारी में क्षमता है लेकिन दोनों पक्षों से काम और समझ की आवश्यकता होगी।"
        },
        good: {
            compatibility: 80,
            traits: ["मजबूत भावनात्मक जुड़ाव", "समान जीवन लक्ष्य", "पूरक व्यक्तित्व"],
            personalityMatch: "दीर्घकालिक खुशी के लिए मजबूत क्षमता के साथ एक सामंजस्यपूर्ण मेल। आपकी भिन्नताएं एक-दूसरे को अच्छी तरह पूरक हैं।",
            challenges: ["दिनचर्या में मामूली समायोजन", "कुछ अलग रुचियां", "कभी-कभी मतभेद"],
            advice: "यह मेल एक संतोषजनक रिश्ते की आशाजनक संभावना दिखाता है।"
        },
        veryGood: {
            compatibility: 95,
            traits: ["गहरा भावनात्मक जुड़ाव", "संरेखित जीवन लक्ष्य", "मजबूत आपसी समझ"],
            personalityMatch: "स्थायी खुशी की महान क्षमता के साथ एक असाधारण मेल। आपकी ऊर्जाएं स्वाभाविक रूप से एक-दूसरे की पूरक हैं।",
            challenges: ["व्यक्तिगत विकास बनाए रखना", "स्वतंत्रता का संतुलन", "रोमांस को जीवंत रखना"],
            advice: "यह मेल दीर्घकालिक खुशी के लिए उत्कृष्त संभावनाओं के साथ एक अत्यधिक संगत साझेदारी का संकेत देता है।"
        }
    }
};
