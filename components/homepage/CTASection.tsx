"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Phone, Mail } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Main CTA Content */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
            Ready to Save 10+ Hours Per Week?
          </h2>
          
          <p className="text-xl text-brand-100 max-w-3xl mx-auto mb-8">
            Stop wasting time on manual tasks that AI can handle in seconds. 
            Schedule your free assessment and discover exactly how much time and money you could save.
          </p>

          {/* Value Props */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-10">
            <div className="flex items-center space-x-2 text-brand-100">
              <Calendar className="h-5 w-5" />
              <span>Free 30-minute assessment</span>
            </div>
            <div className="flex items-center space-x-2 text-brand-100">
              <ArrowRight className="h-5 w-5" />
              <span>Custom ROI projections</span>
            </div>
            <div className="flex items-center space-x-2 text-brand-100">
              <Phone className="h-5 w-5" />
              <span>No sales pressure</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Button 
              size="xl"
              className="bg-white text-brand-600 hover:bg-gray-100 shadow-lg text-lg px-8 py-4"
              onClick={() => {
                // TODO: Add Calendly integration
                console.log("Schedule assessment clicked");
              }}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Free Assessment
            </Button>
            
            <Button 
              size="xl"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
              onClick={() => {
                // TODO: Add contact form or phone number
                window.location.href = "tel:+1-555-AI-HELPS";
              }}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call: (555) AI-HELPS
            </Button>
          </div>

          {/* Contact Info */}
          <div className="text-center">
            <p className="text-brand-100 mb-4">
              Prefer email? We typically respond within 2 hours during business days.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Mail className="h-4 w-4 text-brand-200" />
              <a 
                href="mailto:hello@shipsmind.ai" 
                className="text-brand-200 hover:text-white transition-colors"
              >
                hello@shipsmind.ai
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-brand-500/20 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="cta-pattern"
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
            fill="url(#cta-pattern)"
          />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 h-24 w-24 bg-brand-400/20 rounded-full"></div>
      <div className="absolute -bottom-8 -right-8 h-32 w-32 bg-brand-400/10 rounded-full"></div>
    </section>
  );
}