import { ShoppingBag, Scale, Calculator, Wrench } from "lucide-react";

export const solutions = [
  {
    id: "retail",
    title: "AI for Local Retail",
    icon: ShoppingBag,
    tagline: "Compete with Amazon on personalization",
    problems: [
      "Inventory stockouts losing sales",
      "Manual product photography costs",
      "Generic customer experiences"
    ],
    solutions: [
      "AI inventory management",
      "Automated product photography",
      "Personalized recommendations"
    ],
    metrics: {
      timeSaved: "12 hours/week",
      revenueIncrease: "25%",
      roi: "60 days"
    },
    href: "/solutions/retail"
  },
  {
    id: "legal",
    title: "AI for Law Firms", 
    icon: Scale,
    tagline: "Automate document review & case management",
    problems: [
      "Hours spent on document review",
      "Manual case file management",
      "Time tracking inefficiencies"
    ],
    solutions: [
      "AI-powered document analysis",
      "Automated case workflows",
      "Intelligent time tracking"
    ],
    metrics: {
      timeSaved: "15 hours/week",
      revenueIncrease: "40%",
      roi: "45 days"
    },
    href: "/solutions/legal"
  },
  {
    id: "accounting",
    title: "AI for Accounting Firms",
    icon: Calculator, 
    tagline: "Transform bookkeeping into advisory services",
    problems: [
      "Manual data entry consuming time",
      "Invoice processing bottlenecks", 
      "Limited advisory service capacity"
    ],
    solutions: [
      "Automated accounts payable",
      "AI expense categorization",
      "Financial insights dashboard"
    ],
    metrics: {
      timeSaved: "20 hours/week",
      revenueIncrease: "35%",
      roi: "30 days"
    },
    href: "/solutions/accounting"
  },
  {
    id: "trades",
    title: "AI for Skilled Trades",
    icon: Wrench,
    tagline: "24/7 scheduling & customer service",
    problems: [
      "Missing after-hours emergency calls",
      "Inefficient job scheduling",
      "Manual invoicing delays"
    ],
    solutions: [
      "AI phone answering service",
      "Automated scheduling optimization",
      "Instant mobile invoicing"
    ],
    metrics: {
      timeSaved: "18 hours/week", 
      revenueIncrease: "30%",
      roi: "21 days"
    },
    href: "/solutions/trades"
  }
] as const;