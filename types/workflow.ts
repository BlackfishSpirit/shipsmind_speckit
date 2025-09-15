export interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  category: 'setup' | 'development' | 'review' | 'deployment';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  completed: boolean;
  completedAt?: string;
  dependencies?: string[]; // IDs of tasks that must be completed first
  commands?: string[]; // Slash commands or CLI commands to execute
  documentation?: string; // Link to relevant docs
  autoDetectable?: boolean; // Can we auto-detect if this is done?
}

export interface WorkflowSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  tasks: WorkflowTask[];
}

export interface UserProgress {
  username: string;
  lastUpdated: string;
  currentSection?: string;
  completedTasks: string[];
  notes?: { [taskId: string]: string };
}

export interface WorkflowData {
  version: string;
  sections: WorkflowSection[];
}