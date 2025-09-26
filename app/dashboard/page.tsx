import { auth, currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CalendarIcon,
  CogIcon,
  BoltIcon,
  BuildingOfficeIcon,
  ScaleIcon,
  CalculatorIcon,
  WrenchScrewdriverIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();

  const toolCategories = [
    {
      title: "Vertical Solutions",
      description: "Industry-specific AI automation tools",
      tools: [
        {
          name: "AI for Local Retail",
          description: "Inventory management, customer insights, and sales optimization",
          href: "/solutions/retail",
          icon: BuildingOfficeIcon,
          color: "bg-blue-500"
        },
        {
          name: "AI for Law Firms",
          description: "Document analysis, case management, and client communication",
          href: "/solutions/legal",
          icon: ScaleIcon,
          color: "bg-purple-500"
        },
        {
          name: "AI for Accounting",
          description: "Automated bookkeeping, expense tracking, and financial reporting",
          href: "/solutions/accounting",
          icon: CalculatorIcon,
          color: "bg-green-500"
        },
        {
          name: "AI for Skilled Trades",
          description: "Job scheduling, equipment tracking, and customer management",
          href: "/solutions/trades",
          icon: WrenchScrewdriverIcon,
          color: "bg-orange-500"
        }
      ]
    },
    {
      title: "Content & Education",
      description: "Manage your knowledge base and educational content",
      tools: [
        {
          name: "Content Hub",
          description: "Manage blog posts, case studies, and educational content",
          href: "/dashboard/content",
          icon: DocumentTextIcon,
          color: "bg-indigo-500"
        },
        {
          name: "Blog Management",
          description: "Create and publish blog posts about AI automation",
          href: "/dashboard/blog",
          icon: ChatBubbleLeftRightIcon,
          color: "bg-pink-500"
        }
      ]
    },
    {
      title: "Lead Management",
      description: "Capture, nurture, and convert potential clients",
      tools: [
        {
          name: "Lead Capture",
          description: "Forms, landing pages, and lead magnets",
          href: "/dashboard/leads",
          icon: UserGroupIcon,
          color: "bg-cyan-500"
        },
        {
          name: "Email Campaigns",
          description: "Automated email sequences and newsletters",
          href: "/dashboard/emails",
          icon: EnvelopeIcon,
          color: "bg-red-500"
        },
        {
          name: "Contact Management",
          description: "CRM integration and contact database",
          href: "/dashboard/contacts",
          icon: PhoneIcon,
          color: "bg-yellow-500"
        }
      ]
    },
    {
      title: "Booking & Scheduling",
      description: "Manage appointments and consultations",
      tools: [
        {
          name: "Calendar Integration",
          description: "Schedule consultations and manage availability",
          href: "/dashboard/calendar",
          icon: CalendarIcon,
          color: "bg-teal-500"
        }
      ]
    },
    {
      title: "Analytics & Automation",
      description: "Track performance and automate workflows",
      tools: [
        {
          name: "Analytics Dashboard",
          description: "Track website performance, lead conversion, and ROI",
          href: "/dashboard/analytics",
          icon: ChartBarIcon,
          color: "bg-blue-600"
        },
        {
          name: "Automation Workflows",
          description: "Create and manage automated business processes",
          href: "/dashboard/automation",
          icon: BoltIcon,
          color: "bg-purple-600"
        },
        {
          name: "Performance Tracking",
          description: "Monitor KPIs and business metrics",
          href: "/dashboard/performance",
          icon: PresentationChartLineIcon,
          color: "bg-green-600"
        }
      ]
    },
    {
      title: "Settings & Configuration",
      description: "Manage your account and system settings",
      tools: [
        {
          name: "Account Settings",
          description: "Profile, billing, and notification preferences",
          href: "/dashboard/settings",
          icon: CogIcon,
          color: "bg-gray-500"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">ShipsMind Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome back, {user?.firstName || 'User'}!
              </span>
              <UserButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              AI Automation Tools for Your Business
            </h2>
            <p className="text-gray-600">
              Access all your business automation tools and insights in one place. Save 10+ hours per week with smart AI solutions.
            </p>
          </div>

          <div className="space-y-8">
            {toolCategories.map((category) => (
              <div key={category.title} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.tools.map((tool) => {
                      const IconComponent = tool.icon;
                      return (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          className="group relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all duration-200"
                        >
                          <div className={`flex-shrink-0 rounded-lg p-3 ${tool.color}`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="focus:outline-none">
                              <span className="absolute inset-0" aria-hidden="true" />
                              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                {tool.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center">
              <BoltIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-blue-900">Quick Actions</h3>
                <p className="text-blue-700">Get started with these commonly used features</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/dashboard/leads"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-200 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Capture New Leads
              </Link>
              <Link
                href="/dashboard/analytics"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-200 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Analytics
              </Link>
              <Link
                href="/dashboard/automation"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-200 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Automation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}