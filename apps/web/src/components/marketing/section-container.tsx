import { cn } from "@gym/ui";

import type { ReactNode } from "react";

export function SectionContainer({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("px-6 py-section", className)}>
      <div className="mx-auto max-w-peec">{children}</div>
    </section>
  );
}
