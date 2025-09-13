"use client";

import { Card, CardContent } from "@/components/ui/card";
import { testimonials, stats } from "@/data/testimonials";
import { Quote, Star } from "lucide-react";

export function SocialProof() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Real Results from Real Businesses
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients say about the impact 
            AI automation has had on their operations and bottom line.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-brand-600 mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white border-gray-200 shadow-md">
              <CardContent className="p-8">
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-brand-200" />
                  <blockquote className="text-gray-700 italic pl-6">
                    "{testimonial.quote}"
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center">
                    <span className="text-brand-600 font-semibold text-lg">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </div>
                    <div className="text-xs text-brand-600 font-medium">
                      {testimonial.industry}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {testimonial.metrics.timeSaved}
                      </div>
                      <div className="text-xs text-gray-500">Time Saved</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        {testimonial.metrics.revenueIncrease}
                      </div>
                      <div className="text-xs text-gray-500">Revenue ↑</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {testimonial.metrics.paybackPeriod}
                      </div>
                      <div className="text-xs text-gray-500">Payback</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm">100% Client Satisfaction</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-sm">30-Day ROI Guarantee</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
              </div>
              <span className="text-sm">Ongoing Support Included</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}