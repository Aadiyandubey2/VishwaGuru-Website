import { predictionData, PartnerPrediction } from './partnerPredictionData';
import { calculateDestinyNumber, calculateLifePathNumber } from './numerologyCalculator';
import { DetailedTraits } from './partnerDetailedTraits';

export interface DetailedPartnerPrediction extends PartnerPrediction {
    detailedTraits: {
        virtues: string[];
        challenges: string[];
        relationships: string[];
        career: string[];
        lifestyle: string[];
        appearance: string[];
        personality: string[];
    };
    compatibilityFactors: {
        destinyCompatibility: number;
        lifePathCompatibility: number;
        overallCompatibility: number;
    };
}

export function calculatePartnerCompatibility(
    name: string,
    birthdate: string,
): number {
    const destinyNumber = calculateDestinyNumber(name);
    const lifePathNumber = calculateLifePathNumber(birthdate);

    const birthDate = new Date(birthdate);
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1;
    const birthDay = birthDate.getDate();

    const nameHash = name.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const dateHash = birthYear + birthMonth * 31 + birthDay * 12;

    let baseScore = (nameHash + dateHash) % 100;

    const diff = Math.abs(destinyNumber - lifePathNumber);
    if (diff < 2) baseScore += 5;
    else if (diff > 5) baseScore -= 5;

    if ([11, 22, 33].includes(destinyNumber) || [11, 22, 33].includes(lifePathNumber)) {
        baseScore += 3;
    }

    const nameLength = name.replace(/\s/g, '').length;
    baseScore += (nameLength % 7) - 3;

    return Math.max(20, Math.min(Math.round(baseScore), 95));
}

export function getPartnerPrediction(
    compatibility: number,
    language: 'english' | 'hindi',
    gender: 'male' | 'female'
): DetailedPartnerPrediction {
    const lang = language === 'english' ? 'en' : 'hi';
    const predictions = predictionData[lang];
    const genderTraits = DetailedTraits[gender === 'male' ? 'female' : 'male'][lang];

    let compatibilityLevel: 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good';
    let basePrediction: PartnerPrediction;

    if (compatibility < 30) {
        compatibilityLevel = 'very_bad';
        basePrediction = predictions.veryBad;
    } else if (compatibility < 45) {
        compatibilityLevel = 'bad';
        basePrediction = predictions.bad;
    } else if (compatibility < 60) {
        compatibilityLevel = 'neutral';
        basePrediction = predictions.neutral;
    } else if (compatibility < 75) {
        compatibilityLevel = 'good';
        basePrediction = predictions.good;
    } else {
        compatibilityLevel = 'very_good';
        basePrediction = predictions.veryGood;
    }

    const traits = genderTraits[compatibilityLevel];

    const destinyCompatibility = Math.min(compatibility + 5, 100);
    const lifePathCompatibility = Math.max(compatibility - 5, 0);
    const overallCompatibility = compatibility;

    return {
        ...basePrediction,
        detailedTraits: {
            virtues: traits.virtues,
            challenges: traits.challenges,
            relationships: traits.relationships,
            career: traits.career,
            lifestyle: traits.lifestyle,
            appearance: traits.appearance,
            personality: traits.personality
        },
        compatibilityFactors: {
            destinyCompatibility,
            lifePathCompatibility,
            overallCompatibility
        }
    };
}
