"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { solutions } from "@/data/solutions";
import { ArrowRight, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export function SolutionsOverview() {
  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Industry-Specific AI Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We don't offer generic "AI consulting." Instead, we've built specialized solution stacks 
            that solve the exact problems facing your industry every single day.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((solution) => {
            const IconComponent = solution.icon;
            
            return (
              <Card 
                key={solution.id} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 hover:border-brand-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-brand-100 rounded-lg group-hover:bg-brand-200 transition-colors">
                      <IconComponent className="h-6 w-6 text-brand-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {solution.title}
                      </CardTitle>
                    </div>
                  </div>
                  <p className="text-sm text-brand-600 font-medium">
                    {solution.tagline}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Problems Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Common Pain Points:
                    </h4>
                    <ul className="space-y-2">
                      {solution.problems.map((problem, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="mt-1.5 h-1.5 w-1.5 bg-red-400 rounded-full flex-shrink-0" />
                          <span className="text-sm text-gray-600">{problem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Our AI Solutions:
                    </h4>
                    <ul className="space-y-2">
                      {solution.solutions.map((solutionItem, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{solutionItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics Section */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="h-3 w-3 text-brand-600 mr-1" />
                        </div>
                        <div className="text-xs font-semibold text-gray-900">
                          {solution.metrics.timeSaved}
                        </div>
                        <div className="text-xs text-gray-500">saved</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        </div>
                        <div className="text-xs font-semibold text-gray-900">
                          {solution.metrics.revenueIncrease}
                        </div>
                        <div className="text-xs text-gray-500">revenue</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <ArrowRight className="h-3 w-3 text-purple-600 mr-1" />
                        </div>
                        <div className="text-xs font-semibold text-gray-900">
                          {solution.metrics.roi}
                        </div>
                        <div className="text-xs text-gray-500">ROI</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <Button 
                      asChild
                      variant="outline" 
                      className="w-full border-brand-600 text-brand-600 hover:bg-brand-50 group-hover:bg-brand-600 group-hover:text-white transition-all"
                    >
                      <Link href={solution.href}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Don't see your industry? We work with businesses in many other sectors.
          </p>
          <Button 
            size="lg"
            className="bg-brand-600 hover:bg-brand-700"
            onClick={() => {
              // TODO: Add custom consultation booking
              console.log("Custom consultation clicked");
            }}
          >
            Schedule Custom Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}