// This script helps fix circular dependencies and import issues
const fs = require('fs');
const path = require('path');

// Check if partnerPredictionCalculator.ts exists and is properly formatted
const calculatorPath = path.join(__dirname, 'src', 'utils', 'partnerPredictionCalculator.ts');
const dataPath = path.join(__dirname, 'src', 'utils', 'partnerPredictionData.ts');
const traitsPath = path.join(__dirname, 'src', 'utils', 'partnerDetailedTraits.ts');

// Ensure all files exist
if (!fs.existsSync(calculatorPath)) {
  console.error('partnerPredictionCalculator.ts does not exist!');
  process.exit(1);
}

if (!fs.existsSync(dataPath)) {
  console.error('partnerPredictionData.ts does not exist!');
  process.exit(1);
}

if (!fs.existsSync(traitsPath)) {
  console.error('partnerDetailedTraits.ts does not exist!');
  process.exit(1);
}

// Read file contents
const calculatorContent = fs.readFileSync(calculatorPath, 'utf8');
const dataContent = fs.readFileSync(dataPath, 'utf8');
const traitsContent = fs.readFileSync(traitsPath, 'utf8');

// Fix exports in partnerDetailedTraits.ts if needed
let updatedTraitsContent = traitsContent;
if (!traitsContent.includes('export interface DetailedTraits')) {
  updatedTraitsContent = traitsContent.replace('interface DetailedTraits', 'export interface DetailedTraits');
  fs.writeFileSync(traitsPath, updatedTraitsContent, 'utf8');
  console.log('Fixed DetailedTraits export in partnerDetailedTraits.ts');
}

// Fix exports in partnerPredictionData.ts if needed
let updatedDataContent = dataContent;
if (!dataContent.includes('export const predictionData')) {
  updatedDataContent = dataContent.replace('const predictionData', 'export const predictionData');
  fs.writeFileSync(dataPath, updatedDataContent, 'utf8');
  console.log('Fixed predictionData export in partnerPredictionData.ts');
}

console.log('Import fixes completed. Try building again.');
