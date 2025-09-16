"use client";

import { Card, CardContent } from "@/components/ui/card";
import { testimonials, stats } from "@/data/testimonials";
import { Quote, Star } from "lucide-react";

export function SocialProof() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Real Results from Real Businesses
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Don't just take our word for it. Here's what our clients say about
            the impact AI automation has had on their operations and bottom
            line.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold text-brand-600">
                {stat.number}
              </div>
              <div className="mb-2 text-lg font-semibold text-gray-900">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="border-gray-200 bg-white shadow-md"
            >
              <CardContent className="p-8">
                {/* Rating Stars */}
                <div className="mb-4 flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-current text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="absolute -left-2 -top-2 h-8 w-8 text-brand-200" />
                  <blockquote className="pl-6 italic text-gray-700">
                    "{testimonial.quote}"
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
                    <span className="text-lg font-semibold text-brand-600">
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </div>
                    <div className="text-xs font-medium text-brand-600">
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
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm">100% Client Satisfaction</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <div className="h-4 w-4 rounded-full bg-blue-500"></div>
              </div>
              <span className="text-sm">30-Day ROI Guarantee</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                <div className="h-4 w-4 rounded-full bg-purple-500"></div>
              </div>
              <span className="text-sm">Ongoing Support Included</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
