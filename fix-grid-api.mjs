import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const dir = 'apps/admin-dashboard/src';

// Get all tsx files with old Grid API
const files = execSync(`grep -rl "Grid item" ${dir} --include="*.tsx"`, { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);

let totalFixes = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix patterns:
  // <Grid item xs={N} sm={M} md={L} key={...}>  --> <Grid size={{ xs: N, sm: M, md: L }} key={...}>
  // <Grid item xs={N} md={M}>  --> <Grid size={{ xs: N, md: M }}>
  // <Grid item xs={N}>  --> <Grid size={{ xs: N }}>
  // <Grid item>  --> <Grid>

  content = content.replace(
    /<Grid\s+item\s+(?:xs=\{(\d+)\}\s*)?(?:sm=\{(\d+)\}\s*)?(?:md=\{(\d+)\}\s*)?(?:lg=\{(\d+)\}\s*)?(?:xl=\{(\d+)\}\s*)?(key=\{.*?\})?\s*>/g,
    (match, xs, sm, md, lg, xl, key) => {
      const props = [];
      if (xs) props.push(`xs: ${xs}`);
      if (sm) props.push(`sm: ${sm}`);
      if (md) props.push(`md: ${md}`);
      if (lg) props.push(`lg: ${lg}`);
      if (xl) props.push(`xl: ${xl}`);
      
      const sizeStr = props.length > 0 ? ` size={{ ${props.join(', ')} }}` : '';
      const keyStr = key ? ` ${key}` : '';
      return `<Grid${sizeStr}${keyStr}>`;
    }
  );

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    const fixes = (content.match(/<Grid size=/g) || []).length - (original.match(/<Grid size=/g) || []).length;
    totalFixes += fixes;
    console.log(`Fixed ${fixes} Grid issues in ${path.relative(process.cwd(), file)}`);
  }
}

console.log(`\nTotal: ${totalFixes} Grid fixes applied across ${files.length} files`);
