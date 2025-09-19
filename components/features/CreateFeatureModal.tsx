"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PlusCircle,
  Palette,
  Code,
  Database,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react'

interface CreateFeatureModalProps {
  trigger?: React.ReactNode
  onFeatureCreated?: (feature: any) => void
}

const featureTypes = [
  {
    id: 'frontend-design',
    name: 'Front-End Design',
    description: 'UI/UX design workflow with SuperDesign, shadcn, and TweakCN',
    icon: <Palette className="h-5 w-5" />,
    workflow: 'frontend-design',
    tags: ['design', 'ui', 'frontend'],
    estimatedHours: '8-24',
    steps: [
      'SuperDesign layout phase (5 iterations)',
      'Theme design with color palettes',
      'Interactive implementation',
      'Component library conversion',
      'Theme customization'
    ]
  },
  {
    id: 'backend-api',
    name: 'Backend API',
    description: 'Server-side development with database integration',
    icon: <Database className="h-5 w-5" />,
    workflow: 'feature-development',
    tags: ['backend', 'api', 'database'],
    estimatedHours: '12-32',
    steps: [
      'API specification design',
      'Database schema creation',
      'Endpoint implementation',
      'Testing and validation',
      'Documentation'
    ]
  },
  {
    id: 'full-stack',
    name: 'Full-Stack Feature',
    description: 'Complete feature with frontend and backend components',
    icon: <Code className="h-5 w-5" />,
    workflow: 'feature-development',
    tags: ['fullstack', 'frontend', 'backend'],
    estimatedHours: '20-50',
    steps: [
      'Requirements analysis',
      'API design and implementation',
      'Frontend design and development',
      'Integration and testing',
      'Deployment and monitoring'
    ]
  },
  {
    id: 'security-review',
    name: 'Security Enhancement',
    description: 'Security-focused improvements and vulnerability fixes',
    icon: <Shield className="h-5 w-5" />,
    workflow: 'security-review',
    tags: ['security', 'vulnerability', 'compliance'],
    estimatedHours: '4-16',
    steps: [
      'Security assessment with Semgrep',
      'Vulnerability analysis',
      'Implementation of fixes',
      'Penetration testing',
      'Documentation and monitoring'
    ]
  },
  {
    id: 'performance',
    name: 'Performance Optimization',
    description: 'Speed and efficiency improvements',
    icon: <Zap className="h-5 w-5" />,
    workflow: 'feature-development',
    tags: ['performance', 'optimization'],
    estimatedHours: '6-20',
    steps: [
      'Performance profiling',
      'Bottleneck identification',
      'Optimization implementation',
      'Load testing',
      'Monitoring setup'
    ]
  }
]

export default function CreateFeatureModal({ trigger, onFeatureCreated }: CreateFeatureModalProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'type' | 'details'>('type')
  const [selectedType, setSelectedType] = useState<typeof featureTypes[0] | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    estimatedHours: 8,
    tags: [] as string[],
    businessValue: 'medium' as 'high' | 'medium' | 'low',
    technicalComplexity: 'medium' as 'high' | 'medium' | 'low'
  })

  const handleTypeSelect = (type: typeof featureTypes[0]) => {
    setSelectedType(type)
    setFormData(prev => ({
      ...prev,
      tags: type.tags,
      estimatedHours: parseInt(type.estimatedHours.split('-')[0])
    }))
    setStep('details')
  }

  const handleSubmit = () => {
    if (!selectedType) return

    const newFeature = {
      id: `feat-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      status: 'backlog' as const,
      priority: formData.priority,
      estimatedHours: formData.estimatedHours,
      tags: formData.tags,
      businessValue: formData.businessValue,
      technicalComplexity: formData.technicalComplexity,
      createdDate: new Date().toISOString().split('T')[0],
      workflowType: selectedType.id,
      workflowPath: selectedType.workflow
    }

    onFeatureCreated?.(newFeature)

    // Reset form
    setStep('type')
    setSelectedType(null)
    setFormData({
      name: '',
      description: '',
      priority: 'medium',
      estimatedHours: 8,
      tags: [],
      businessValue: 'medium',
      technicalComplexity: 'medium'
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Feature
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'type' ? 'Choose Feature Type' : 'Feature Details'}
          </DialogTitle>
          <DialogDescription>
            {step === 'type'
              ? 'Select the type of feature you want to create. Each type has a specialized workflow.'
              : `Complete the details for your ${selectedType?.name} feature.`
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'type' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {featureTypes.map((type) => (
              <Card
                key={type.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                onClick={() => handleTypeSelect(type)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {type.icon}
                    {type.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Time:</span>
                      <Badge variant="outline">{type.estimatedHours}h</Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {type.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Workflow Steps:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {type.steps.slice(0, 3).map((step, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-current rounded-full" />
                            {step}
                          </li>
                        ))}
                        {type.steps.length > 3 && (
                          <li className="text-muted-foreground/70">
                            +{type.steps.length - 3} more steps
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center text-primary text-sm font-medium pt-2">
                      Select this type
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === 'details' && selectedType && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              {selectedType.icon}
              <span className="font-medium">{selectedType.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('type')}
                className="ml-auto"
              >
                Change Type
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Feature Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    placeholder="Enter feature name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe what this feature will do"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: any) => setFormData(prev => ({...prev, priority: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Estimated Hours</label>
                    <Input
                      type="number"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData(prev => ({...prev, estimatedHours: parseInt(e.target.value) || 0}))}
                      min="1"
                      max="200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Value</label>
                    <Select
                      value={formData.businessValue}
                      onValueChange={(value: any) => setFormData(prev => ({...prev, businessValue: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Technical Complexity</label>
                    <Select
                      value={formData.technicalComplexity}
                      onValueChange={(value: any) => setFormData(prev => ({...prev, technicalComplexity: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Workflow Steps</label>
                  <Card>
                    <CardContent className="p-4">
                      <ul className="space-y-2 text-sm">
                        {selectedType.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                              {idx + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.description}
              >
                Create Feature
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}