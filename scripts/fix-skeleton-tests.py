#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix skeleton tests to pass at runtime by adding @SpringBootTest properties
that disable Config Server, Eureka, and database auto-configuration.
"""

import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BACKEND = r"C:\Users\chaka\Kartezy\backend"

# The properties block to add
PROPERTIES_BLOCK = '''@SpringBootTest(properties = {
    "spring.cloud.config.enabled=false",
    "eureka.client.enabled=false",
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration"
})'''

# Already-fixed services (have properties already)
ALREADY_FIXED = {'config-server', 'discovery-server', 'api-gateway'}

def fix_test_file(filepath):
    """Fix a single test file by adding @SpringBootTest properties."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has properties
    if '@SpringBootTest(properties' in content:
        service_folder = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(filepath)))))
        print(f"  SKIP (already has properties): {service_folder}")
        return False

    # Replace @SpringBootTest with the properties version
    old = '@SpringBootTest\n@ActiveProfiles("test")'
    new = PROPERTIES_BLOCK + '\n@ActiveProfiles("test")'
    
    if old in content:
        content = content.replace(old, new)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        service_folder = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(filepath)))))
        print(f"  FIXED: {service_folder}")
        return True
    else:
        print(f"  WARN: Pattern not found in {filepath}")
        return False


def main():
    print("=" * 60)
    print("Fixing skeleton tests for runtime pass...")
    print("=" * 60)
    print()

    import glob
    pattern = os.path.join(BACKEND, "*", "src", "test", "java", "com", "kartezy", "*", "*ApplicationTest.java")
    files = glob.glob(pattern)
    
    fixed = 0
    skipped = 0
    
    for filepath in sorted(files):
        if fix_test_file(filepath):
            fixed += 1
        else:
            skipped += 1
    
    print()
    print(f"Fixed: {fixed}, Skipped (already had properties): {skipped}")
    print("=" * 60)
    print("DONE - All skeleton tests updated!")
    print("=" * 60)


if __name__ == "__main__":
    main()
