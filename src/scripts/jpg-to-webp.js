/**
 * JPG/JPEG to WebP Converter Script
 * 
 * Usage:
 * 1. Install dependency:
 *    npm install sharp
 * 
 * 2. Run script:
 *    node scripts/jpg-to-webp.js [directory_path]
 * 
 * Examples:
 *    node scripts/jpg-to-webp.js                  # Convert in current directory
 *    node scripts/jpg-to-webp.js public/sample    # Convert in specific directory
 * 
 * Description:
 *    Recursively finds all .jpg and .jpeg files in the target directory, converts them
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

console.log(`🔍 Scanning for JPG/JPEG files in: ${targetDir}`);

const convertFile = async (filePath) => {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const name = path.basename(filePath, ext);
  const newFilePath = path.join(dir, `${name}.webp`);

  try {
    await sharp(filePath)
      .webp({ quality: 90 }) // 90% quality for good balance of size/quality
      .toFile(newFilePath);
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(filePath).size;
    const newSize = fs.statSync(newFilePath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
    
    console.log(`✅ Converted: ${name}${ext} -> ${name}.webp (${savings}% smaller)`);
    
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
      // Skip node_modules and .git directories
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        await walkDir(filePath);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') {
        await convertFile(filePath);
      }
    }
  }
};

(async () => {
  try {
    await walkDir(targetDir);
    console.log('✨ JPG to WebP conversion complete!');
  } catch (err) {
    console.error('Fatal error:', err);
  }
})();
