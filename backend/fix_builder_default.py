"""
Fix @Builder.Default warnings in user-service.
Adds @Builder.Default annotation before fields with default values 
in classes annotated with @Builder.
"""
import os
import re

user_service_dir = os.path.join(os.path.dirname(__file__), 'user-service/src/main/java/com/kartezy/userservice')

def fix_builder_default(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file has @Builder
    if '@Builder' not in content:
        return 0
    
    # Split into lines for processing
    lines = content.split('\n')
    new_lines = []
    i = 0
    fixed_count = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this line is a field with a default value (contains = followed by a value)
        # But NOT if it already has @Builder.Default
        field_pattern = re.match(r'^(\s+private\s+\w+[\w<>\[\]]*\s+\w+\s*=\s*[^;]+;)$', line)
        
        if field_pattern:
            # Check if previous non-empty line is NOT @Builder.Default
            # Look backwards through empty/comment lines
            prev_non_empty = None
            for j in range(len(new_lines) - 1, -1, -1):
                stripped = new_lines[j].strip()
                if stripped and not stripped.startswith('//') and not stripped.startswith('/*') and not stripped.startswith('*'):
                    prev_non_empty = stripped
                    break
            
            if prev_non_empty != '@Builder.Default':
                # Found a field with default value but no @Builder.Default
                new_lines.append(re.sub(r'^(\s+)private', r'\1@Builder.Default\n\1private', line))
                fixed_count += 1
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
        
        i += 1
    
    if fixed_count > 0:
        new_content = '\n'.join(new_lines)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  Fixed {fixed_count} fields in {os.path.basename(filepath)}")
    
    return fixed_count

total_fixed = 0
for root, dirs, files in os.walk(user_service_dir):
    for f in files:
        if f.endswith('.java'):
            filepath = os.path.join(root, f)
            count = fix_builder_default(filepath)
            total_fixed += count

print(f"\nTotal: {total_fixed} @Builder.Default annotations added")
