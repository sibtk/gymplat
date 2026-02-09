import { cn } from "@gym/ui";

import type { ReactNode } from "react";

export function SectionContainer({
  children,
  className,
  dark = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "px-6 py-section",
        dark && "section-dark",
        className,
      )}
    >
      <div className="mx-auto max-w-peec">{children}</div>
    </section>
  );
}
