import { AiRetentionSection } from "@/components/marketing/ai-retention-section";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { Features } from "@/components/marketing/features";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { Navbar } from "@/components/marketing/navbar";
import { PricingSection } from "@/components/marketing/pricing-section";
import { SocialProof } from "@/components/marketing/social-proof";
import { TechSpecsSection } from "@/components/marketing/tech-specs-section";

function GradientDivider() {
  return (
    <div className="mx-auto max-w-peec px-6">
      <div
        className="h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        }}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="bg-[#0a0a0a]">
      <Navbar />
      <Hero />
      <DashboardPreview />
      <SocialProof />
      <GradientDivider />
      <Features />
      <GradientDivider />
      <TechSpecsSection />
      <GradientDivider />
      <AiRetentionSection />
      <GradientDivider />
      <PricingSection />
      <Footer />
    </main>
  );
}
