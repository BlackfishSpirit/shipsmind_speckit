#!/usr/bin/env python3
"""
GitHub Spec Kit Integration for Feature Management
Bridges GitHub Spec Kit output with our feature tracking system
"""

import json
import os
import sys
import subprocess
from pathlib import Path
from datetime import datetime
import re

class SpecKitIntegration:
    def __init__(self, project_root=None):
        self.project_root = Path(project_root) if project_root else Path.cwd()
        self.spec_dir = self.project_root / ".specify"
        self.features_dir = self.project_root / "docs" / "features"

    def create_feature_from_spec(self, spec_description, priority="medium"):
        """Create a feature from GitHub Spec Kit specification"""

        print(f"🔍 Creating specification with GitHub Spec Kit...")

        # Run GitHub Spec Kit to generate specification
        try:
            result = subprocess.run([
                "python", "scripts/specify.py", "init"
            ], cwd=self.project_root, capture_output=True, text=True)

            if result.returncode != 0:
                print(f"❌ GitHub Spec Kit init failed: {result.stderr}")
                return None

            # Generate the specification
            result = subprocess.run([
                "python", "scripts/specify.py", "--", "specify", spec_description
            ], cwd=self.project_root, capture_output=True, text=True)

            if result.returncode != 0:
                print(f"❌ GitHub Spec Kit specify failed: {result.stderr}")
                return None

            # Generate technical plan
            result = subprocess.run([
                "python", "scripts/specify.py", "--", "plan"
            ], cwd=self.project_root, capture_output=True, text=True)

            # Generate tasks
            result = subprocess.run([
                "python", "scripts/specify.py", "--", "tasks"
            ], cwd=self.project_root, capture_output=True, text=True)

        except Exception as e:
            print(f"❌ Error running GitHub Spec Kit: {e}")
            return None

        # Read generated specification files
        spec_data = self._read_spec_output()

        if not spec_data:
            print("⚠️  No specification data found")
            return None

        # Create feature using our feature manager
        feature_name = self._extract_feature_name(spec_description)

        # Import and use feature manager
        sys.path.append(str(self.project_root / ".feature-tracking" / "scripts"))
        from feature_manager import FeatureManager

        fm = FeatureManager(self.project_root)
        feature_id = fm.create_feature(
            name=feature_name,
            description=spec_description,
            priority=priority,
            tags=["spec-driven", "ai-generated"],
            business_value="medium"
        )

        # Enhance feature documentation with Spec Kit output
        self._enhance_feature_doc(feature_id, spec_data)

        print(f"✅ Feature {feature_id} created with GitHub Spec Kit integration")
        return feature_id

    def _read_spec_output(self):
        """Read GitHub Spec Kit output files"""
        spec_data = {}

        # Common Spec Kit output files
        spec_files = {
            'specification': self.spec_dir / "memory" / "specification.md",
            'plan': self.spec_dir / "memory" / "plan.md",
            'tasks': self.spec_dir / "memory" / "tasks.md"
        }

        for key, file_path in spec_files.items():
            if file_path.exists():
                with open(file_path, 'r', encoding='utf-8') as f:
                    spec_data[key] = f.read()

        return spec_data

    def _extract_feature_name(self, description):
        """Extract a clean feature name from description"""
        # Take first 50 chars and clean up
        name = description[:50].strip()
        # Remove quotes and clean up
        name = re.sub(r'^["\']|["\']$', '', name)
        # Capitalize first word
        name = name[0].upper() + name[1:] if name else "New Feature"
        return name

    def _enhance_feature_doc(self, feature_id, spec_data):
        """Enhance feature documentation with Spec Kit output"""

        # Find the feature document
        for status_dir in ['backlog', 'active']:
            pattern = f"{feature_id}-*.md"
            matches = list((self.features_dir / status_dir).glob(pattern))

            if matches:
                doc_path = matches[0]
                break
        else:
            print(f"⚠️  Feature document not found for {feature_id}")
            return

        # Read current document
        with open(doc_path, 'r', encoding='utf-8') as f:
            doc_content = f.read()

        # Insert Spec Kit output
        spec_section = "\n\n## GitHub Spec Kit Output\n\n"

        if 'specification' in spec_data:
            spec_section += "### Generated Specification\n\n"
            spec_section += "```markdown\n"
            spec_section += spec_data['specification']
            spec_section += "\n```\n\n"

        if 'plan' in spec_data:
            spec_section += "### Technical Plan\n\n"
            spec_section += "```markdown\n"
            spec_section += spec_data['plan']
            spec_section += "\n```\n\n"

        if 'tasks' in spec_data:
            spec_section += "### Generated Tasks\n\n"
            spec_section += "```markdown\n"
            spec_data['tasks']
            spec_section += "\n```\n\n"

        # Insert before the final "---" line
        if "---\n\n**Generated using:**" in doc_content:
            doc_content = doc_content.replace(
                "---\n\n**Generated using:**",
                spec_section + "---\n\n**Generated using:**"
            )
        else:
            doc_content += spec_section

        # Write back
        with open(doc_path, 'w', encoding='utf-8') as f:
            f.write(doc_content)

        print(f"📄 Enhanced {doc_path} with GitHub Spec Kit output")

    def sync_with_specify(self, feature_id):
        """Sync feature progress back to Specify memory"""
        # This could update .specify/memory with implementation progress
        # and feed back to Specify for continuous development
        pass

def main():
    import argparse

    parser = argparse.ArgumentParser(description='GitHub Spec Kit Integration')
    parser.add_argument('command', choices=['create-from-spec'])
    parser.add_argument('description', help='Feature description for Spec Kit')
    parser.add_argument('--priority', choices=['critical', 'high', 'medium', 'low'],
                       default='medium', help='Feature priority')
    parser.add_argument('--project-root', help='Project root directory')

    args = parser.parse_args()

    integration = SpecKitIntegration(args.project_root)

    if args.command == 'create-from-spec':
        integration.create_feature_from_spec(args.description, args.priority)

if __name__ == '__main__':
    main()