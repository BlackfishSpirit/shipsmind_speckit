"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  PlusCircle,
  Clock,
  Users,
  Target,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Filter,
  Search
} from 'lucide-react'

interface Feature {
  id: string
  name: string
  description: string
  status: 'backlog' | 'planning' | 'active' | 'review' | 'testing' | 'complete'
  priority: 'critical' | 'high' | 'medium' | 'low'
  epic?: string
  owner?: string
  estimatedHours: number
  tags: string[]
  businessValue: 'high' | 'medium' | 'low'
  technicalComplexity: 'high' | 'medium' | 'low'
  createdDate: string
  completedDate?: string
}

interface Epic {
  id: string
  name: string
  description: string
  status: 'planning' | 'in-progress' | 'complete'
  priority: 'critical' | 'high' | 'medium' | 'low'
  owner: string
  startDate?: string
  targetDate?: string
  features: string[]
}

const mockBacklogData = {
  epics: [
    {
      id: "epic-001",
      name: "Enhanced User Experience",
      description: "Improve overall user experience across the platform",
      status: "planning" as const,
      priority: "high" as const,
      owner: "Product Team",
      targetDate: "2025-03-01",
      features: ["feat-001", "feat-002", "feat-003"]
    }
  ],
  features: [
    {
      id: "feat-001",
      name: "Advanced Contact Form",
      description: "Enhanced contact form with validation, file uploads, and CRM integration",
      status: "backlog" as const,
      priority: "high" as const,
      epic: "epic-001",
      estimatedHours: 16,
      tags: ["frontend", "forms", "crm"],
      businessValue: "high" as const,
      technicalComplexity: "medium" as const,
      createdDate: "2025-01-17"
    },
    {
      id: "feat-002",
      name: "Client Testimonials Management",
      description: "Admin interface for managing client testimonials with filtering and approval workflow",
      status: "active" as const,
      priority: "medium" as const,
      epic: "epic-001",
      owner: "Dev Team",
      estimatedHours: 24,
      tags: ["admin", "content-management", "testimonials"],
      businessValue: "medium" as const,
      technicalComplexity: "medium" as const,
      createdDate: "2025-01-17"
    },
    {
      id: "feat-003",
      name: "SEO Optimization Suite",
      description: "Comprehensive SEO improvements including meta tags, structured data, and analytics",
      status: "complete" as const,
      priority: "medium" as const,
      epic: "epic-001",
      owner: "Marketing Team",
      estimatedHours: 32,
      tags: ["seo", "analytics", "marketing"],
      businessValue: "high" as const,
      technicalComplexity: "low" as const,
      createdDate: "2025-01-10",
      completedDate: "2025-01-16"
    }
  ]
}

const statusColors = {
  backlog: 'bg-gray-100 text-gray-800',
  planning: 'bg-blue-100 text-blue-800',
  active: 'bg-yellow-100 text-yellow-800',
  review: 'bg-purple-100 text-purple-800',
  testing: 'bg-orange-100 text-orange-800',
  complete: 'bg-green-100 text-green-800'
}

const priorityColors = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-blue-100 text-blue-800',
  low: 'bg-gray-100 text-gray-800'
}

const statusIcons = {
  backlog: '📝',
  planning: '🔍',
  active: '🔨',
  review: '👀',
  testing: '🧪',
  complete: '✅'
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>(mockBacklogData.features)
  const [epics, setEpics] = useState<Epic[]>(mockBacklogData.epics)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || feature.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusCount = (status: string) => {
    return features.filter(f => f.status === status).length
  }

  const getTotalEstimatedHours = () => {
    return features.reduce((total, f) => total + f.estimatedHours, 0)
  }

  const getCompletionRate = () => {
    const completed = features.filter(f => f.status === 'complete').length
    return Math.round((completed / features.length) * 100)
  }

  const FeatureCard = ({ feature }: { feature: Feature }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{statusIcons[feature.status]}</span>
              {feature.name}
            </CardTitle>
            <CardDescription className="text-sm">
              {feature.description}
            </CardDescription>
          </div>
          <Badge className={priorityColors[feature.priority]}>
            {feature.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <Badge className={statusColors[feature.status]}>
              {feature.status.replace('-', ' ')}
            </Badge>
            <span className="text-muted-foreground">
              {feature.estimatedHours}h estimated
            </span>
          </div>

          {feature.owner && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {feature.owner}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Created {feature.createdDate}
          </div>

          {feature.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {feature.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feature Tracking Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and track features across the development lifecycle
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="backlog">Backlog</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="epics">Epics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Features</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{features.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {getStatusCount('active')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {getStatusCount('complete')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estimated Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalEstimatedHours()}h</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
              <CardDescription>
                Overall completion rate across all features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Completion Rate</span>
                  <span>{getCompletionRate()}%</span>
                </div>
                <Progress value={getCompletionRate()} className="w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {features.slice(0, 3).map(feature => (
                  <div key={feature.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <Badge className={statusColors[feature.status]}>
                      {feature.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlog" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 border rounded-md w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="backlog">Backlog</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="review">Review</option>
              <option value="testing">Testing</option>
              <option value="complete">Complete</option>
            </select>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Feature
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeatures.map(feature => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.filter(f => ['active', 'review', 'testing'].includes(f.status)).map(feature => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="epics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {epics.map(epic => (
              <Card key={epic.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {epic.name}
                    <Badge className={priorityColors[epic.priority]}>
                      {epic.priority}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{epic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Owner: {epic.owner}</span>
                      <span>Target: {epic.targetDate}</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Features</span>
                        <span>{epic.features.length} total</span>
                      </div>
                      <div className="space-y-1">
                        {epic.features.map(featureId => {
                          const feature = features.find(f => f.id === featureId)
                          return feature ? (
                            <div key={featureId} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                              <span>{feature.name}</span>
                              <Badge className={statusColors[feature.status]} variant="outline">
                                {feature.status}
                              </Badge>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}