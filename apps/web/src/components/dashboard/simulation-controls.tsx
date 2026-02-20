"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, FastForward, Pause, Play, Zap } from "lucide-react";
import { useState } from "react";

import { useSimulation } from "@/hooks/use-simulation";
import { useGymStore } from "@/lib/store";

const speeds = [1, 5, 10] as const;

export function SimulationControls() {
  const { running, start, stop, setSpeed, triggerEvent, triggerTimeLapse } = useSimulation();
  const webhookEvents = useGymStore((s) => s.webhookEvents);
  const [expanded, setExpanded] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(1);

  const handleSpeedChange = (speed: number) => {
    setCurrentSpeed(speed);
    setSpeed(speed);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="mb-2 w-64 rounded-xl border border-peec-border-light bg-white p-4 shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-semibold text-peec-dark">Simulation Controls</h4>
              <span className={`rounded-full px-2 py-0.5 text-2xs font-medium ${
                running ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-600"
              }`}>
                {running ? "Running" : "Paused"}
              </span>
            </div>

            {/* Speed selector */}
            <div className="mb-3">
              <p className="mb-1.5 text-2xs text-peec-text-muted">Speed</p>
              <div className="flex gap-1">
                {speeds.map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => handleSpeedChange(speed)}
                    className={`flex-1 rounded-md px-2 py-1 text-2xs font-medium transition-colors ${
                      currentSpeed === speed
                        ? "bg-peec-dark text-white"
                        : "bg-stone-50 text-peec-text-secondary hover:bg-stone-100"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mb-3 flex gap-2">
              <button
                type="button"
                onClick={triggerEvent}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-peec-border-light px-2 py-1.5 text-2xs font-medium text-peec-text-secondary hover:bg-stone-50"
              >
                <Zap className="h-3 w-3" />
                Trigger Event
              </button>
              <button
                type="button"
                onClick={triggerTimeLapse}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-peec-border-light px-2 py-1.5 text-2xs font-medium text-peec-text-secondary hover:bg-stone-50"
              >
                <FastForward className="h-3 w-3" />
                Time Lapse
              </button>
            </div>

            {/* Recent events */}
            <div className="max-h-32 overflow-y-auto">
              <p className="mb-1 text-2xs text-peec-text-muted">
                Recent Events ({webhookEvents.length})
              </p>
              {webhookEvents.slice(0, 5).map((evt) => (
                <div key={evt.id} className="border-t border-peec-border-light/50 py-1">
                  <p className="text-2xs text-peec-dark">
                    <span className="font-medium">{evt.type.replace(/_/g, " ")}</span>
                  </p>
                  <p className="text-2xs text-peec-text-muted">
                    {new Date(evt.receivedAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              {webhookEvents.length === 0 && (
                <p className="py-2 text-center text-2xs text-peec-text-muted">No events yet</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle pill */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 rounded-full border border-peec-border-light bg-white px-3 py-2 text-xs font-medium text-peec-dark shadow-md transition-colors hover:bg-stone-50"
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" />
          )}
          Demo
          {running && (
            <span className="relative ml-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={running ? stop : start}
          className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-colors ${
            running
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-peec-dark text-white hover:bg-stone-800"
          }`}
        >
          {running ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
