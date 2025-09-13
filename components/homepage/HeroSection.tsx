"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-brand-50 via-white to-brand-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Save{" "}
            <span className="gradient-text">10+ Hours Per Week</span>{" "}
            and Increase Revenue Through{" "}
            <span className="gradient-text">Smart AI Automation</span>
          </h1>
          
          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            We help small businesses eliminate time-consuming manual tasks with proven AI solutions. 
            Specialized automation for retail, professional services, and skilled trades.
          </p>

          {/* Key Benefits */}
          <div className="mt-8 flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-x-8 sm:space-y-0">
            <div className="flex items-center space-x-2 text-gray-700">
              <Clock className="h-5 w-5 text-brand-600" />
              <span className="font-medium">Save 10+ hours weekly</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <TrendingUp className="h-5 w-5 text-brand-600" />
              <span className="font-medium">Increase revenue 20-30%</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <ArrowRight className="h-5 w-5 text-brand-600" />
              <span className="font-medium">ROI in 30 days</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <Button 
              size="xl"
              className="bg-brand-600 hover:bg-brand-700 shadow-lg"
              onClick={() => {
                // TODO: Add calendar booking integration
                console.log("Schedule Assessment clicked");
              }}
            >
              Schedule Free AI Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              className="border-brand-600 text-brand-600 hover:bg-brand-50"
              onClick={() => {
                // TODO: Scroll to solutions section
                document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See Solutions
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Trusted by 100+ small businesses across industries
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-gray-400 text-sm font-medium">Retail Stores</div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="text-gray-400 text-sm font-medium">Law Firms</div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="text-gray-400 text-sm font-medium">Accounting Firms</div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="text-gray-400 text-sm font-medium">Skilled Trades</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
          />
        </svg>
      </div>
    </section>
  );
}