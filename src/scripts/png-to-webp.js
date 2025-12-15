/**
 * PNG to WebP Converter Script
 * 
 * Usage:
 * 1. Install dependency:
 *    npm install sharp
 * 
 * 2. Run script:
 *    node scripts/png-to-webp.js [directory_path]
 * 
 * Examples:
 *    node scripts/png-to-webp.js                  # Convert in current directory
 *    node scripts/png-to-webp.js src/assets       # Convert in specific directory
 * 
 * Description:
 *    Recursively finds all .png files in the target directory, converts them
 *    to .webp format using high quality settings, and deletes the original files.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get directory from command line args or default to current directory
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

console.log(`Scanning for PNGs in: ${targetDir}`);

const convertFile = async (filePath) => {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const name = path.basename(filePath, ext);
  const newFilePath = path.join(dir, `${name}.webp`);

  try {
    await sharp(filePath)
      .webp({ quality: 100 }) // Adjust quality as needed
      .toFile(newFilePath);
    
    console.log(`✅ Converted: ${name}.png -> ${name}.webp`);
    // Optional: Delete original file
    fs.unlinkSync(filePath); 
  } catch (err) {
    console.error(`❌ Error converting ${filePath}:`, err);
  }
};

const walkDir = async (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        await walkDir(filePath);
      }
    } else if (path.extname(file).toLowerCase() === '.png') {
      await convertFile(filePath);
    }
  }
};

(async () => {
  try {
    await walkDir(targetDir);
    console.log('✨ Conversion complete!');
  } catch (err) {
    console.error('Fatal error:', err);
  }
})();
