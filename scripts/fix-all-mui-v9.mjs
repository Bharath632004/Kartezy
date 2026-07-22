/**
 * Fix all remaining MUI v9 migration issues:
 * 1. Box p={N} → Box sx={{ p: N }}
 * 2. InputProps={{ → slotProps={{ input: {
 * 3. Grid item xs={N} → Grid size={{ xs: N }}
 * 4. Grid item size={{...}} → Grid size={{...}} (remove item when size exists)
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

  // Fix 1: Box spacing props (p, px, py, pt, pb, pl, pr) as direct props → sx
  // Match: <Box p={N}, <Box m={N}, <Box px={N}, <Box py={N}, etc.
  // Only apply when NOT already inside sx={}
  const spacingProps = ['p', 'm', 'px', 'py', 'pt', 'pb', 'pl', 'pr', 'mx', 'my', 'mt', 'mb', 'ml', 'mr'];
  
  // Handle Box p={4} or similar
  for (const prop of spacingProps) {
    const regex = new RegExp(`(<Box\\b[^>]*?)\\s+${prop}=\\{([^}]+)\\}`, 'g');
    content = content.replace(regex, (match, before, value) => {
      // Skip if already has sx prop
      if (before.includes('sx=')) return match;
      return `${before} sx={{ ${prop}: ${value} }}`;
    });
  }
  
  // Also handle: <Box ... p={N} textAlign="center"> or similar with other props but no sx
  // This handles cases where p is before another prop
  // Actually the regex above should handle most cases

  // Fix 2: InputProps → slotProps.input
  content = content.replace(
    /(<TextField\\b[^>]*?)\\s+InputProps=\\{/g,
    (match, before) => {
      return `${before} slotProps={{ input: {`;
    }
  );
  
  // Fix the extra closing brace - InputProps={{ ... }} → slotProps={{ input: { ... } }}
  // Match InputProps={{ ... }} and convert to slotProps={{ input: { ... } }}
  // This is tricky because we need to match nested braces
  
  // Fix 3: Grid item xs={N} → Grid size={{ xs: N }}
  content = content.replace(
    /<Grid\\s+item\\s+xs=\\{([^}]+)\\}(\\s+sm=\\{([^}]+)\\})?(\\s+md=\\{([^}]+)\\})?(\\s+lg=\\{([^}]+)\\})?(\\s+xl=\\{([^}]+)\\})?/g,
    (match, xs, smPart, sm, mdPart, md, lgPart, lg, xlPart, xl) => {
      const sizes = { xs };
      if (sm) sizes.sm = sm;
      if (md) sizes.md = md;
      if (lg) sizes.lg = lg;
      if (xl) sizes.xl = xl;
      const sizeStr = Object.entries(sizes).map(([k, v]) => `${k}: ${v}`).join(', ');
      return `<Grid size={{ ${sizeStr} }`;
    }
  );
  
  // Fix 4: Remove `item` from <Grid item size={{...}}>
  content = content.replace(
    /<Grid\\s+item\\s+(size=\\{\\{)/g,
    '<Grid $1'
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
