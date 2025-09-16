import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowRight, CheckCircle, TrendingUp, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

export default function RetailSolutionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-brand-100 rounded-lg">
                <ShoppingBag className="h-12 w-12 text-brand-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              AI for Local Retail
            </h1>
            <p className="text-xl text-brand-600 font-medium mb-6">
              Compete with Amazon on personalization
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your local retail business with AI-powered solutions that rival big box stores.
              Automate inventory management, enhance customer experiences, and boost sales with intelligent technology.
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
                  <h3 className="font-semibold text-gray-900 mb-3">Inventory stockouts losing sales</h3>
                  <p className="text-gray-600">Missing out on sales when popular items go out of stock, with no automated way to predict demand or reorder inventory.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Manual product photography costs</h3>
                  <p className="text-gray-600">Spending hundreds on professional product photos for e-commerce, eating into already thin retail margins.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Generic customer experiences</h3>
                  <p className="text-gray-600">Unable to offer personalized recommendations like Amazon, leading to lower customer satisfaction and repeat purchases.</p>
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
                    <h3 className="font-semibold text-gray-900 mb-2">AI inventory management</h3>
                    <p className="text-gray-600">Predictive analytics that forecast demand, automate reordering, and optimize stock levels to prevent stockouts and overstock.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Automated product photography</h3>
                    <p className="text-gray-600">AI-powered image enhancement and background removal tools that create professional product photos at a fraction of the cost.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personalized recommendations</h3>
                    <p className="text-gray-600">Customer behavior analysis that powers Amazon-style product recommendations, increasing average order value and customer loyalty.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-brand-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Retail Business?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation to see how AI can revolutionize your retail operations and compete with industry giants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-brand-600 hover:bg-gray-100">
              Schedule Free Consultation
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