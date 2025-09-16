import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { solutions } from "@/data/solutions";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              Industry-Specific AI Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We don't offer generic "AI consulting." Instead, we've built specialized solution stacks
              that solve the exact problems facing your industry every single day.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution) => {
              const IconComponent = solution.icon;

              return (
                <Card
                  key={solution.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-brand-100 rounded-lg group-hover:bg-brand-200 transition-colors">
                        <IconComponent className="h-8 w-8 text-brand-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          {solution.title}
                        </CardTitle>
                        <p className="text-brand-600 font-medium">
                          {solution.tagline}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-brand-600">{solution.metrics.timeSaved}</div>
                        <div className="text-xs text-gray-600">time saved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{solution.metrics.revenueIncrease}</div>
                        <div className="text-xs text-gray-600">revenue boost</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{solution.metrics.roi}</div>
                        <div className="text-xs text-gray-600">ROI timeline</div>
                      </div>
                    </div>

                    {/* Problems Section */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Problems We Solve:
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
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Our AI Solutions:
                      </h4>
                      <ul className="space-y-2">
                        {solution.solutions.map((solutionItem, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <ArrowRight className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{solutionItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <Button
                        asChild
                        className="w-full bg-brand-600 hover:bg-brand-700"
                      >
                        <Link href={solution.href}>
                          Learn More About {solution.title}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-brand-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't See Your Industry?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            We work with businesses in many other sectors. Schedule a custom consultation to discuss your specific needs.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-brand-600 hover:bg-gray-100"
          >
            Schedule Custom Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}