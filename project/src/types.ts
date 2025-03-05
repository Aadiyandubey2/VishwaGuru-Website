export interface NumerologyResult {
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  lifePathNumber: number;
  birthdayNumber: number;
}

export interface NumerologyInterpretation {
  number: number;
  englishTitle: string;
  hindiTitle: string;
  englishDescription: string;
  hindiDescription: string;
}

export type Language = 'english' | 'hindi';