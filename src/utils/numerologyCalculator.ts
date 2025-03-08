// Helper function to reduce a number to a single digit (1-9)
const reduceToSingleDigit = (num: number): number => {
  if (num <= 9) return num;
  return reduceToSingleDigit(
    String(num)
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0)
  );
};

// Convert letter to number based on numerology chart
const letterToNumber = (letter: string): number => {
  const chart: { [key: string]: number } = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
  };
  return chart[letter.toLowerCase()] || 0;
};

// Calculate Destiny Number (based on full name)
export const calculateDestinyNumber = (name: string): number => {
  const sum = name
    .replace(/[^a-zA-Z]/g, '') // Remove non-alphabetic characters
    .split('')
    .reduce((total, letter) => total + letterToNumber(letter), 0);
  return reduceToSingleDigit(sum);
};

// Calculate Soul Urge Number (based on vowels in name)
export const calculateSoulUrgeNumber = (name: string): number => {
  const vowels = 'aeiou';
  const sum = name
    .toLowerCase()
    .split('')
    .reduce((total, letter) => {
      if (vowels.includes(letter)) {
        return total + letterToNumber(letter);
      }
      return total;
    }, 0);
  return reduceToSingleDigit(sum);
};

// Calculate Personality Number (based on consonants in name)
export const calculatePersonalityNumber = (name: string): number => {
  const vowels = 'aeiou';
  const sum = name
    .toLowerCase()
    .replace(/[^a-z]/g, '') // Remove non-alphabetic characters
    .split('')
    .reduce((total, letter) => {
      if (!vowels.includes(letter)) {
        return total + letterToNumber(letter);
      }
      return total;
    }, 0);
  return reduceToSingleDigit(sum);
};

// Calculate Life Path Number (based on birth date)
export const calculateLifePathNumber = (birthdate: string): number => {
  const [year, month, day] = birthdate.split('-').map(Number);
  const sum = reduceToSingleDigit(year) + reduceToSingleDigit(month) + reduceToSingleDigit(day);
  return reduceToSingleDigit(sum);
};

// Calculate Birthday Number (based on birth day)
export const calculateBirthdayNumber = (birthdate: string): number => {
  const day = parseInt(birthdate.split('-')[2]);
  return reduceToSingleDigit(day);
};