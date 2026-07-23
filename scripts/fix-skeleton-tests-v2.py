#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix skeleton tests to pass at runtime.
The issue is Spring Cloud bootstrap runs before @SpringBootTest properties.
Fix: Add spring.cloud.bootstrap.enabled=false to prevent bootstrap entirely.
Also exclude Kafka and other auto-configs that could cause issues.
"""
import os
import sys
import glob

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BACKEND = r"C:\Users\chaka\Kartezy\backend"

# Properties that disable everything needed for a clean context-loading test
PROPERTIES_BLOCK = '''@SpringBootTest(properties = {
    "spring.cloud.bootstrap.enabled=false",
    "spring.cloud.config.enabled=false",
    "spring.cloud.config.import-check.enabled=false",
    "eureka.client.enabled=false",
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration"
})'''


def fix_test_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already has spring.cloud.bootstrap.enabled
    if 'spring.cloud.bootstrap.enabled' in content:
        svc = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(filepath)))))
        print(f"  SKIP (already has bootstrap property): {svc}")
        return False

    # Replace the entire @SpringBootTest annotation (with or without properties)
    import re
    
    # Match @SpringBootTest(properties = { ... }) or @SpringBootTest
    pattern = r'@SpringBootTest(?:\([^)]*\))?'
    match = re.search(pattern, content)
    if match:
        content = content.replace(match.group(0), PROPERTIES_BLOCK)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        svc = os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(filepath)))))
        print(f"  FIXED: {svc}")
        return True
    return False


def main():
    print("=" * 60)
    print("Fixing skeleton tests v2 - add bootstrap disable...")
    print("=" * 60)
    
    pattern = os.path.join(BACKEND, "*", "src", "test", "java", "com", "kartezy", "*", "*ApplicationTest.java")
    files = glob.glob(pattern)
    
    fixed = 0
    for filepath in sorted(files):
        if fix_test_file(filepath):
            fixed += 1
    
    print(f"\nFixed: {fixed}, Total files checked: {len(files)}")
    print("=" * 60)
    print("DONE")


if __name__ == "__main__":
    main()
