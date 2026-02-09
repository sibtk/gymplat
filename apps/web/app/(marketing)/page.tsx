import { CtaSection } from "@/components/marketing/cta-section";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { Features } from "@/components/marketing/features";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { Navbar } from "@/components/marketing/navbar";
import { Testimonials } from "@/components/marketing/testimonials";
import { TrustStrip } from "@/components/marketing/trust-strip";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <DashboardPreview />
      <TrustStrip />
      <Features />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  );
}
