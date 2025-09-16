"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, Cog, Rocket } from "lucide-react";

const processSteps = [
  {
    step: 1,
    title: "Discovery & Assessment",
    description:
      "We analyze your current workflows and identify the biggest time-wasters and inefficiencies costing you money.",
    icon: Search,
    deliverable: "AI Opportunity Brief with ROI projections",
  },
  {
    step: 2,
    title: "Solution Design",
    description:
      "We create a detailed implementation plan with specific AI tools and workflows tailored to your business needs.",
    icon: FileText,
    deliverable: "Complete project roadmap & requirements",
  },
  {
    step: 3,
    title: "Implementation",
    description:
      "We build and configure your AI automation systems in short sprints, so you see progress every two weeks.",
    icon: Cog,
    deliverable: "Working AI solutions deployed & tested",
  },
  {
    step: 4,
    title: "Training & Optimization",
    description:
      "We train your team and continuously optimize the system to maximize ROI and ensure long-term success.",
    icon: Rocket,
    deliverable: "Team training & ongoing support plan",
  },
] as const;

export function ProcessOverview() {
  return (
    <section className="bg-spinx-dark py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-inter mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            OUR PROVEN 4-PHASE PROCESS
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300">
            We don't just throw technology at your problems. Our structured
            approach ensures you get measurable results with minimal risk and
            maximum ROI.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isLast = index === processSteps.length - 1;

            return (
              <div key={step.step} className="relative">
                <Card className="card-dark h-full border-gray-700 transition-all duration-500 hover:-translate-y-2 hover:border-spinx-lime/50 hover:shadow-2xl">
                  <CardHeader className="pb-4 text-center">
                    {/* Step Number & Icon */}
                    <div className="relative mx-auto mb-6">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-gray-700 bg-gray-800 transition-all duration-300 hover:border-spinx-lime/30">
                        <IconComponent className="h-10 w-10 text-spinx-lime" />
                      </div>
                      <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-spinx-lime shadow-lg">
                        <span className="text-lg font-bold text-black">
                          {step.step}
                        </span>
                      </div>
                    </div>

                    <CardTitle className="mb-2 text-xl font-semibold text-white transition-colors hover:text-spinx-lime">
                      {step.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="mb-6 leading-relaxed text-gray-300">
                      {step.description}
                    </p>

                    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Deliverable
                      </div>
                      <div className="text-sm font-medium text-spinx-lime">
                        {step.deliverable}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Connector Arrow */}
                {!isLast && (
                  <div className="absolute -right-4 top-20 hidden translate-x-1/2 transform lg:block">
                    <div className="h-0.5 w-8 bg-spinx-lime/30"></div>
                    <div className="absolute -right-2 -top-1.5 h-0 w-0 border-y-2 border-l-4 border-y-transparent border-l-spinx-lime/30"></div>
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
