#!/usr/bin/env python3
"""
Feature Management Script for ShipsMind Project
Handles creation, tracking, and management of features using templates and JSON data
"""

import json
import os
import sys
import argparse
from datetime import datetime
from pathlib import Path
import re

class FeatureManager:
    def __init__(self, project_root=None):
        self.project_root = Path(project_root) if project_root else Path.cwd()
        self.features_dir = self.project_root / "docs" / "features"
        self.data_dir = self.project_root / ".feature-tracking" / "data"
        self.templates_dir = self.features_dir / "templates"
        self.backlog_file = self.data_dir / "backlog.json"

    def load_backlog(self):
        """Load backlog data from JSON file"""
        try:
            with open(self.backlog_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return self._create_empty_backlog()

    def save_backlog(self, data):
        """Save backlog data to JSON file"""
        data['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
        self._update_metrics(data)

        os.makedirs(self.data_dir, exist_ok=True)
        with open(self.backlog_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def _create_empty_backlog(self):
        """Create empty backlog structure"""
        return {
            "version": "1.0.0",
            "lastUpdated": datetime.now().strftime('%Y-%m-%d'),
            "backlog": {"epics": [], "features": []},
            "completed": {"features": []},
            "metrics": {}
        }

    def _update_metrics(self, data):
        """Update backlog metrics"""
        backlog_features = len(data['backlog']['features'])
        completed_features = len(data['completed']['features'])
        total_estimated = sum(f.get('estimatedHours', 0) for f in data['backlog']['features'])

        data['metrics'] = {
            "totalFeatures": backlog_features + completed_features,
            "backlogFeatures": backlog_features,
            "completedFeatures": completed_features,
            "totalEstimatedHours": total_estimated,
            "completedHours": 0  # TODO: Track actual hours
        }

    def create_feature(self, name, description, priority="medium", epic=None,
                      estimated_hours=8, tags=None, business_value="medium", linear_issue=None):
        """Create a new feature and add to backlog"""

        # Generate feature ID
        data = self.load_backlog()
        feature_count = len(data['backlog']['features']) + len(data['completed']['features'])
        feature_id = f"feat-{feature_count + 1:03d}"

        # Create feature object
        feature = {
            "id": feature_id,
            "name": name,
            "description": description,
            "status": "backlog",
            "priority": priority,
            "epic": epic,
            "owner": None,
            "estimatedHours": estimated_hours,
            "tags": tags or [],
            "businessValue": business_value,
            "technicalComplexity": "medium",  # Default
            "createdDate": datetime.now().strftime('%Y-%m-%d'),
            "linearIssue": linear_issue  # Linear integration
        }

        # Add to backlog
        data['backlog']['features'].append(feature)
        self.save_backlog(data)

        # Create feature documentation
        self._create_feature_doc(feature)

        print(f"✅ Created feature: {feature_id} - {name}")
        return feature_id

    def _create_feature_doc(self, feature):
        """Create feature documentation from template"""
        template_path = self.templates_dir / "feature-template.md"

        if not template_path.exists():
            print(f"⚠️  Template not found: {template_path}")
            return

        # Read template
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()

        # Replace placeholders
        doc = template.replace('[Feature Name]', feature['name'])
        doc = doc.replace('[Backlog | Planning | In Progress | Review | Testing | Complete | Deprecated]',
                         feature['status'].title())
        doc = doc.replace('[Critical | High | Medium | Low]', feature['priority'].title())
        doc = doc.replace('[Date]', feature['createdDate'])

        # Create feature document
        safe_name = re.sub(r'[^\w\s-]', '', feature['name']).strip()
        safe_name = re.sub(r'[-\s]+', '-', safe_name).lower()

        feature_dir = self.features_dir / feature['status']
        os.makedirs(feature_dir, exist_ok=True)

        doc_path = feature_dir / f"{feature['id']}-{safe_name}.md"
        with open(doc_path, 'w', encoding='utf-8') as f:
            f.write(doc)

        print(f"📄 Created documentation: {doc_path}")

    def move_feature(self, feature_id, new_status):
        """Move feature to different status"""
        data = self.load_backlog()

        # Find feature in backlog
        feature = None
        for i, f in enumerate(data['backlog']['features']):
            if f['id'] == feature_id:
                feature = data['backlog']['features'].pop(i)
                break

        if not feature:
            print(f"❌ Feature {feature_id} not found in backlog")
            return False

        # Update status
        old_status = feature['status']
        feature['status'] = new_status

        # Handle completion
        if new_status == 'complete':
            feature['completedDate'] = datetime.now().strftime('%Y-%m-%d')
            data['completed']['features'].append(feature)
        else:
            data['backlog']['features'].append(feature)

        self.save_backlog(data)

        # Move documentation file
        self._move_feature_doc(feature, old_status, new_status)

        print(f"✅ Moved {feature_id} from {old_status} to {new_status}")
        return True

    def _move_feature_doc(self, feature, old_status, new_status):
        """Move feature documentation to appropriate directory"""
        safe_name = re.sub(r'[^\w\s-]', '', feature['name']).strip()
        safe_name = re.sub(r'[-\s]+', '-', safe_name).lower()

        old_path = self.features_dir / old_status / f"{feature['id']}-{safe_name}.md"

        if new_status == 'complete':
            new_dir = self.features_dir / "completed"
        else:
            new_dir = self.features_dir / "active"

        os.makedirs(new_dir, exist_ok=True)
        new_path = new_dir / f"{feature['id']}-{safe_name}.md"

        if old_path.exists():
            old_path.rename(new_path)
            print(f"📄 Moved documentation: {new_path}")

    def list_features(self, status=None):
        """List features, optionally filtered by status"""
        data = self.load_backlog()

        features = data['backlog']['features']
        if status:
            features = [f for f in features if f['status'] == status]

        if not features:
            print("No features found")
            return

        print(f"\n📋 Features ({len(features)} total):")
        print("-" * 80)

        for feature in features:
            status_emoji = {
                'backlog': '📝',
                'planning': '🔍',
                'active': '🔨',
                'review': '👀',
                'testing': '🧪',
                'complete': '✅'
            }.get(feature['status'], '❓')

            priority_emoji = {
                'critical': '🔥',
                'high': '⚡',
                'medium': '➡️',
                'low': '⬇️'
            }.get(feature['priority'], '❓')

            print(f"{status_emoji} {feature['id']} - {feature['name']}")
            print(f"   {priority_emoji} {feature['priority'].title()} | "
                  f"📅 {feature['createdDate']} | "
                  f"⏱️  {feature['estimatedHours']}h")
            print(f"   📖 {feature['description']}")
            if feature.get('linearIssue'):
                print(f"   🔗 Linear: {feature['linearIssue']}")
            print()

    def show_metrics(self):
        """Display backlog metrics"""
        data = self.load_backlog()
        metrics = data['metrics']

        print(f"\n📊 Project Metrics:")
        print("-" * 40)
        print(f"Total Features: {metrics['totalFeatures']}")
        print(f"Backlog: {metrics['backlogFeatures']}")
        print(f"Completed: {metrics['completedFeatures']}")
        print(f"Estimated Hours: {metrics['totalEstimatedHours']}")

        if metrics['backlogFeatures'] > 0:
            completion_rate = metrics['completedFeatures'] / metrics['totalFeatures'] * 100
            print(f"Completion Rate: {completion_rate:.1f}%")

def main():
    parser = argparse.ArgumentParser(description='Feature Management for ShipsMind Project')
    parser.add_argument('--project-root', help='Project root directory')

    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # Create feature command
    create_parser = subparsers.add_parser('create', help='Create a new feature')
    create_parser.add_argument('name', help='Feature name')
    create_parser.add_argument('description', help='Feature description')
    create_parser.add_argument('--priority', choices=['critical', 'high', 'medium', 'low'],
                             default='medium', help='Feature priority')
    create_parser.add_argument('--epic', help='Epic ID this feature belongs to')
    create_parser.add_argument('--hours', type=int, default=8, help='Estimated hours')
    create_parser.add_argument('--tags', nargs='*', help='Feature tags')
    create_parser.add_argument('--value', choices=['high', 'medium', 'low'],
                             default='medium', help='Business value')
    create_parser.add_argument('--linear', help='Linear issue ID (e.g., LIN-123)')

    # Move feature command
    move_parser = subparsers.add_parser('move', help='Move feature to different status')
    move_parser.add_argument('feature_id', help='Feature ID to move')
    move_parser.add_argument('status', choices=['backlog', 'planning', 'active', 'review', 'testing', 'complete'],
                           help='New status')

    # List features command
    list_parser = subparsers.add_parser('list', help='List features')
    list_parser.add_argument('--status', choices=['backlog', 'planning', 'active', 'review', 'testing', 'complete'],
                           help='Filter by status')

    # Metrics command
    subparsers.add_parser('metrics', help='Show project metrics')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    fm = FeatureManager(args.project_root)

    if args.command == 'create':
        fm.create_feature(
            name=args.name,
            description=args.description,
            priority=args.priority,
            epic=args.epic,
            estimated_hours=args.hours,
            tags=args.tags,
            business_value=args.value,
            linear_issue=args.linear
        )
    elif args.command == 'move':
        fm.move_feature(args.feature_id, args.status)
    elif args.command == 'list':
        fm.list_features(args.status)
    elif args.command == 'metrics':
        fm.show_metrics()

if __name__ == '__main__':
    main()