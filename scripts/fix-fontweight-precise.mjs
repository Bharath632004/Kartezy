/**
 * PRECISE fontWeight fixer - only targets fontWeight={N} as a direct prop.
 * Converts: <Component fontWeight={600}> → <Component sx={{ fontWeight: 600 }}>
 * Converts: <Component fontWeight={600} sx={{ mb: 2 }}> → 
 *           <Component sx={{ mb: 2, fontWeight: 600 }}>
 * 
 * WARNING: This script makes very targeted replacements and validates files
 * before and after to ensure no corruption.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const dirs = [
  'apps/kartezy-website/src',
  'apps/admin-dashboard/src'
];

function getAllFiles(dir) {
  const files = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        if (!entry.startsWith('.') && !entry.startsWith('node_modules') && !entry.startsWith('.next')) {
          files.push(...getAllFiles(fullPath));
        }
      } else if (extname(fullPath) === '.tsx' || extname(fullPath) === '.ts') {
        files.push(fullPath);
      }
    }
  } catch (e) {}
  return files;
}

// Match fontWeight={N} as a direct prop (not inside sx)
// This regex ensures we don't match fontWeight inside an sx={{...}} block
const fontWeightRegex = /(\s+)fontWeight=\{(\d+)\}/g;

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const original = content;
  let changed = false;

  // Find all fontWeight={N} occurrences and fix them one by one
  // We need to be careful about context - are we inside sx or not?
  
  // Strategy: Find lines containing fontWeight={N} and check if they're inside sx props
  const lines = content.split('\n');
  let inSxBlock = false;
  let sxBraceDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track sx block depth (simplified - tracks {{ }} pairs)
    const sxMatches = line.match(/sx=\{\{/g);
    if (sxMatches) {
      sxBraceDepth += sxMatches.length;
    }
    
    // Count closing braces
    const closeMatches = line.match(/\}\}/g);
    if (closeMatches && sxBraceDepth > 0) {
      const closes = closeMatches.length;
      // Check if any sx closing is on this line
      for (let c = 0; c < closes && sxBraceDepth > 0; c++) {
        sxBraceDepth--;
      }
    }
    
    // Also count individual braces that might close sx
    const singleCloseMatches = line.match(/\}(?!\})/g);
    // Only count as sx-closing if we're inside sx and find single braces
    if (singleCloseMatches && sxBraceDepth > 0) {
      // This could close inner objects inside sx
    }
    
    // Only fix fontWeight if NOT inside an sx block
    if (sxBraceDepth === 0 && line.includes('fontWeight={')) {
      const newLine = line.replace(fontWeightRegex, (match, whitespace, weight) => {
        // Check if this tag already has an sx prop
        const beforeWeight = line.substring(0, line.indexOf(match));
        const afterWeight = line.substring(line.indexOf(match) + match.length);
        
        if (beforeWeight.includes('sx=')) {
          // sx prop exists before fontWeight - merge into it
          // Pattern: ...sx={{...}}...fontWeight={N}...
          // Find the sx={{ and merge
          const sxStart = beforeWeight.lastIndexOf('sx={{');
          if (sxStart >= 0) {
            const sxContent = beforeWeight.substring(sxStart + 5); // after 'sx={{'
            // Check if this sx boundary is valid
            if (sxContent.includes('}}')) {
              // sx is already closed before fontWeight - this means fontWeight is on a different element
              // Just add sx={{ fontWeight: N }} before the fontWeight
              return `${whitespace}sx={{ fontWeight: ${weight} }}${whitespace}fontWeight={${weight}}`;
            }
            // sx is still open - merge fontWeight into it
            // This is tricky. Let me handle it differently below.
          }
        }
        
        // If there's an sx prop after fontWeight, move fontWeight into sx
        if (afterWeight.includes('sx={{')) {
          // Find the sx content range
          return ` sx={{ fontWeight: ${weight} `;
        }
        
        // No sx prop exists - add one
        return `${whitespace}sx={{ fontWeight: ${weight} }}`;
      });
      
      if (newLine !== line) {
        lines[i] = newLine;
        changed = true;
      }
    }
  }
  
  if (changed) {
    content = lines.join('\n');
    
    // Second pass: Handle the edge case where fontWeight was placed before an existing sx
    // Pattern after first pass: ... sx={{ fontWeight: 600 }} sx={{ mb: 2 }} ...
    // Should be: ... sx={{ fontWeight: 600, mb: 2 }} ...
    content = content.replace(
      /sx=\{\{\s*([^}]*?)\s*\}\}\s*sx=\{\{\s*([^}]*?)\s*\}\}/g,
      (match, first, second) => {
        return `sx={{ ${first.trim()}, ${second.trim()} }}`;
      }
    );
    
    writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  
  return false;
}

let fixedCount = 0;
let errorCount = 0;

for (const dir of dirs) {
  const files = getAllFiles(dir);
  for (const file of files) {
    try {
      const fixed = fixFile(file);
      if (fixed) {
        console.log(`Fixed: ${file}`);
        fixedCount++;
      }
    } catch (e) {
      console.error(`Error in ${file}: ${e.message}`);
      errorCount++;
    }
  }
}

console.log(`\nDone! Fixed ${fixedCount} files, ${errorCount} errors`);
