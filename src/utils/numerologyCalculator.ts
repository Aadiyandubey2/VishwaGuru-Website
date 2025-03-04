
export const calculateDestinyNumber = (name: string): number => {
  if (!name) return 0;
  
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  const letterValues: Record<string, number> = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
  };
  
  let sum = 0;
  for (const char of cleanName) {
    sum += letterValues[char] || 0;
  }
  
  return reduceToSingleDigit(sum);
};

export const calculateSoulUrgeNumber = (name: string): number => {
  if (!name) return 0;
  
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  
  const vowelValues: Record<string, number> = {
    'a': 1, 'e': 5, 'i': 9, 'o': 6, 'u': 3
  };
  
  let sum = 0;
  for (const char of cleanName) {
    if (vowels.includes(char)) {
      sum += vowelValues[char] || 0;
    }
  }
  
  return reduceToSingleDigit(sum);
};

export const calculatePersonalityNumber = (name: string): number => {
  if (!name) return 0;
  
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  
  const letterValues: Record<string, number> = {
    'b': 2, 'c': 3, 'd': 4, 'f': 6, 'g': 7, 'h': 8, 'j': 1, 'k': 2, 'l': 3,
    'm': 4, 'n': 5, 'p': 7, 'q': 8, 'r': 9, 's': 1, 't': 2, 'v': 4, 'w': 5,
    'x': 6, 'y': 7, 'z': 8
  };
  
  let sum = 0;
  for (const char of cleanName) {
    if (!vowels.includes(char)) {
      sum += letterValues[char] || 0;
    }
  }
  
  return reduceToSingleDigit(sum);
};

export const calculateLifePathNumber = (birthdate: string): number => {
  if (!birthdate) return 0;
  
  const [year, month, day] = birthdate.split('-').map(Number);
  
  if (!year || !month || !day) return 0;
  
  const dayNumber = reduceToSingleDigit(day);
  const monthNumber = reduceToSingleDigit(month);
  const yearNumber = reduceToSingleDigit(year);
  
  const sum = dayNumber + monthNumber + yearNumber;
  return reduceToSingleDigit(sum);
};

export const calculateBirthdayNumber = (birthdate: string): number => {
  if (!birthdate) return 0;
  
  const [, , day] = birthdate.split('-').map(Number);
  
  if (!day) return 0;
  
  return reduceToSingleDigit(day);
};

export const reduceToSingleDigit = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) {
    return num;
  }
  
  while (num > 9) {
    num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  
  return num;
};