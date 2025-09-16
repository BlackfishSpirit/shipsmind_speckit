export const testimonials = [
  {
    id: "retail-1",
    quote:
      "We went from spending 15 hours a week on inventory management to just 2 hours. The AI system caught stockouts before they happened and increased our sales by 28%.",
    author: "Sarah Martinez",
    role: "Owner",
    company: "Bella's Boutique",
    industry: "Retail",
    metrics: {
      timeSaved: "13 hours/week",
      revenueIncrease: "28%",
      paybackPeriod: "6 weeks",
    },
    avatar: "/avatars/sarah-m.jpg", // TODO: Add actual avatars
  },
  {
    id: "legal-1",
    quote:
      "Document review that used to take me 8 hours now takes 45 minutes. I can focus on actual legal work instead of paperwork, and my billable hours increased significantly.",
    author: "Michael Chen",
    role: "Solo Practitioner",
    company: "Chen Law Office",
    industry: "Legal",
    metrics: {
      timeSaved: "20+ hours/week",
      revenueIncrease: "42%",
      paybackPeriod: "1 month",
    },
    avatar: "/avatars/michael-c.jpg",
  },
  {
    id: "trades-1",
    quote:
      "The AI phone system captures emergency calls 24/7. We're booking 40% more jobs and customers love the instant response. It paid for itself in 3 weeks.",
    author: "James Rodriguez",
    role: "Owner",
    company: "Rodriguez Electrical",
    industry: "Skilled Trades",
    metrics: {
      timeSaved: "12 hours/week",
      revenueIncrease: "40%",
      paybackPeriod: "3 weeks",
    },
    avatar: "/avatars/james-r.jpg",
  },
] as const;

export const stats = [
  {
    number: "150+",
    label: "Small businesses served",
    description: "Across retail, legal, accounting, and skilled trades",
  },
  {
    number: "15+",
    label: "Average hours saved per week",
    description: "Freed up for revenue-generating activities",
  },
  {
    number: "32%",
    label: "Average revenue increase",
    description: "Within 90 days of implementation",
  },
  {
    number: "< 30 days",
    label: "Average payback period",
    description: "ROI faster than any other business investment",
  },
] as const;
