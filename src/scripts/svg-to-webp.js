/**
 * SVG to WebP Converter Script
 * 
 * Usage:
 * 1. Install dependency (if not already installed):
 *    npm install sharp
 * 
 * 2. Run script:
 *    node scripts/svg-to-webp.js [directory_path]
 * 
 * Examples:
 *    node scripts/svg-to-webp.js                  # Convert in current directory
 *    node scripts/svg-to-webp.js src/assets       # Convert in specific directory
 * 
 * Description:
 *    Recursively finds all .svg files in the target directory, converts them
 *    to .webp format, and deletes the original files.
 *    
 *    NOTE: Converting SVG (vector) to WebP (raster) means you lose infinite scalability.
 *    Ensure this is what you want for your use case.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get directory from command line args or default to current directory
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

console.log(`Scanning for SVGs in: ${targetDir}`);

const convertFile = async (filePath) => {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const name = path.basename(filePath, ext);
  const newFilePath = path.join(dir, `${name}.webp`);

  try {
    // metadata() helps us get dimensions if needed, but sharp handles SVG rasterization automatically.
    // By default it uses 72 DPI. You can increase density for higher res if needed:
    // sharp(filePath, { density: 300 })
    
    await sharp(filePath)
      .webp({ quality: 100 })
      .toFile(newFilePath);
    
    console.log(`✅ Converted: ${name}.svg -> ${name}.webp`);
    
    // Delete original file
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
    } else if (path.extname(file).toLowerCase() === '.svg') {
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
