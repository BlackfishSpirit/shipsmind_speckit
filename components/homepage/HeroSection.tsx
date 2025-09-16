"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center bg-spinx-dark px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="font-inter mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Stop Drowning in Busywork. <br />
            <span className="gradient-text">Start Growing with AI.</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
            We help small businesses eliminate time-consuming manual tasks with
            proven AI solutions. Specialized automation for retail, professional
            services, and skilled trades.
          </p>

          {/* Key Benefits */}
          <div className="mt-12 flex flex-col items-center space-y-6 sm:flex-row sm:justify-center sm:space-x-12 sm:space-y-0">
            <div className="flex items-center space-x-3 text-gray-300">
              <Clock className="h-6 w-6 text-spinx-lime" />
              <span className="text-lg font-medium">Save time</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <TrendingUp className="h-6 w-6 text-spinx-lime" />
              <span className="text-lg font-medium">Increase Revenue</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <ArrowRight className="h-6 w-6 text-spinx-lime" />
              <span className="text-lg font-medium">Fast ROI</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-16 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0">
            <Button
              size="xl"
              className="transform bg-spinx-lime px-8 py-4 text-lg font-semibold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-spinx-lime-dark hover:shadow-2xl"
              onClick={() => {
                // Scroll to contact form
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              LET'S START WORKING TOGETHER
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="xl"
              className="border-gray-600 px-8 py-4 text-lg font-semibold text-gray-300 transition-all duration-300 hover:border-spinx-lime hover:bg-gray-800 hover:text-spinx-lime"
              onClick={() => {
                // TODO: Scroll to solutions section
                document
                  .getElementById("solutions")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              SEE SOLUTIONS
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 text-center">
            <p className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-400">
              Trusted by small businesses across industries
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-70">
              <div className="text-sm font-medium uppercase tracking-wide text-gray-500">
                Retail Stores
              </div>
              <div className="h-1 w-1 rounded-full bg-spinx-lime"></div>
              <div className="text-sm font-medium uppercase tracking-wide text-gray-500">
                Law Firms
              </div>
              <div className="h-1 w-1 rounded-full bg-spinx-lime"></div>
              <div className="text-sm font-medium uppercase tracking-wide text-gray-500">
                Accounting Firms
              </div>
              <div className="h-1 w-1 rounded-full bg-spinx-lime"></div>
              <div className="text-sm font-medium uppercase tracking-wide text-gray-500">
                Skilled Trades
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-800 opacity-20 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="hero-grid-pattern"
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
            fill="url(#hero-grid-pattern)"
          />
        </svg>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-spinx-dark opacity-50"></div>

        {/* Animated dots */}
        <div className="absolute left-1/4 top-1/4 h-2 w-2 animate-pulse rounded-full bg-spinx-lime opacity-30"></div>
        <div
          className="absolute right-1/4 top-3/4 h-1 w-1 animate-pulse rounded-full bg-spinx-lime opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute left-3/4 top-1/2 h-1.5 w-1.5 animate-pulse rounded-full bg-spinx-lime opacity-35"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </section>
  );
}
