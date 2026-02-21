import { AiRetentionSection } from "@/components/marketing/ai-retention-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { CustomAppSection } from "@/components/marketing/custom-app-section";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { FaqSection } from "@/components/marketing/faq-section";
import { Features } from "@/components/marketing/features";
import { Footer } from "@/components/marketing/footer";
import { FranchiseSection } from "@/components/marketing/franchise-section";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { IntegrationsSection } from "@/components/marketing/integrations-section";
import { Navbar } from "@/components/marketing/navbar";
import { PricingSection } from "@/components/marketing/pricing-section";
import { SectionDivider } from "@/components/marketing/section-divider";
import { StatsSection } from "@/components/marketing/stats-section";
import { Testimonials } from "@/components/marketing/testimonials";
import { TrustStrip } from "@/components/marketing/trust-strip";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <DashboardPreview />
      <TrustStrip />
      <SectionDivider />
      <StatsSection />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <AiRetentionSection />
      <SectionDivider />
      <FranchiseSection />
      <SectionDivider />
      <CustomAppSection />
      <SectionDivider />
      <IntegrationsSection />
      <SectionDivider />
      <Testimonials />
      <SectionDivider />
      <PricingSection />
      <SectionDivider />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
