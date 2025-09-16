import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, ArrowRight, CheckCircle, Clock, DollarSign, PieChart } from "lucide-react";
import Link from "next/link";

export default function AccountingSolutionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-brand-100 rounded-lg">
                <Calculator className="h-12 w-12 text-brand-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              AI for Accounting Firms
            </h1>
            <p className="text-xl text-brand-600 font-medium mb-6">
              Transform bookkeeping into advisory services
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Revolutionize your accounting practice with AI automation that eliminates manual data entry,
              accelerates invoice processing, and frees up time for high-value advisory services.
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
                  <h3 className="font-semibold text-gray-900 mb-3">Manual data entry consuming time</h3>
                  <p className="text-gray-600">Hours spent manually entering receipts, invoices, and transactions instead of providing strategic financial advice to clients.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Invoice processing bottlenecks</h3>
                  <p className="text-gray-600">Slow invoice processing and approval workflows that delay payments and frustrate both clients and vendors.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Limited advisory service capacity</h3>
                  <p className="text-gray-600">Unable to offer high-value consulting services because too much time is spent on routine bookkeeping tasks.</p>
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
                    <h3 className="font-semibold text-gray-900 mb-2">Automated accounts payable</h3>
                    <p className="text-gray-600">AI-powered invoice processing that extracts data, matches purchase orders, and routes approvals automatically.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">AI expense categorization</h3>
                    <p className="text-gray-600">Machine learning algorithms that automatically categorize transactions with 99%+ accuracy, eliminating manual coding.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Financial insights dashboard</h3>
                    <p className="text-gray-600">Real-time analytics and reporting tools that help you provide strategic insights and advisory services to clients.</p>
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Comprehensive Accounting Automation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Receipt & invoice scanning</li>
                  <li>• OCR data extraction</li>
                  <li>• Automatic categorization</li>
                  <li>• Duplicate detection</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Approval routing</li>
                  <li>• Payment scheduling</li>
                  <li>• Reconciliation matching</li>
                  <li>• Compliance checking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Advisory Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Cash flow forecasting</li>
                  <li>• Profitability analysis</li>
                  <li>• Tax optimization insights</li>
                  <li>• Performance dashboards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Seamless Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["QuickBooks", "Xero", "Sage", "NetSuite"].map((platform) => (
              <Card key={platform} className="text-center">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">{platform}</span>
                  </div>
                  <p className="text-sm text-gray-600">Native integration</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-brand-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Revolutionize Your Accounting Practice?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Schedule a demo to see how AI automation can transform your firm from bookkeeping to strategic advisory services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-brand-600 hover:bg-gray-100">
              Schedule Demo
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