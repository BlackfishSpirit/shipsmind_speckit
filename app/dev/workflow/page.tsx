"use client";

import { useState, useEffect } from "react";
import {
  WorkflowData,
  WorkflowSection,
  WorkflowTask,
  UserProgress,
} from "@/types/workflow";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Terminal,
  BookOpen,
} from "lucide-react";

export default function WorkflowChecklist() {
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [currentSection, setCurrentSection] = useState<string>("");

  useEffect(() => {
    loadWorkflowData();
    loadUserProgress();
  }, []);

  const loadWorkflowData = async () => {
    try {
      const response = await fetch("/api/dev/workflow");
      const data = await response.json();
      setWorkflowData(data);
      if (data.sections.length > 0) {
        setCurrentSection(data.sections[0].id);
      }
    } catch (error) {
      console.error("Failed to load workflow data:", error);
    }
  };

  const loadUserProgress = async () => {
    try {
      // Get username from environment or prompt
      const user = process.env.USER || process.env.USERNAME || "developer";
      setUsername(user);

      const response = await fetch(`/api/dev/workflow/progress?user=${user}`);
      if (response.ok) {
        const progress = await response.json();
        setUserProgress(progress);
        if (progress.currentSection) {
          setCurrentSection(progress.currentSection);
        }
      } else {
        // Create new user progress
        const newProgress: UserProgress = {
          username: user,
          lastUpdated: new Date().toISOString(),
          completedTasks: [],
          notes: {},
        };
        setUserProgress(newProgress);
      }
    } catch (error) {
      console.error("Failed to load user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, completed: boolean) => {
    if (!userProgress || !workflowData) return;

    const updatedProgress = {
      ...userProgress,
      completedTasks: completed
        ? [...userProgress.completedTasks, taskId]
        : userProgress.completedTasks.filter((id) => id !== taskId),
      lastUpdated: new Date().toISOString(),
      currentSection,
    };

    setUserProgress(updatedProgress);

    try {
      await fetch("/api/dev/workflow/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProgress),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const updateTaskNote = async (taskId: string, note: string) => {
    if (!userProgress) return;

    const updatedProgress = {
      ...userProgress,
      notes: { ...userProgress.notes, [taskId]: note },
      lastUpdated: new Date().toISOString(),
    };

    setUserProgress(updatedProgress);

    try {
      await fetch("/api/dev/workflow/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProgress),
      });
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const calculateProgress = (section: WorkflowSection) => {
    if (!userProgress) return 0;
    const completed = section.tasks.filter((task) =>
      userProgress.completedTasks.includes(task.id)
    ).length;
    return (completed / section.tasks.length) * 100;
  };

  const calculateOverallProgress = () => {
    if (!workflowData || !userProgress) return 0;
    const totalTasks = workflowData.sections.reduce(
      (acc, section) => acc + section.tasks.length,
      0
    );
    return (userProgress.completedTasks.length / totalTasks) * 100;
  };

  const isTaskBlocked = (task: WorkflowTask) => {
    if (!task.dependencies || !userProgress) return false;
    return task.dependencies.some(
      (depId) => !userProgress.completedTasks.includes(depId)
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getTaskIcon = (task: WorkflowTask) => {
    if (userProgress?.completedTasks.includes(task.id)) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    if (isTaskBlocked(task)) {
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
    }
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading workflow checklist...</div>
      </div>
    );
  }

  if (!workflowData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">
          Failed to load workflow data
        </div>
      </div>
    );
  }

  const currentSectionData = workflowData.sections.find(
    (s) => s.id === currentSection
  );

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">
          ShipsMind Development Workflow
        </h1>
        <p className="mb-4 text-gray-600">
          AI-powered development checklist for {username}
        </p>
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-gray-500">
              {userProgress?.completedTasks.length || 0} /{" "}
              {workflowData.sections.reduce(
                (acc, s) => acc + s.tasks.length,
                0
              )}{" "}
              tasks
            </span>
          </div>
          <Progress value={calculateOverallProgress()} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workflow Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {workflowData.sections.map((section) => (
                <Button
                  key={section.id}
                  variant={
                    currentSection === section.id ? "default" : "outline"
                  }
                  className="h-auto w-full justify-start p-3 text-left"
                  onClick={() => setCurrentSection(section.id)}
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{section.icon}</span>
                      <span className="font-medium">{section.title}</span>
                    </div>
                    <Progress
                      value={calculateProgress(section)}
                      className="mt-2 h-1 w-full"
                    />
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Current Section Tasks */}
        <div className="lg:col-span-3">
          {currentSectionData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{currentSectionData.icon}</span>
                  {currentSectionData.title}
                </CardTitle>
                <CardDescription>
                  {currentSectionData.description}
                </CardDescription>
                <Progress
                  value={calculateProgress(currentSectionData)}
                  className="h-2"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentSectionData.tasks.map((task) => (
                    <Card
                      key={task.id}
                      className={`transition-all ${
                        userProgress?.completedTasks.includes(task.id)
                          ? "border-green-200 bg-green-50"
                          : isTaskBlocked(task)
                            ? "border-orange-200 bg-orange-50"
                            : "hover:shadow-md"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={
                              userProgress?.completedTasks.includes(task.id) ||
                              false
                            }
                            onCheckedChange={(checked) =>
                              updateTaskStatus(task.id, checked as boolean)
                            }
                            disabled={isTaskBlocked(task)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              {getTaskIcon(task)}
                              <h3 className="font-semibold">{task.title}</h3>
                              <Badge variant={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge variant="outline">
                                {task.estimatedTime}
                              </Badge>
                            </div>
                            <p className="mb-3 text-gray-600">
                              {task.description}
                            </p>

                            {/* Commands */}
                            {task.commands && task.commands.length > 0 && (
                              <div className="mb-3">
                                <h4 className="mb-2 flex items-center gap-1 text-sm font-medium">
                                  <Terminal className="h-4 w-4" />
                                  Commands:
                                </h4>
                                <div className="space-y-1">
                                  {task.commands.map((command, idx) => (
                                    <code
                                      key={idx}
                                      className="block rounded bg-gray-100 px-2 py-1 text-sm"
                                    >
                                      {command}
                                    </code>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Documentation Link */}
                            {task.documentation && (
                              <div className="mb-3">
                                <Button variant="outline" size="sm" asChild>
                                  <a
                                    href={task.documentation}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <BookOpen className="mr-1 h-4 w-4" />
                                    Documentation
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            )}

                            {/* Dependencies */}
                            {task.dependencies &&
                              task.dependencies.length > 0 && (
                                <div className="mb-3">
                                  <h4 className="mb-1 text-sm font-medium">
                                    Dependencies:
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {task.dependencies.map((depId) => {
                                      const depTask = workflowData.sections
                                        .flatMap((s) => s.tasks)
                                        .find((t) => t.id === depId);
                                      const isDepCompleted =
                                        userProgress?.completedTasks.includes(
                                          depId
                                        );
                                      return depTask ? (
                                        <Badge
                                          key={depId}
                                          variant={
                                            isDepCompleted
                                              ? "default"
                                              : "destructive"
                                          }
                                          className="text-xs"
                                        >
                                          {depTask.title}
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}

                            {/* Notes */}
                            <div>
                              <Textarea
                                placeholder="Add notes for this task..."
                                value={userProgress?.notes?.[task.id] || ""}
                                onChange={(e) =>
                                  updateTaskNote(task.id, e.target.value)
                                }
                                className="text-sm"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
