import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight, CheckCircle, Clock, DollarSign, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function MarketingSolutionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-brand-100 rounded-lg">
                <TrendingUp className="h-12 w-12 text-brand-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              SEO and GEO Solutions
            </h1>
            <p className="text-xl text-brand-600 font-medium mb-6">
              Dominate local search & digital marketing
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Boost your online visibility with AI-powered SEO strategies, automated content creation,
              and intelligent campaign management that drives real business results.
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
                  <h3 className="font-semibold text-gray-900 mb-3">Low search engine visibility</h3>
                  <p className="text-gray-600">Your business is invisible to potential customers searching online, losing out to competitors who rank higher in Google searches.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Manual content creation workload</h3>
                  <p className="text-gray-600">Spending countless hours writing blog posts, social media content, and marketing copy that may not even be optimized for search engines.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Ineffective email campaigns</h3>
                  <p className="text-gray-600">Low open rates and conversions from email marketing due to poor segmentation, timing, and generic messaging that doesn't resonate.</p>
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
                    <h3 className="font-semibold text-gray-900 mb-2">AI-powered content creation</h3>
                    <p className="text-gray-600">Generate SEO-optimized blog posts, social media content, and marketing copy that ranks well and converts visitors into customers.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Automated keyword research</h3>
                    <p className="text-gray-600">Discover high-value, low-competition keywords automatically and optimize your content strategy for maximum search visibility.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Bulk email & CRM campaign management</h3>
                    <p className="text-gray-600">Intelligent email segmentation, personalization, and timing optimization that dramatically improves open rates and conversions.</p>
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Comprehensive Marketing Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Local SEO Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Google Business Profile optimization</li>
                  <li>• Local citation building</li>
                  <li>• Review management automation</li>
                  <li>• Geographic keyword targeting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Marketing Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• AI blog post generation</li>
                  <li>• Social media scheduling</li>
                  <li>• Video script creation</li>
                  <li>• Meta descriptions & titles</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Traffic source analysis</li>
                  <li>• Conversion tracking</li>
                  <li>• ROI measurement</li>
                  <li>• Competitor monitoring</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-brand-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Dominate Local Search Results?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Get a free SEO audit and discover how AI can transform your digital marketing strategy to attract more customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-brand-600 hover:bg-gray-100">
              Get Free SEO Audit
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