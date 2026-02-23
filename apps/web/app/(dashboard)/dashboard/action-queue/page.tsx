"use client";

import { CopilotActionQueue } from "@/components/dashboard/copilot-action-queue";
import { PageEntrance, StaggerItem } from "@/components/dashboard/motion";

export default function ActionQueuePage() {
  return (
    <PageEntrance>
      <StaggerItem>
        <div className="mb-5">
          <h1 className="text-lg font-semibold text-peec-dark">Action Queue</h1>
          <p className="text-sm text-peec-text-muted">
            AI-recommended interventions awaiting your review
          </p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <CopilotActionQueue />
      </StaggerItem>
    </PageEntrance>
  );
}
