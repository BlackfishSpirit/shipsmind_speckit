import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, ArrowRight, CheckCircle, Clock, DollarSign, Phone, Calendar, FileText } from "lucide-react";
import Link from "next/link";

export default function TradesSolutionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-brand-100 rounded-lg">
                <Wrench className="h-12 w-12 text-brand-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              AI for Skilled Trades
            </h1>
            <p className="text-xl text-brand-600 font-medium mb-6">
              24/7 scheduling & customer service
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Never miss another emergency call or scheduling opportunity with AI-powered phone systems,
              automated scheduling, and instant mobile invoicing for trade professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Problems & Solutions */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Problems */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-2xl text-red-700">Common Pain Points</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Missing after-hours emergency calls</h3>
                  <p className="text-gray-600">Losing high-value emergency jobs because you can't answer the phone 24/7, especially during weekends and holidays.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Inefficient job scheduling</h3>
                  <p className="text-gray-600">Wasting time and fuel with poor route planning and scheduling conflicts that reduce daily job capacity.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Manual invoicing delays</h3>
                  <p className="text-gray-600">Delayed payments due to handwritten invoices and paper-based billing that slow down cash flow.</p>
                </div>
              </CardContent>
            </Card>

            {/* Solutions */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700">Our AI Solutions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">AI phone answering service</h3>
                    <p className="text-gray-600">24/7 AI receptionist that handles emergency calls, schedules appointments, and captures leads even when you're busy on a job.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Automated scheduling optimization</h3>
                    <p className="text-gray-600">Smart scheduling that optimizes routes, minimizes travel time, and maximizes the number of jobs you can complete per day.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Instant mobile invoicing</h3>
                    <p className="text-gray-600">Generate professional invoices on-site with photos, digital signatures, and instant payment processing to improve cash flow.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Solutions */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Complete Trade Business Automation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-brand-600" />
                  <CardTitle className="text-lg">24/7 Call Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Emergency call handling</li>
                  <li>• Appointment scheduling</li>
                  <li>• Lead qualification</li>
                  <li>• Call recording & notes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-brand-600" />
                  <CardTitle className="text-lg">Smart Scheduling</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Route optimization</li>
                  <li>• Technician availability</li>
                  <li>• Job time estimation</li>
                  <li>• Customer notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-brand-600" />
                  <CardTitle className="text-lg">Mobile Operations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Digital work orders</li>
                  <li>• Photo documentation</li>
                  <li>• Digital signatures</li>
                  <li>• Instant invoicing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Focus */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Specialized for Your Trade</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Plumbing", icon: "🔧" },
              { name: "HVAC", icon: "🌡️" },
              { name: "Electrical", icon: "⚡" },
              { name: "Roofing", icon: "🏠" },
              { name: "Carpentry", icon: "🔨" },
              { name: "Landscaping", icon: "🌱" },
              { name: "Appliance Repair", icon: "🔧" },
              { name: "Cleaning Services", icon: "🧽" }
            ].map((trade) => (
              <Card key={trade.name} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-2">{trade.icon}</div>
                  <p className="font-medium text-gray-900">{trade.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Success Story */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="bg-brand-50 border-brand-200">
            <CardContent className="pt-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Real Results from Trade Professionals</h3>
                <blockquote className="text-lg text-gray-700 italic mb-6 max-w-3xl mx-auto">
                  "Since implementing AI phone answering and scheduling, we've increased our daily job capacity by 40%
                  and never miss emergency calls. Our cash flow improved dramatically with instant invoicing."
                </blockquote>
                <div className="text-sm text-gray-600">
                  <strong>Mike Rodriguez</strong> - Rodriguez Plumbing & Heating
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Scale Your Trade Business?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Get a free consultation to discover how AI can help you handle more jobs, improve customer service, and boost profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-brand-600 hover:bg-gray-100">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-600">
              <Link href="/solutions">
                View All Solutions
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}