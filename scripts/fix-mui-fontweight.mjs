/**
 * Script to fix MUI v9 fontWeight errors.
 * 
 * In MUI v9, `fontWeight` can no longer be a direct prop on Typography.
 * We need to move it to the `sx` prop.
 * 
 * Patterns fixed:
 * 1. <Typography fontWeight={600}> → <Typography sx={{ fontWeight: 600 }}>
 * 2. <Typography fontWeight={600} sx={{ mb: 2 }}> → <Typography sx={{ fontWeight: 600, mb: 2 }}>
 * 3. <Typography sx={{ mb: 2 }} fontWeight={600}> → <Typography sx={{ mb: 2, fontWeight: 600 }}>
 * 4. Also handles other components that might have this issue (Box, Button, etc.)
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

// Regex to find fontWeight as a direct prop (not inside sx)
// Matches: fontWeight={123} or fontWeight={123, something}
const fontWeightDirectRegex = /(\s+)fontWeight=\{(\d+)\}/g;

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const original = content;
  
  // Find all Typography (and other MUI) elements with fontWeight as direct prop
  // Pattern: <Tag ... fontWeight={N} ...> or <Tag ... fontWeight={N} sx={{...}} ...>
  
  // Case 1: fontWeight={N} followed by sx={{...}} or preceded by sx={{...}}
  // We need to merge fontWeight into the existing sx
  
  // First pass: fontWeight before sx - <Tag fontWeight={N} sx={{...}}>
  content = content.replace(
    /(<(?:Typography|Box|Button|Stack|Paper|Card|Grid|Container|AppBar|Toolbar|TableCell|TableRow|Link|Breadcrumbs|List|ListItem|Menu|MenuItem|Tab|Alert|Chip|Avatar|Badge|Stepper|StepLabel)\b[^>]*?)\s+fontWeight=\{(\d+)\}\s*(sx=\{(\{[^}]*\})\})/g,
    (match, tagStart, weight, sxFull, sxContent) => {
      // Add fontWeight inside the sx object
      const newSx = `sx={{ fontWeight: ${weight}, ${sxContent.slice(1)}`;
      return `${tagStart} ${newSx}`;
    }
  );
  
  // Second pass: sx after fontWeight - <Tag sx={{...}} fontWeight={N}>
  content = content.replace(
    /(<(?:Typography|Box|Button|Stack|Paper|Card|Grid|Container|AppBar|Toolbar|TableCell|TableRow|Link|Breadcrumbs|List|ListItem|Menu|MenuItem|Tab|Alert|Chip|Avatar|Badge|Stepper|StepLabel)\b[^>]*?)\s*(sx=\{(\{[^}]*\})\})\s+fontWeight=\{(\d+)\}/g,
    (match, tagStart, sxFull, sxContent, weight) => {
      // Add fontWeight inside the sx object
      const newSx = `sx={{ ${sxContent.slice(1, -1)}, fontWeight: ${weight} }}`;
      return `${tagStart} ${newSx}`;
    }
  );
  
  // Third pass: standalone fontWeight (no sx) - <Tag fontWeight={N}>
  content = content.replace(
    /(<(?:Typography|Box|Button|Stack|Paper|Card|Grid|Container|AppBar|Toolbar|TableCell|TableRow|Link|Breadcrumbs|List|ListItem|Menu|MenuItem|Tab|Alert|Chip|Avatar|Badge|Stepper|StepLabel)\b[^>]*?)\s+fontWeight=\{(\d+)\}/g,
    (match, tagStart, weight) => {
      return `${tagStart} sx={{ fontWeight: ${weight} }}`;
    }
  );
  
  // Also handle self-closing tags
  // Case: <Tag fontWeight={N} /> → <Tag sx={{ fontWeight: N }} />
  content = content.replace(
    /(<(?:Typography|Box|Button|Stack|Paper|Card|Grid|Container|AppBar|Toolbar)\b[^>]*?)\s+fontWeight=\{(\d+)\}\s*\/>/g,
    (match, tagStart, weight) => {
      return `${tagStart} sx={{ fontWeight: ${weight} }} />`;
    }
  );
  
  // Check for non-standard component names
  // Also handle components like <span> or generic tags that might use MUI system
  content = content.replace(
    /(<(?:span|div|p|h1|h2|h3|h4|h5|h6)\b[^>]*?\s+(?:component="[^"]*"|[^>]*?))\s+fontWeight=\{(\d+)\}(?!\s*=)/g,
    (match, tagStart, weight) => {
      // Only fix if it doesn't already have fontWeight in sx
      if (tagStart.includes('fontWeight')) return match;
      if (tagStart.includes('sx=')) {
        return tagStart.replace(/(sx=\{(\{[^}]*)\}?)\}/, `$1, fontWeight: ${weight} }}`);
      }
      return `${tagStart} sx={{ fontWeight: ${weight} }}`;
    }
  );
  
  // Also fix fontWeight on non-standard components that are styled MUI components
  // Like styled(Typography)`...` patterns - those are fine, skip them
  
  if (content !== original) {
    writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

let fixedCount = 0;
let errorCount = 0;

for (const dir of dirs) {
  console.log(`Scanning ${dir}...`);
  const files = getAllFiles(dir);
  console.log(`Found ${files.length} files`);
  
  for (const file of files) {
    try {
      const fixed = fixFile(file);
      if (fixed) {
        console.log(`  Fixed: ${file}`);
        fixedCount++;
      }
    } catch (e) {
      console.error(`  Error in ${file}: ${e.message}`);
      errorCount++;
    }
  }
}

console.log(`\nDone! Fixed ${fixedCount} files, ${errorCount} errors`);
