"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  LogIn,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { liveActivityPool } from "@/lib/mock-data";

import type { ActivityEvent } from "@/lib/mock-data";

function activityIcon(type: ActivityEvent["type"]) {
  switch (type) {
    case "check-in":
      return <LogIn className="h-4 w-4 text-blue-500" />;
    case "signup":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "cancellation":
      return <UserMinus className="h-4 w-4 text-red-500" />;
    case "payment":
      return <CreditCard className="h-4 w-4 text-purple-500" />;
    case "alert":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  }
}

interface LiveActivityFeedProps {
  initialEvents: ActivityEvent[];
}

export function LiveActivityFeed({ initialEvents }: LiveActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>(initialEvents);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const counterRef = useRef(0);

  // Simulate live events
  useEffect(() => {
    const interval = setInterval(() => {
      const pool = liveActivityPool;
      const randomEvent = pool[Math.floor(Math.random() * pool.length)] as ActivityEvent;
      counterRef.current += 1;
      const newEvent: ActivityEvent = {
        ...randomEvent,
        id: `live-${counterRef.current}`,
        timestamp: "just now",
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, 15));
      setSecondsAgo(0);
    }, 8000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  // Tick "last updated" counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-peec-dark">Recent Activity</h3>
        <span className="text-2xs text-peec-text-muted">
          Updated {secondsAgo}s ago
        </span>
      </div>
      <div className="space-y-0">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 52 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 border-b border-peec-border-light/50 py-3 last:border-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-50">
                  {activityIcon(event.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-peec-dark">
                    <span className="font-medium">{event.member}</span>{" "}
                    {event.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-peec-text-muted">{event.timestamp}</span>
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
