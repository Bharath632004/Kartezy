/**
 * Fix merged sx props - V2: Handle the exact patterns found in the codebase.
 * 
 * Pattern: sx={{ fontWeight: 600  color="text.primary" sx={{ mb: 2 }}>
 * Pattern: sx={{ fontWeight: 600  textAlign="center" sx={{ mb: 8 }}>
 * Pattern: sx={{ fontWeight: 600  sx={{ mb: 2 }}>
 * 
 * Equivalent to intent: Move color/textAlign out of sx, merge the inner sx into the outer one.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const FILES = [
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

function fixFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf-8');
  let content = original;
  let changes = 0;

  // Pattern: sx={{ FONT_WEIGHT_PART  color="text.primary" sx={{ INNER_PROPS }}>
  // Fix: Split color="text.primary" out of sx, merge INNER_PROPS into the outer sx
  const colorPattern = /sx=\{\{\s*(fontWeight\s*:\s*\d+)\s+color="text\.primary"\s+sx=\{\{\s*([^}]*?)\s*\}\}\s*\}\}>/g;
  content = content.replace(colorPattern, (match, fontWeight, innerProps) => {
    changes++;
    const inner = innerProps.trim();
    return inner ? `color="text.primary" sx={{ ${fontWeight}, ${inner} }}>` : `color="text.primary" sx={{ ${fontWeight} }}>`;
  });

  // Pattern: sx={{ FONT_WEIGHT_PART  textAlign="center" sx={{ INNER_PROPS }}>
  // Fix: Split textAlign="center" out of sx, merge INNER_PROPS into the outer sx
  const textAlignPattern = /sx=\{\{\s*(fontWeight\s*:\s*\d+)\s+textAlign="center"\s+sx=\{\{\s*([^}]*?)\s*\}\}\s*\}\}>/g;
  content = content.replace(textAlignPattern, (match, fontWeight, innerProps) => {
    changes++;
    const inner = innerProps.trim();
    return inner ? `sx={{ ${fontWeight}, textAlign: 'center', ${inner} }}>` : `sx={{ ${fontWeight}, textAlign: 'center' }}>`;
  });

  // Pattern: sx={{ FONT_WEIGHT_PART  sx={{ INNER_PROPS }}>
  // Fix: Merge INNER_PROPS into the outer sx
  const nestedSxPattern = /sx=\{\{\s*(fontWeight\s*:\s*\d+)\s+sx=\{\{\s*([^}]*?)\s*\}\}\s*\}\}>/g;
  content = content.replace(nestedSxPattern, (match, fontWeight, innerProps) => {
    changes++;
    const inner = innerProps.trim();
    return inner ? `sx={{ ${fontWeight}, ${inner} }}>` : `sx={{ ${fontWeight} }}>`;
  });

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${path.relative(root, filePath)} — fixed ${changes} issue(s)`);
  } else {
    console.log(`✓ ${path.relative(root, filePath)} — no changes`);
  }
  return changes;
}

let total = 0;
for (const relPath of FILES) {
  total += fixFile(path.resolve(root, relPath));
}
console.log(`\nTotal: ${total} sx prop fixes applied`);
