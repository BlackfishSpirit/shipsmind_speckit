"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, Cog, Rocket } from "lucide-react";

const processSteps = [
  {
    step: 1,
    title: "Discovery & Assessment",
    description: "We analyze your current workflows and identify the biggest time-wasters and inefficiencies costing you money.",
    icon: Search,
    deliverable: "AI Opportunity Brief with ROI projections"
  },
  {
    step: 2, 
    title: "Solution Design",
    description: "We create a detailed implementation plan with specific AI tools and workflows tailored to your business needs.",
    icon: FileText,
    deliverable: "Complete project roadmap & requirements"
  },
  {
    step: 3,
    title: "Implementation", 
    description: "We build and configure your AI automation systems in short sprints, so you see progress every two weeks.",
    icon: Cog,
    deliverable: "Working AI solutions deployed & tested"
  },
  {
    step: 4,
    title: "Training & Optimization",
    description: "We train your team and continuously optimize the system to maximize ROI and ensure long-term success.",
    icon: Rocket,
    deliverable: "Team training & ongoing support plan"
  }
] as const;

export function ProcessOverview() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Our Proven 4-Phase Process
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We don't just throw technology at your problems. Our structured approach ensures 
            you get measurable results with minimal risk and maximum ROI.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {processSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isLast = index === processSteps.length - 1;
            
            return (
              <div key={step.step} className="relative">
                <Card className="h-full border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    {/* Step Number & Icon */}
                    <div className="mx-auto mb-4 relative">
                      <div className="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto">
                        <IconComponent className="h-8 w-8 text-brand-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-8 w-8 bg-brand-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{step.step}</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Deliverable
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {step.deliverable}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Connector Arrow */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-16 -right-4 transform translate-x-1/2">
                    <div className="h-0.5 w-8 bg-brand-300"></div>
                    <div className="absolute -right-2 -top-1.5 w-0 h-0 border-l-4 border-l-brand-300 border-y-2 border-y-transparent"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}