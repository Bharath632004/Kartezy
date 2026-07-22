/**
 * Final comprehensive fix for all remaining MUI v9 prop migrations.
 * 
 * Patterns to fix:
 * 1. Stack alignItems="center" → Stack sx={{ alignItems: 'center' }}
 * 2. Stack justifyContent="center" → Stack sx={{ justifyContent: 'center' }}
 * 3. Stack flexWrap="wrap" → Stack sx={{ flexWrap: 'wrap' }}
 * 4. Box display="flex" → Box sx={{ display: 'flex' }}
 * 5. Box alignItems="center" → Box sx={{ alignItems: 'center' }} (when on Box)
 * 6. Box justifyContent="center" → Box sx={{ justifyContent: 'center' }} (when on Box)
 * 7. Typography flexGrow={N} → Typography sx={{ flexGrow: N }}
 * 8. Stack alignItems={{ xs: 'center', md: 'flex-start' }} → Stack sx={{ alignItems: { xs: 'center', md: 'flex-start' } }}
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

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const original = content;

  // Fix 1: Stack with standalone CSS props that need to move to sx
  // Pattern: <Stack ... alignItems="..." ...> or <Stack ... alignItems={{...}}>
  
  // Handle Stack with alignItems, justifyContent, flexWrap as direct props (need to move to sx)
  // We handle these one at a time with careful matching
  
  // alignItems on Stack
  content = content.replace(
    /(<Stack\b[^>]*?)\s+alignItems=\{?([^}>]+)\}?/g,
    (match, before, value) => {
      // Don't touch if already has sx
      if (before.includes('sx=')) {
        // Need to merge into existing sx
        return match.replace(/(sx=\{(\{[^}]*)\})\}?\s*alignItems=\{?([^}>]+)\}?/, (m, sxFull, sxInner, alignVal) => {
          return `sx={{ ${sxInner.slice(1, -1)}, alignItems: ${alignVal.trim()} }}`;
        });
      }
      return `${before} sx={{ alignItems: ${value.trim()} }}`;
    }
  );

  // justifyContent on Stack (second pass - handles already modified tags)
  content = content.replace(
    /(<Stack\b[^>]*?)\s+justifyContent=\{?([^}>]+)\}?/g,
    (match, before, value) => {
      if (before.includes('sx=') && !before.includes(`justifyContent`)) {
        return match.replace(/(sx=\{(\{[^}]*)\})/, (m, sxFull, sxInner) => {
          return `sx={{ ${sxInner.slice(1, -1)}, justifyContent: ${value.trim()} }}`;
        });
      }
      if (before.includes('sx=')) return match; // Already has justifyContent in sx
      return `${before} sx={{ justifyContent: ${value.trim()} }}`;
    }
  );

  // flexWrap on Stack
  content = content.replace(
    /(<Stack\b[^>]*?)\s+flexWrap=\{?([^}>]+)\}?/g,
    (match, before, value) => {
      if (before.includes('sx=') && !before.includes(`flexWrap`)) {
        return match.replace(/(sx=\{(\{[^}]*)\})/, (m, sxFull, sxInner) => {
          return `sx={{ ${sxInner.slice(1, -1)}, flexWrap: ${value.trim()} }}`;
        });
      }
      if (before.includes('sx=')) return match;
      return `${before} sx={{ flexWrap: ${value.trim()} }}`;
    }
  );
  
  // textAlign on Stack (if not already in sx)
  content = content.replace(
    /(<Stack\b[^>]*?)\s+textAlign=\{?([^}>]+)\}?/g,
    (match, before, value) => {
      if (before.includes('sx=')) {
        if (!before.includes('textAlign')) {
          return match.replace(/(sx=\{(\{[^}]*)\})/, (m, sxFull, sxInner) => {
            return `sx={{ ${sxInner.slice(1, -1)}, textAlign: ${value.trim()} }}`;
          });
        }
        return match;
      }
      return `${before} sx={{ textAlign: ${value.trim()} }}`;
    }
  );

  // Fix 2: Box with display, alignItems, justifyContent as direct props
  // Pattern: <Box display="flex" alignItems="center" ...>
  const boxCSSProps = ['display', 'alignItems', 'justifyContent', 'flexDirection', 'flexWrap', 'gap', 'textAlign'];
  for (const prop of boxCSSProps) {
    const regex = new RegExp(`(<Box\\b[^>]*?)\\s+${prop}=\\{?([^}>]+)\\}?`, 'g');
    content = content.replace(regex, (match, before, value) => {
      if (before.includes('sx=')) {
        // Merge into existing sx if not already there
        if (!before.includes(`${prop}:`)) {
          return match.replace(/(sx=\{(\{[^}]*)\})/, (m, sxFull, sxInner) => {
            return `sx={{ ${sxInner.slice(1, -1)}, ${prop}: ${value.trim()} }}`;
          });
        }
        return match;
      }
      return `${before} sx={{ ${prop}: ${value.trim()} }}`;
    });
  }

  // Fix 3: Typography with flexGrow as direct prop
  content = content.replace(
    /(<Typography\b[^>]*?)\s+flexGrow=\{([^}]+)\}/g,
    (match, before, value) => {
      if (before.includes('sx=')) {
        if (!before.includes('flexGrow')) {
          return match.replace(/(sx=\{(\{[^}]*)\})/, (m, sxFull, sxInner) => {
            return `sx={{ ${sxInner.slice(1, -1)}, flexGrow: ${value.trim()} }}`;
          });
        }
        return match;
      }
      return `${before} sx={{ flexGrow: ${value.trim()} }}`;
    }
  );

  // Fix 4: Grid with alignItems as direct prop
  content = content.replace(
    /(<Grid\b[^>]*?)\s+alignItems=\{?([^}>]+)\}?/g,
    (match, before, value) => {
      if (before.includes('sx=')) {
        if (!before.includes('alignItems')) {
          return match.replace(/(sx=\{(\{[^}]*)\})/, (m, sxFull, sxInner) => {
            return `sx={{ ${sxInner.slice(1, -1)}, alignItems: ${value.trim()} }}`;
          });
        }
        return match;
      }
      return `${before} sx={{ alignItems: ${value.trim()} }}`;
    }
  );
  
  // Fix 5: Grid with justifyContent as direct prop
  content = content.replace(
    /(<Grid\b[^>]*?)\s+justifyContent=\{?([^}>]+)\}?/g,
    (match, before, value) => {
      if (before.includes('sx=')) {
        if (!before.includes('justifyContent')) {
          return match.replace(/(sx=\{(\{[^}]*)\})/, (m, sxFull, sxInner) => {
            return `sx={{ ${sxInner.slice(1, -1)}, justifyContent: ${value.trim()} }}`;
          });
        }
        return match;
      }
      return `${before} sx={{ justifyContent: ${value.trim()} }}`;
    }
  );

  // Fix 6: Multiple SX props on same element (deduplicate)
  // Pattern: ...sx={{...}}...sx={{...}} → merge both into one sx
  content = content.replace(
    /(<[^>]+?sx=\{(\{[^}]*\})\})[^>]*?(sx=\{(\{[^}]*\})\})/g,
    (match, firstSxFull, firstSxInner, secondSxFull, secondSxInner) => {
      // Merge second sx into first
      const mergedSx = `sx={{ ${firstSxInner.slice(1, -1)}, ${secondSxInner.slice(1, -1)} }}`;
      return match.replace(firstSxFull, mergedSx).replace(secondSxFull, '');
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
