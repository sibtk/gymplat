"use client";

import { useCallback, useEffect, useRef } from "react";

import { createSimulator } from "@/lib/retention/simulator";
import { useGymStore } from "@/lib/store";

import type { SimulatorConfig } from "@/lib/retention/simulator";

export function useSimulation() {
  const simulationRunning = useGymStore((s) => s.simulationRunning);
  const setSimulationRunning = useGymStore((s) => s.setSimulationRunning);
  const addWebhookEvent = useGymStore((s) => s.addWebhookEvent);
  const addIntervention = useGymStore((s) => s.addIntervention);
  const addCopilotInsight = useGymStore((s) => s.addCopilotInsight);
  const updateMember = useGymStore((s) => s.updateMember);

  const simulatorRef = useRef<ReturnType<typeof createSimulator> | null>(null);
  const speedRef = useRef(1);

  const getConfig = useCallback((): SimulatorConfig => ({
    speed: speedRef.current,
    onWebhookEvent: (event) => {
      addWebhookEvent(event);
    },
    onIntervention: (intervention) => {
      addIntervention(intervention);
    },
    onInsight: (insight) => {
      addCopilotInsight(insight);
    },
    onScoreChange: (memberId, delta) => {
      const member = useGymStore.getState().members.find((m) => m.id === memberId);
      if (member) {
        const newScore = Math.max(0, Math.min(100, member.riskScore + delta));
        updateMember(memberId, { riskScore: newScore });
      }
    },
    getMembers: () => useGymStore.getState().members,
    getAssessments: () => useGymStore.getState().riskAssessments,
  }), [addWebhookEvent, addIntervention, addCopilotInsight, updateMember]);

  // Start/stop based on store state
  useEffect(() => {
    if (simulationRunning) {
      if (!simulatorRef.current) {
        simulatorRef.current = createSimulator(getConfig());
      }
      simulatorRef.current.start();
    } else {
      simulatorRef.current?.stop();
    }

    return () => {
      simulatorRef.current?.stop();
    };
  }, [simulationRunning, getConfig]);

  const start = useCallback(() => {
    setSimulationRunning(true);
  }, [setSimulationRunning]);

  const stop = useCallback(() => {
    setSimulationRunning(false);
    simulatorRef.current?.stop();
  }, [setSimulationRunning]);

  const setSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
    // Restart with new speed if running
    if (simulatorRef.current?.isRunning()) {
      simulatorRef.current.stop();
      simulatorRef.current = createSimulator(getConfig());
      simulatorRef.current.start();
    }
  }, [getConfig]);

  const triggerEvent = useCallback(() => {
    if (!simulatorRef.current) {
      simulatorRef.current = createSimulator(getConfig());
    }
    simulatorRef.current.triggerEvent();
  }, [getConfig]);

  const triggerTimeLapse = useCallback(() => {
    if (!simulatorRef.current) {
      simulatorRef.current = createSimulator(getConfig());
    }
    simulatorRef.current.triggerTimeLapse();
  }, [getConfig]);

  return {
    running: simulationRunning,
    start,
    stop,
    setSpeed,
    triggerEvent,
    triggerTimeLapse,
  };
}
