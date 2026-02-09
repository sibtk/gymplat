"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { AnimationWrapper } from "./animation-wrapper";

const testimonials = [
  {
    name: "Lisa Park",
    company: "Peak Performance",
    quote:
      "GymPlatform lets us pinpoint exactly which classes drive retention and which need restructuring. With that visibility, we've been able to prioritize our schedule and drive a 3x increase in class bookings.",
  },
  {
    name: "James Wu",
    company: "CrossFit Central",
    quote:
      "GymPlatform avoids the bloat we see with other gym platforms. It keeps things simple — set up your plans, see your metrics, and act on AI-powered member insights.",
  },
  {
    name: "Amy Foster",
    company: "FlexZone Fitness",
    quote:
      "GymPlatform gave us a data-informed view of our multi-location strategy virtually overnight. With its AI insights, our member retention jumped from 76% to 92% within 3 months.",
  },
  {
    name: "Ryan O'Brien",
    company: "IronWorks Gym",
    quote:
      "GymPlatform helps us identify which members are at risk, adjust our engagement strategy in real-time, and stay ahead of churn. The clarity of the platform is invaluable.",
  },
  {
    name: "Maria Santos",
    company: "Studio Forte",
    quote:
      "As gym operators, our decisions should always be driven by data. GymPlatform provides exactly the critical AI-driven insights we need to stay competitive.",
  },
];

export function TestimonialsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="px-6 py-section">
      <div className="mx-auto max-w-peec">
        <AnimationWrapper>
          <div className="mb-12">
            <p className="mb-2 text-sm font-medium text-peec-red">Testimonials</p>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-peec-dark tablet:text-4xl">
              See what gym owners and operators say about GymPlatform
            </h2>

            {/* Featured intro quote */}
            <div className="mb-10 rounded-xl border border-peec-border-light bg-white p-8 shadow-card">
              <blockquote className="mb-4 text-lg leading-relaxed text-peec-text-secondary">
                &ldquo;GymPlatform gives gym owners real-time visibility into every aspect of their
                business — from member engagement to revenue trends. As the fitness industry goes
                digital, GymPlatform measures the growth.&rdquo;
              </blockquote>
              <div>
                <p className="font-semibold text-peec-dark">Mike Torres</p>
                <p className="text-sm text-peec-text-tertiary">
                  Director of Operations, FitLife Gyms
                </p>
              </div>
            </div>
          </div>
        </AnimationWrapper>

        {/* Carousel controls */}
        <div className="mb-4 flex justify-end gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-peec-border-light bg-white transition-colors hover:bg-peec-light"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-peec-dark" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-peec-border-light bg-white transition-colors hover:bg-peec-light"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-peec-dark" />
          </button>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="w-80 shrink-0 rounded-xl border border-peec-border-light bg-white p-6 shadow-card"
            >
              <blockquote className="mb-4 text-sm leading-relaxed text-peec-text-secondary">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-semibold text-peec-dark">{t.name}</p>
                <p className="text-xs text-peec-text-tertiary">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
