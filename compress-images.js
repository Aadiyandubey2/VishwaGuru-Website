const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageFiles = [
  'owner-photo.jpg',
  'support-qr-code.jpg',
  'VishwaGuruLogo.jpg',
  'VishwaGuruLogo.png',
  'vishwa.jpg'
];

// Ensure the optimized directory exists
const optimizedDir = path.join(__dirname, 'public', 'optimized');
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

async function compressImage(filename) {
  try {
    const inputPath = path.join(__dirname, filename);
    const outputPath = path.join(optimizedDir, filename);
    const ext = path.extname(filename).toLowerCase();
    
    console.log(`Optimizing ${filename}...`);
    
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(inputPath)
        .jpeg({ quality: 75, mozjpeg: true })
        .toFile(outputPath);
    } else if (ext === '.png') {
      await sharp(inputPath)
        .png({ quality: 75, compressionLevel: 9 })
        .toFile(outputPath);
    }
    
    // Get size stats
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    
    console.log(`✅ ${filename}: Reduced by ${savings}% (${(originalSize/1024).toFixed(2)}KB → ${(optimizedSize/1024).toFixed(2)}KB)`);
  } catch (error) {
    console.error(`Error optimizing ${filename}:`, error);
  }
}

async function optimizeImages() {
  console.log('Starting image optimization...');
  
  for (const file of imageFiles) {
    await compressImage(file);
  }
  
  console.log('Image optimization complete!');
}

optimizeImages();
