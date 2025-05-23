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

// Enhanced compatibility calculation with more sophisticated logic
export function calculatePartnerCompatibility(
    name: string,
    birthdate: string,
): number {
    const destinyNumber = calculateDestinyNumber(name);
    const lifePathNumber = calculateLifePathNumber(birthdate);
    
    // Parse birthdate for additional factors
    const birthDate = new Date(birthdate);
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1;
    const birthDay = birthDate.getDate();
    
    let compatibilityScore = 0;
    
    // 1. Destiny Number Analysis (35% weight)
    let destinyScore = 0;
    if (destinyNumber === 1 || destinyNumber === 8) {
        destinyScore = 85; // Natural leaders, attract strong partners
    } else if (destinyNumber === 2 || destinyNumber === 6) {
        destinyScore = 90; // Natural harmonizers, excellent relationship potential
    } else if (destinyNumber === 3 || destinyNumber === 9) {
        destinyScore = 80; // Creative and compassionate, good partner material
    } else if (destinyNumber === 4 || destinyNumber === 7) {
        destinyScore = 75; // Stable but may need more effort in relationships
    } else if (destinyNumber === 5) {
        destinyScore = 70; // Freedom-loving, relationships require balance
    } else {
        destinyScore = 75; // Default for other numbers
    }
    
    // Master numbers get bonus
    if (destinyNumber === 11 || destinyNumber === 22 || destinyNumber === 33) {
        destinyScore += 10;
    }
    
    compatibilityScore += destinyScore * 0.35;
    
    // 2. Life Path Number Analysis (30% weight)
    let lifePathScore = 0;
    if (lifePathNumber >= 1 && lifePathNumber <= 3) {
        lifePathScore = 80; // Early numbers - good relationship foundation
    } else if (lifePathNumber >= 4 && lifePathNumber <= 6) {
        lifePathScore = 85; // Middle numbers - natural relationship builders
    } else if (lifePathNumber >= 7 && lifePathNumber <= 9) {
        lifePathScore = 75; // Higher numbers - more complex but rewarding
    } else if (lifePathNumber === 11) {
        lifePathScore = 90; // Master number - highly intuitive in relationships
    } else if (lifePathNumber === 22) {
        lifePathScore = 85; // Master builder - stable relationships
    } else if (lifePathNumber === 33) {
        lifePathScore = 95; // Master teacher - deeply caring in relationships
    }
    
    compatibilityScore += lifePathScore * 0.30;
    
    // 3. Birth Month Influence (15% weight)
    let monthScore = 0;
    if ([2, 6, 9].includes(birthMonth)) {
        monthScore = 85; // Love-oriented months
    } else if ([4, 7, 10].includes(birthMonth)) {
        monthScore = 80; // Relationship-focused months
    } else if ([1, 5, 8].includes(birthMonth)) {
        monthScore = 75; // Independent months
    } else {
        monthScore = 70; // Other months
    }
    
    compatibilityScore += monthScore * 0.15;
    
    // 4. Numerological Harmony Factor (10% weight)
    let harmonyScore = 0;
    const nameLength = name.replace(/\s/g, '').length;
    const birthdateSum = birthYear + birthMonth + birthDay;
    
    // Check for harmonic patterns
    if (destinyNumber + lifePathNumber === 10) {
        harmonyScore += 20; // Perfect complement
    } else if (Math.abs(destinyNumber - lifePathNumber) <= 2) {
        harmonyScore += 15; // Close harmony
    } else if ((destinyNumber + lifePathNumber) % 3 === 0) {
        harmonyScore += 10; // Numerological resonance
    }
    
    // Name-birth harmony
    if (nameLength % birthdateSum === 0 || birthdateSum % nameLength === 0) {
        harmonyScore += 15;
    }
    
    // Even/odd balance
    const evenNumbers = [destinyNumber, lifePathNumber, birthMonth, birthDay].filter(n => n % 2 === 0).length;
    if (evenNumbers === 2) {
        harmonyScore += 10; // Perfect balance
    }
    
    harmonyScore = Math.min(harmonyScore, 100);
    compatibilityScore += harmonyScore * 0.10;
    
    // 5. Seasonal and Temporal Bonuses (10% weight)
    let temporalScore = 70; // Base score
    
    // Season bonus
    const season = Math.floor((birthMonth - 1) / 3);
    const seasonBonus = [15, 10, 5, 12][season]; // Spring gets highest bonus for new beginnings
    temporalScore += seasonBonus;
    
    // Birth day numerology
    const dayReduced = birthDay > 9 ? Math.floor(birthDay / 10) + (birthDay % 10) : birthDay;
    if (dayReduced === destinyNumber || dayReduced === lifePathNumber) {
        temporalScore += 10; // Birthday resonance
    }
    
    // Year influence (last two digits)
    const yearEnding = birthYear % 100;
    const yearSum = Math.floor(yearEnding / 10) + (yearEnding % 10);
    if (yearSum === destinyNumber || yearSum === lifePathNumber) {
        temporalScore += 8;
    }
    
    compatibilityScore += temporalScore * 0.10;
    
    // Apply final adjustments
    compatibilityScore = Math.round(compatibilityScore);
    
    // Add controlled randomization based on name hash for consistency
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dateHash = birthYear + birthMonth * 31 + birthDay * 12;
    const combinedHash = (nameHash + dateHash) % 100;
    
    // Small adjustment based on hash (-5 to +5)
    const hashAdjustment = (combinedHash % 11) - 5;
    compatibilityScore += hashAdjustment;
    
    // Ensure realistic range (20-95)
    return Math.min(Math.max(compatibilityScore, 20), 95);
}

export function getPartnerPrediction(
    compatibility: number,
    language: 'english' | 'hindi',
    gender: 'male' | 'female'
): DetailedPartnerPrediction {
    const lang = language === 'english' ? 'en' : 'hi';
    const predictions = predictionData[lang];
    const genderTraits = DetailedTraits[gender === 'male' ? 'female' : 'male'][lang];

    // Determine compatibility level with refined thresholds
    let compatibilityLevel: 'very_bad' | 'bad' | 'neutral' | 'good' | 'very_good';
    let basePrediction: PartnerPrediction;

    if (compatibility < 30) {
        compatibilityLevel = 'very_bad';
        basePrediction = predictions.veryBad;
    } else if (compatibility < 50) {
        compatibilityLevel = 'bad';
        basePrediction = predictions.bad;
    } else if (compatibility < 70) {
        compatibilityLevel = 'neutral';
        basePrediction = predictions.neutral;
    } else if (compatibility < 85) {
        compatibilityLevel = 'good';
        basePrediction = predictions.good;
    } else {
        compatibilityLevel = 'very_good';
        basePrediction = predictions.veryGood;
    }

    const traits = genderTraits[compatibilityLevel];

    // Calculate more sophisticated compatibility factors
    const destinyCompatibility = Math.min(compatibility + Math.floor(compatibility * 0.1), 100);
    const lifePathCompatibility = Math.max(compatibility - Math.floor(compatibility * 0.08), 0);
    const overallCompatibility = compatibility;

    // Return enhanced prediction
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