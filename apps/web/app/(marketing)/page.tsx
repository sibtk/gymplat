import { AiRetention } from "@/components/marketing/ai-retention";
import { BentoFeatures } from "@/components/marketing/bento-features";
import { CapabilitiesTicker } from "@/components/marketing/capabilities-ticker";
import { CtaSection } from "@/components/marketing/cta-section";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { FaqSection } from "@/components/marketing/faq-section";
import { Footer } from "@/components/marketing/footer";
import { GymComparison } from "@/components/marketing/gym-comparison";
import { Hero } from "@/components/marketing/hero";
import { HiringCta } from "@/components/marketing/hiring-cta";
import { MetricsSection } from "@/components/marketing/metrics-section";
import { Navbar } from "@/components/marketing/navbar";
import { ReportsSection } from "@/components/marketing/reports-section";
import { TestimonialFeatured } from "@/components/marketing/testimonial-featured";
import { TestimonialsCarousel } from "@/components/marketing/testimonials-carousel";
import { TrustCloud } from "@/components/marketing/trust-cloud";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <DashboardPreview />
      <TrustCloud />
      <MetricsSection />
      <GymComparison />
      <BentoFeatures />
      <AiRetention />
      <TestimonialFeatured />
      <HiringCta />
      <ReportsSection />
      <CapabilitiesTicker />
      <TestimonialsCarousel />
      <CtaSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
