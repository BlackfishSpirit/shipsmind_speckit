"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Palette,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Lightbulb,
  Layers,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'

const designPhases = [
  {
    id: 'layout',
    title: 'Layout Phase',
    description: 'Create structural layouts using ASCII visualization',
    icon: <Layers className="h-5 w-5" />,
    estimatedTime: '10 min',
    status: 'pending' as const,
    steps: [
      'Generate 3-5 layout iterations',
      'Use ASCII format for quick visualization',
      'Focus on component placement',
      'Select preferred structure'
    ],
    command: '/design-layout',
    documentation: '/docs/frontend-design-workflow.md#stage-1-layout-phase'
  },
  {
    id: 'theme',
    title: 'Theme Design',
    description: 'Apply visual design language and color palettes',
    icon: <Palette className="h-5 w-5" />,
    estimatedTime: '15 min',
    status: 'pending' as const,
    steps: [
      'Generate color palette at colors.co',
      'Create 5 theme variations',
      'Apply design languages (modern, glass morphism, etc.)',
      'Select final theme'
    ],
    command: '/design-theme',
    documentation: '/docs/frontend-design-workflow.md#stage-2-theme-design'
  },
  {
    id: 'implementation',
    title: 'Interactive Implementation',
    description: 'Add animations, interactions, and functionality',
    icon: <Sparkles className="h-5 w-5" />,
    estimatedTime: '10 min',
    status: 'pending' as const,
    steps: [
      'Implement click animations',
      'Add hover effects',
      'Create interactive elements',
      'Test functionality in SuperDesign canvas'
    ],
    command: '/design-implement',
    documentation: '/docs/frontend-design-workflow.md#stage-3-implementation-animation'
  },
  {
    id: 'components',
    title: 'Component Conversion',
    description: 'Convert to production components using shadcn',
    icon: <Layers className="h-5 w-5" />,
    estimatedTime: '20 min',
    status: 'pending' as const,
    steps: [
      'Plan implementation with shadcn components',
      'Use shadcn MCP for proper context',
      'Implement with component library',
      'Apply custom themes with TweakCN'
    ],
    command: '/shadcn',
    documentation: '/docs/frontend-design-workflow.md#method-1-shadcn-component-implementation'
  }
]

const designResources = [
  {
    name: 'SuperDesign',
    description: 'VS Code extension for interactive design',
    url: 'https://marketplace.visualstudio.com/items?itemName=superdesign',
    category: 'Tool'
  },
  {
    name: 'Colors.co',
    description: 'AI-generated color palettes',
    url: 'https://colors.co',
    category: 'Colors'
  },
  {
    name: 'TweakCN',
    description: 'Theme customization for shadcn',
    url: 'https://tweak-cn.vercel.app',
    category: 'Themes'
  },
  {
    name: 'Animattopi',
    description: 'Curated animation effects',
    url: 'https://animattopi.vercel.app',
    category: 'Animation'
  },
  {
    name: 'shadcn/ui',
    description: 'Component library',
    url: 'https://ui.shadcn.com',
    category: 'Components'
  }
]

export default function DesignWorkflowPage() {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [completedPhases, setCompletedPhases] = useState<string[]>([])

  const handlePhaseComplete = (phaseId: string) => {
    if (!completedPhases.includes(phaseId)) {
      setCompletedPhases(prev => [...prev, phaseId])

      // Auto-advance to next phase
      const currentIndex = designPhases.findIndex(p => p.id === phaseId)
      if (currentIndex < designPhases.length - 1) {
        setCurrentPhase(currentIndex + 1)
      }
    }
  }

  const getPhaseStatus = (phaseId: string, index: number) => {
    if (completedPhases.includes(phaseId)) return 'completed'
    if (index === currentPhase) return 'active'
    if (index < currentPhase) return 'completed'
    return 'pending'
  }

  const overallProgress = (completedPhases.length / designPhases.length) * 100

  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold flex items-center gap-2">
          <Palette className="h-8 w-8 text-primary" />
          Front-End Design Workflow
        </h1>
        <p className="text-gray-600 mb-4">
          Modern UI/UX design workflow with SuperDesign, shadcn, and component libraries
        </p>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Workflow Progress</span>
            <span className="text-sm text-gray-500">
              {completedPhases.length} / {designPhases.length} phases complete
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Workflow */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Phases</CardTitle>
              <CardDescription>
                Follow these phases in order to create beautiful, functional designs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {designPhases.map((phase, index) => {
                  const status = getPhaseStatus(phase.id, index)
                  const isActive = status === 'active'
                  const isCompleted = status === 'completed'

                  return (
                    <Card
                      key={phase.id}
                      className={`transition-all ${
                        isActive ? 'border-primary shadow-sm' :
                        isCompleted ? 'border-green-200 bg-green-50' :
                        'border-gray-200'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-green-500 text-white' :
                            isActive ? 'bg-primary text-white' :
                            'bg-gray-200 text-gray-500'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> :
                             isActive ? phase.icon :
                             <span className="text-sm font-medium">{index + 1}</span>
                            }
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{phase.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {phase.estimatedTime}
                                </Badge>
                                {isCompleted && (
                                  <Badge variant="default" className="text-xs bg-green-500">
                                    Complete
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-gray-600 mb-3">{phase.description}</p>

                            <div className="space-y-2 mb-4">
                              {phase.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-center gap-2 text-sm">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                  {step}
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                {phase.command}
                              </code>

                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={phase.documentation} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Docs
                                </a>
                              </Button>

                              {isActive && !isCompleted && (
                                <Button
                                  size="sm"
                                  onClick={() => handlePhaseComplete(phase.id)}
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  Start Phase
                                </Button>
                              )}

                              {isCompleted && index < designPhases.length - 1 && (
                                <ArrowRight className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Quick Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Prerequisites</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• SuperDesign VS Code extension installed</li>
                  <li>• shadcn MCP server configured</li>
                  <li>• Color palette from colors.co</li>
                </ul>
              </div>

              <Button className="w-full" asChild>
                <a href="/docs/frontend-design-workflow.md" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Full Setup Guide
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Device Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Preview Modes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto p-3">
                  <Monitor className="h-4 w-4" />
                  <span className="text-xs">Desktop</span>
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto p-3">
                  <Tablet className="h-4 w-4" />
                  <span className="text-xs">Tablet</span>
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto p-3">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-xs">Mobile</span>
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                SuperDesign canvas supports all device previews
              </p>
            </CardContent>
          </Card>

          {/* Design Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Design Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {designResources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{resource.name}</h4>
                      <p className="text-xs text-gray-500">{resource.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {resource.category}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}