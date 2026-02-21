"use client";

import { useMemo, useState } from "react";

import { useGymStore } from "@/lib/store";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 5); // 5 AM to 8 PM

function riskToColor(score: number): string {
  if (score >= 60) return "#ef4444";
  if (score >= 40) return "#f59e0b";
  if (score >= 20) return "#fbbf24";
  if (score > 0) return "#86efac";
  return "#f5f5f5";
}

function riskToOpacity(score: number, memberCount: number): number {
  if (memberCount === 0) return 0.15;
  return 0.3 + Math.min(0.7, score / 100);
}

export function RiskHeatmap() {
  const members = useGymStore((s) => s.members);
  const riskAssessments = useGymStore((s) => s.riskAssessments);
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number } | null>(null);

  const heatmapData = useMemo(() => {
    const grid: Array<{ day: number; hour: number; riskScore: number; memberCount: number }> = [];

    for (let day = 0; day < 7; day++) {
      for (const hour of HOURS) {
        // Count members who typically check in at this day/hour
        let totalRisk = 0;
        let count = 0;

        for (const member of members) {
          const checkIns = member.checkInHistory.map((d) => new Date(d));
          const matchingCheckIns = checkIns.filter((d) => {
            return d.getDay() === (day + 1) % 7 && d.getHours() >= hour && d.getHours() < hour + 1;
          });

          if (matchingCheckIns.length > 0) {
            const assessment = riskAssessments[member.id];
            totalRisk += assessment?.compositeScore ?? 0;
            count++;
          }
        }

        grid.push({
          day,
          hour,
          riskScore: count > 0 ? Math.round(totalRisk / count) : 0,
          memberCount: count,
        });
      }
    }

    return grid;
  }, [members, riskAssessments]);

  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5">
      <h3 className="mb-1 text-sm font-semibold text-peec-dark">Risk Heatmap</h3>
      <p className="mb-4 text-2xs text-peec-text-muted">Average risk by check-in time</p>

      <div className="overflow-visible">
        <div className="min-w-[500px]">
          {/* Hour labels */}
          <div className="mb-1 flex pl-10">
            {HOURS.map((h) => (
              <div key={h} className="flex-1 text-center text-2xs text-peec-text-muted">
                {h % 12 === 0 ? 12 : h % 12}{h < 12 ? "a" : "p"}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="space-y-[3px]">
          {DAYS.map((dayLabel, dayIdx) => (
            <div key={dayLabel} className="flex items-center gap-1">
              <span className="w-9 text-right text-2xs text-peec-text-muted">{dayLabel}</span>
              <div className="flex flex-1 gap-[2px]">
                {HOURS.map((hour) => {
                  const cell = heatmapData.find(
                    (c) => c.day === dayIdx && c.hour === hour,
                  );
                  const score = cell?.riskScore ?? 0;
                  const count = cell?.memberCount ?? 0;
                  const isHovered =
                    hoveredCell?.day === dayIdx && hoveredCell?.hour === hour;

                  return (
                    <div
                      key={hour}
                      className="relative flex-1"
                      onMouseEnter={() => setHoveredCell({ day: dayIdx, hour })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className="aspect-square w-full rounded-[3px] transition-all duration-200"
                        style={{
                          backgroundColor: riskToColor(score),
                          opacity: riskToOpacity(score, count),
                          transform: isHovered ? "scale(1.3)" : "scale(1)",
                        }}
                      />

                      {/* Tooltip */}
                      {isHovered && count > 0 && (
                        <div className="absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-peec-dark px-2.5 py-1.5 text-2xs text-white shadow-lg">
                          <p className="font-medium">{dayLabel} {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? "AM" : "PM"}</p>
                          <p>{count} member{count !== 1 ? "s" : ""}, avg risk {score}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <span className="text-2xs text-peec-text-muted">Low</span>
        <div className="flex gap-[2px]">
          {[10, 25, 40, 55, 70].map((v) => (
            <div
              key={v}
              className="h-2.5 w-2.5 rounded-[2px]"
              style={{ backgroundColor: riskToColor(v), opacity: 0.7 }}
            />
          ))}
        </div>
        <span className="text-2xs text-peec-text-muted">High</span>
      </div>
    </div>
  );
}
