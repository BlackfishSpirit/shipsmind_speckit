import { HeroSection } from "@/components/homepage/HeroSection";
import { SolutionsOverview } from "@/components/homepage/SolutionsOverview";
import { ProcessOverview } from "@/components/homepage/ProcessOverview";
import { CTASection } from "@/components/homepage/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SolutionsOverview />
      <ProcessOverview />
      <CTASection />
    </main>
  );
}
