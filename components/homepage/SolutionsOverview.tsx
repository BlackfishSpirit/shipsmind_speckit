"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { solutions } from "@/data/solutions";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export function SolutionsOverview() {
  return (
    <section id="solutions" className="bg-gray-900 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-inter mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            INDUSTRY-SPECIFIC AI SOLUTIONS
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300">
            We don't offer generic "AI consulting." Instead, we've built
            specialized solution stacks that solve the exact problems facing
            your industry every single day.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution) => {
            const IconComponent = solution.icon;

            return (
              <Card
                key={solution.id}
                className="card-dark group border-gray-700 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-spinx-lime/50 hover:shadow-2xl"
              >
                <CardHeader className="pb-4">
                  <div className="mb-4 flex items-center space-x-3">
                    <div className="rounded-lg bg-gray-800 p-3 transition-all duration-300 group-hover:bg-spinx-lime/10">
                      <IconComponent className="h-6 w-6 text-spinx-lime" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-white transition-colors group-hover:text-spinx-lime">
                        {solution.title}
                      </CardTitle>
                    </div>
                  </div>
                  <p className="text-sm font-medium uppercase tracking-wide text-spinx-lime">
                    {solution.tagline}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Problems Section */}
                  <div>
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Common Pain Points:
                    </h4>
                    <ul className="space-y-2">
                      {solution.problems.map((problem, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                          <span className="text-sm text-gray-300">
                            {problem}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions Section */}
                  <div>
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Our AI Solutions:
                    </h4>
                    <ul className="space-y-2">
                      {solution.solutions.map((solutionItem, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-spinx-lime" />
                          <span className="text-sm text-gray-200">
                            {solutionItem}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full bg-transparent border-spinx-lime/50 text-xs font-semibold uppercase tracking-wide text-spinx-lime transition-all duration-300 hover:border-spinx-lime hover:bg-spinx-lime hover:text-black group-hover:border-spinx-lime group-hover:bg-spinx-lime group-hover:text-black"
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
        <div className="mt-20 text-center">
          <p className="mb-8 text-lg text-gray-400">
            Don't see your industry? We work with businesses in many other
            sectors.
          </p>
          <Button
            size="lg"
            className="transform bg-spinx-lime px-8 py-4 text-lg font-semibold uppercase tracking-wide text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-spinx-lime-dark hover:shadow-2xl"
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
