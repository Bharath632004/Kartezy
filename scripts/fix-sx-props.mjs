/**
 * Fix merged sx props pattern: sx={{ fontWeight: 600  sx={{ mb: 2 }}}
 * These should be: sx={{ fontWeight: 600, mb: 2 }}
 * 
 * Also fix: sx={{ fontWeight: 600  color="text.primary" sx={{ mb: 2 }}}
 * Should be: sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
 * 
 * Also fix: sx={{ fontWeight: 600  textAlign="center" sx={{ mb: 8 }}}
 * Should be: sx={{ fontWeight: 600, textAlign: 'center', mb: 8 }}
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const websiteFiles = [
  'apps/kartezy-website/src/client-components/layout/Navigation.tsx',
  'apps/kartezy-website/src/client-components/layout/Footer.tsx',
  'apps/kartezy-website/src/client-components/home/HeroSectionWithSearch.tsx',
  'apps/kartezy-website/src/client-components/home/CategoriesSection.tsx',
  'apps/kartezy-website/src/client-components/home/CitiesSection.tsx',
  'apps/kartezy-website/src/client-components/home/DownloadAppSection.tsx',
  'apps/kartezy-website/src/client-components/home/FAQSection.tsx',
  'apps/kartezy-website/src/client-components/home/FeaturesSection.tsx',
  'apps/kartezy-website/src/client-components/home/TestimonialsSection.tsx',
  'apps/kartezy-website/src/app/products/page.tsx',
  'apps/kartezy-website/src/app/profile/page.tsx',
  'apps/kartezy-website/src/app/referral/page.tsx',
  'apps/kartezy-website/src/app/register/page.tsx',
  'apps/kartezy-website/src/app/search/page.tsx',
  'apps/kartezy-website/src/app/support/page.tsx',
  'apps/kartezy-website/src/app/tracking/page.tsx',
  'apps/kartezy-website/src/app/wallet/page.tsx',
];

// Pattern 1: sx={{ fontWeight: XXX  sx={{ YYY }}}
// Pattern 2: sx={{ fontWeight: XXX  color="text.primary" sx={{ YYY }}}
// Pattern 3: sx={{ fontWeight: XXX  textAlign="center" sx={{ YYY }}}

function fixSxProps(content) {
  // Pattern 3: ... fontWeight: XXX  textAlign="center" sx={{ YYY }}>
  // Fix: first merge textAlign into sx props
  content = content.replace(
    /sx=\{\{\s*((?:fontWeight:\s*\d+))\s+textAlign="center"\s+sx=\{\{\s*([^}]+)\s*\}\}\s*\}\}>/g,
    (match, fontWeightPart, innerProps) => {
      // Clean inner props
      const cleanInner = innerProps.trim();
      if (cleanInner) {
        return `sx={{ ${fontWeightPart}, textAlign: 'center', ${cleanInner} }}>`;
      } else {
        return `sx={{ ${fontWeightPart}, textAlign: 'center' }}>`;
      }
    }
  );

  // Pattern 2: ... fontWeight: XXX  color="text.primary" sx={{ YYY }}>
  content = content.replace(
    /sx=\{\{\s*((?:fontWeight:\s*\d+))\s+color="text\.primary"\s+sx=\{\{\s*([^}]+)\s*\}\}\s*\}\}>/g,
    (match, fontWeightPart, innerProps) => {
      const cleanInner = innerProps.trim();
      if (cleanInner) {
        return `sx={{ ${fontWeightPart}, color: 'text.primary', ${cleanInner} }}>`;
      } else {
        return `sx={{ ${fontWeightPart}, color: 'text.primary' }}>`;
      }
    }
  );

  // Pattern 1: ... fontWeight: XXX  sx={{ YYY }}>
  content = content.replace(
    /sx=\{\{\s*((?:fontWeight:\s*\d+))\s+sx=\{\{\s*([^}]+)\s*\}\}\s*\}\}>/g,
    (match, fontWeightPart, innerProps) => {
      const cleanInner = innerProps.trim();
      if (cleanInner) {
        return `sx={{ ${fontWeightPart}, ${cleanInner} }}>`;
      } else {
        return `sx={{ ${fontWeightPart} }}>`;
      }
    }
  );

  // Also handle non-fontWeight patterns like:
  // color={category.color} followed by sx={{ mb: 2 }} on same element
  // This one's trickier - handle the two-sx-props case on the same element
  
  return content;
}

let totalFixed = 0;

for (const relPath of websiteFiles) {
  const filePath = path.resolve(root, relPath);
  try {
    const original = fs.readFileSync(filePath, 'utf-8');
    const fixed = fixSxProps(original);
    if (original !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf-8');
      const changes = countChanges(original, fixed);
      totalFixed += changes;
      console.log(`✅ ${relPath} — fixed ${changes} issue(s)`);
    } else {
      console.log(`✓ ${relPath} — no changes needed`);
    }
  } catch (err) {
    console.error(`❌ ${relPath} — ${err.message}`);
  }
}

function countChanges(original, fixed) {
  const origLines = original.split('\n');
  const fixedLines = fixed.split('\n');
  let changes = 0;
  for (let i = 0; i < Math.min(origLines.length, fixedLines.length); i++) {
    if (origLines[i] !== fixedLines[i]) changes++;
  }
  // Also check if line count changed
  changes += Math.abs(origLines.length - fixedLines.length);
  return changes;
}

console.log(`\nTotal: ${totalFixed} sx prop fixes applied across ${websiteFiles.length} files`);
