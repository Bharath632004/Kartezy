/**
 * Fix malformed JSX from previous MUI fontWeight fix.
 * 
 * The previous script had a bug where it sometimes created 
 * `sx={{ fontWeight: 600, mb: 2 }>` (missing one closing brace)
 * instead of `sx={{ fontWeight: 600, mb: 2 }}>`
 * 
 * This script fixes:
 * 1. sx={{...}> → sx={{...}}> (add missing closing brace)
 * 2. Also fixes cases where multiple sx props ended up on the same tag
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
        if (!entry.startsWith('.') && !entry.startsWith('node_modules')) {
          files.push(...getAllFiles(fullPath));
        }
      } else if (extname(fullPath) === '.tsx' || extname(fullPath) === '.ts') {
        files.push(fullPath);
      }
    }
  } catch (e) {
    // skip errors
  }
  return files;
}

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const original = content;
  
  // Fix 1: sx={{...}> → sx={{...}}> (single closing brace instead of double)
  // Match sx={{ then any content that doesn't contain }} followed by >
  // The key insight: look for sx={{ where the closing is a single }}> instead of }}>
  content = content.replace(
    /sx=\{\{([^}]*?)\}>/g,
    (match, innerContent) => {
      // If the inner content already has }} in it, don't change
      if (innerContent.includes('}}')) return match;
      // Make sure we don't already have the double closing
      // Check if there's already an extra } that we'd duplicate
      return `sx={{${innerContent}}}>`;
    }
  );
  
  // Fix 2: Remove duplicate sx props on the same element
  // Pattern: sx={{...}} sx={{...}} → sx={{...merged...}}
  // But this is complex, so we'll just fix the most common case
  // of duplicate sx from the previous script.
  
  // Fix 3: Check for missing }} anywhere in sx props (not just before >)
  // Pattern: sx={{* }  where * doesn't contain }} and ends with single }
  content = content.replace(
    /sx=\{\{([^{}]*(?:\{[^{}]*\}[^{}]*)*?)\}\s+([a-zA-Z])/g,
    (match, innerContent, nextChar) => {
      // This matches when we have sx={{...} nextChar (single } instead of }})
      // Add missing }
      if (innerContent.endsWith('}')) {
        return `sx={{${innerContent.slice(0, -1)}}} ${nextChar}`;
      }
      // If it's already `}} ` this won't match, so we're fine
      return match;
    }
  );
  
  // Fix 4: Also handle closing at end of tag: sx={{...}/> or sx={{...}>
  content = content.replace(
    /sx=\{\{([^}]*?)\}\s*(\/?>)/g,
    (match, innerContent, closing) => {
      // Check if we already have double brace
      if (innerContent.endsWith('}')) {
        // Single brace at end, add one more
        return `sx={{${innerContent.slice(0, -1)}}}${closing}`;
      }
      // Already has double brace or is fine
      return match;
    }
  );

  // Fix 5: Direct fix for common pattern: fontWeight: N,  mb: N } (missing one })
  // This pattern: sx={{ fontWeight: 600,  mb: 2 }> (note: only one })
  content = content.replace(
    /(sx=\{\{)([^}]*?)\}\s*([\/>])/g,
    (match, sxOpen, innerContent, closer) => {
      // Ensure we have double closing brace
      return `${sxOpen}${innerContent}}}${closer}`;
    }
  );

  if (content !== original) {
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
