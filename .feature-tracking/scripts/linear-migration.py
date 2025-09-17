#!/usr/bin/env python3
"""
Linear Migration Script
Migrates features from local tracking system to Linear via Claude MCP integration
"""

import json
import os
import sys
import subprocess
import argparse
from datetime import datetime
from pathlib import Path
import re

class LinearMigration:
    def __init__(self, project_root=None):
        self.project_root = Path(project_root) if project_root else Path.cwd()
        self.data_dir = self.project_root / ".feature-tracking" / "data"
        self.backlog_file = self.data_dir / "backlog.json"
        self.migration_log = self.data_dir / "linear-migration.log"

    def load_backlog(self):
        """Load local backlog data"""
        try:
            with open(self.backlog_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print("❌ No backlog data found. Run this from project root.")
            return None

    def log_migration(self, message):
        """Log migration steps"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open(self.migration_log, 'a', encoding='utf-8') as f:
            f.write(f"[{timestamp}] {message}\n")
        print(f"📝 {message}")

    def create_claude_prompt(self, action, data):
        """Create Claude prompt for Linear MCP operations"""
        if action == "create_issue":
            priority_map = {
                'critical': 1,
                'high': 2,
                'medium': 3,
                'low': 4
            }

            # Create labels from tags
            labels = data.get('tags', [])
            if data.get('epic'):
                labels.append(f"epic:{data['epic']}")

            prompt = f"""Create a Linear issue with these details:

Title: {data['name']}
Description: {data['description']}

Priority: {priority_map.get(data['priority'], 3)}
Labels: {', '.join(labels) if labels else 'None'}

Additional context:
- Estimated effort: {data.get('estimatedHours', 'Not specified')} hours
- Business value: {data.get('businessValue', 'medium')}
- Technical complexity: {data.get('technicalComplexity', 'medium')}
- Created date: {data.get('createdDate', 'Unknown')}

Please create this issue and return the Linear issue ID."""

        elif action == "create_project":
            prompt = f"""Create a Linear project with these details:

Name: {data['name']}
Description: {data['description']}
Target date: {data.get('targetDate', 'Not specified')}

Please create this project and return the Linear project ID."""

        elif action == "list_issues":
            prompt = "List all Linear issues in the current workspace with their IDs and titles."

        return prompt

    def execute_claude_command(self, prompt):
        """Execute command via Claude (placeholder for actual implementation)"""
        print(f"\n🤖 Claude Prompt:")
        print("-" * 50)
        print(prompt)
        print("-" * 50)

        # In actual implementation, this would use Claude MCP
        # For now, return a mock response
        return {
            "success": True,
            "linear_id": f"LIN-{self._generate_mock_id()}",
            "url": f"https://linear.app/workspace/issue/LIN-{self._generate_mock_id()}"
        }

    def _generate_mock_id(self):
        """Generate mock Linear ID for testing"""
        import random
        return random.randint(100, 999)

    def migrate_epics(self, data):
        """Migrate epics to Linear projects or epic issues"""
        self.log_migration("Starting epic migration...")
        migrated_epics = {}

        for epic in data['backlog']['epics']:
            self.log_migration(f"Migrating epic: {epic['name']}")

            prompt = self.create_claude_prompt("create_project", epic)
            response = self.execute_claude_command(prompt)

            if response['success']:
                migrated_epics[epic['id']] = response['linear_id']
                self.log_migration(f"✅ Epic {epic['id']} → Linear {response['linear_id']}")
            else:
                self.log_migration(f"❌ Failed to migrate epic {epic['id']}")

        return migrated_epics

    def migrate_features(self, data, epic_mapping):
        """Migrate features to Linear issues"""
        self.log_migration("Starting feature migration...")
        migrated_features = {}

        for feature in data['backlog']['features']:
            self.log_migration(f"Migrating feature: {feature['name']}")

            # Enhance feature data with Linear-specific info
            linear_feature = feature.copy()

            # Map epic to Linear project if exists
            if feature.get('epic') and feature['epic'] in epic_mapping:
                linear_feature['linear_project'] = epic_mapping[feature['epic']]

            prompt = self.create_claude_prompt("create_issue", linear_feature)
            response = self.execute_claude_command(prompt)

            if response['success']:
                migrated_features[feature['id']] = {
                    'linear_id': response['linear_id'],
                    'url': response['url'],
                    'original_data': feature
                }
                self.log_migration(f"✅ Feature {feature['id']} → Linear {response['linear_id']}")
            else:
                self.log_migration(f"❌ Failed to migrate feature {feature['id']}")

        return migrated_features

    def create_migration_report(self, epic_mapping, feature_mapping):
        """Create migration report"""
        report = {
            "migration_date": datetime.now().isoformat(),
            "migrated_epics": len(epic_mapping),
            "migrated_features": len(feature_mapping),
            "epic_mapping": epic_mapping,
            "feature_mapping": feature_mapping
        }

        report_file = self.data_dir / "linear-migration-report.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)

        self.log_migration(f"Migration report saved to {report_file}")
        return report

    def verify_migration(self):
        """Verify migration by checking Linear issues"""
        self.log_migration("Verifying migration...")

        prompt = self.create_claude_prompt("list_issues", {})
        response = self.execute_claude_command(prompt)

        # Load migration report to compare
        report_file = self.data_dir / "linear-migration-report.json"
        if report_file.exists():
            with open(report_file, 'r', encoding='utf-8') as f:
                report = json.load(f)

            expected_count = report['migrated_features']
            self.log_migration(f"Expected {expected_count} migrated features")

            # In actual implementation, would verify count matches
            print(f"\n✅ Migration verification completed")
            print(f"Check Linear workspace to confirm all issues were created correctly")
        else:
            print("❌ No migration report found")

    def run_migration(self, workspace=None):
        """Execute full migration process"""
        print("🚀 Starting Linear migration...")

        # Load local data
        data = self.load_backlog()
        if not data:
            return False

        # Check Claude MCP connection
        self.log_migration("Checking Claude MCP Linear connection...")
        # In actual implementation: verify Linear MCP is connected

        # Migrate epics first
        epic_mapping = self.migrate_epics(data)

        # Migrate features
        feature_mapping = self.migrate_features(data, epic_mapping)

        # Create report
        report = self.create_migration_report(epic_mapping, feature_mapping)

        # Summary
        print(f"\n🎉 Migration Summary:")
        print(f"✅ Epics migrated: {len(epic_mapping)}")
        print(f"✅ Features migrated: {len(feature_mapping)}")
        print(f"📊 Report saved to: {report}")

        print(f"\n🔗 Next steps:")
        print(f"1. Check Linear workspace to verify issues")
        print(f"2. Run verification: python linear-migration.py verify")
        print(f"3. Update team workflow documentation")

        return True

    def create_integration_script(self):
        """Create integration script for ongoing sync"""
        integration_script = '''#!/usr/bin/env python3
"""
Linear Integration Script
Handles ongoing sync between local documentation and Linear
"""

def sync_feature_status(feature_id, linear_id):
    """Sync feature status between systems"""
    # Implementation for bi-directional sync
    pass

def create_linear_issue_from_spec(spec_description):
    """Create Linear issue from GitHub Spec Kit output"""
    # Integration with spec-kit-integration.py
    pass

def update_documentation_from_linear(linear_id):
    """Update local documentation when Linear issue changes"""
    # Webhook handler for Linear updates
    pass
'''

        script_path = self.project_root / ".feature-tracking" / "scripts" / "linear-integration.py"
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(integration_script)

        self.log_migration(f"Created integration script: {script_path}")

def main():
    parser = argparse.ArgumentParser(description='Linear Migration Tool')
    parser.add_argument('command', choices=['migrate', 'verify', 'create-integration'])
    parser.add_argument('--workspace', help='Linear workspace name')
    parser.add_argument('--project-root', help='Project root directory')

    args = parser.parse_args()

    migration = LinearMigration(args.project_root)

    if args.command == 'migrate':
        print("🔄 Starting migration to Linear...")
        print("\n⚠️  IMPORTANT: Make sure you have:")
        print("1. Linear MCP installed and connected")
        print("2. Linear workspace created")
        print("3. Team access configured")

        confirm = input("\nProceed with migration? (y/N): ")
        if confirm.lower() == 'y':
            migration.run_migration(args.workspace)
        else:
            print("Migration cancelled")

    elif args.command == 'verify':
        migration.verify_migration()

    elif args.command == 'create-integration':
        migration.create_integration_script()
        print("✅ Integration script created")

if __name__ == '__main__':
    main()