// Astronomical constants
const J2000 = 2451545.0; // Julian date for Jan 1.5, 2000
const RAD = Math.PI / 180; // Convert degrees to radians
const DEG = 180 / Math.PI; // Convert radians to degrees

// Mathematical utility functions
export function mod360(x: number): number {
  return x - Math.floor(x / 360.0) * 360.0;
}

export function sinDeg(x: number): number {
  return Math.sin(x * RAD);
}

export function cosDeg(x: number): number {
  return Math.cos(x * RAD);
}

export function tanDeg(x: number): number {
  return Math.tan(x * RAD);
}

export function asinDeg(x: number): number {
  return Math.asin(x) * DEG;
}

export function atan2Deg(y: number, x: number): number {
  return Math.atan2(y, x) * DEG;
}

// Calculate Julian Day
export function calculateJulianDay(date: Date): number {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  const d = date.getDate() + date.getHours()/24.0 + date.getMinutes()/(24.0*60.0) + date.getSeconds()/(24.0*3600.0);
  
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
}

// Calculate Sun's position
export function calculateSunPosition(jd: number): number {
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

// Calculate Moon's position
export function calculateMoonPosition(jd: number): number {
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

// Calculate Hindu solar month (Saura Masa)
export function calculateSauraMasa(jd: number): number {
  const sunLong = calculateSunPosition(jd);
  return Math.floor(sunLong / 30) + 1;
}

// Calculate Hindu lunar month (Chandra Masa)
export function calculateChandraMasa(jd: number): number {
  const sunLong = calculateSunPosition(jd);
  const moonLong = calculateMoonPosition(jd);
  const newMoonLong = Math.floor(sunLong / 30) * 30;
  return Math.floor((moonLong - newMoonLong) / 30) + 1;
}