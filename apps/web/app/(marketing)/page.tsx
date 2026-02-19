import { CtaSection } from "@/components/marketing/cta-section";
import { CustomAppSection } from "@/components/marketing/custom-app-section";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { Features } from "@/components/marketing/features";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { Navbar } from "@/components/marketing/navbar";
import { SectionDivider } from "@/components/marketing/section-divider";
import { StatsSection } from "@/components/marketing/stats-section";
import { Testimonials } from "@/components/marketing/testimonials";
import { TrustStrip } from "@/components/marketing/trust-strip";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SectionDivider />
      <DashboardPreview />
      <SectionDivider />
      <TrustStrip />
      <StatsSection />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <CustomAppSection />
      <SectionDivider />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  );
}
