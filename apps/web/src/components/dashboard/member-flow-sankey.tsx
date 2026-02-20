"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { useGymStore } from "@/lib/store";

interface SankeyNode {
  id: string;
  label: string;
  count: number;
  x: number;
  y: number;
  color: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color: string;
}

export function MemberFlowSankey() {
  const members = useGymStore((s) => s.members);
  const riskAssessments = useGymStore((s) => s.riskAssessments);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const { nodes, links } = useMemo(() => {
    const newCount = members.filter((m) => {
      const months = (Date.now() - new Date(m.memberSince).getTime()) / (30 * 86400000);
      return months < 3 && m.status !== "churned";
    }).length;

    const activeCount = members.filter((m) => {
      const assessment = riskAssessments[m.id];
      return m.status === "active" && (!assessment || assessment.riskLevel === "low" || assessment.riskLevel === "moderate");
    }).length;

    const atRiskCount = members.filter((m) => {
      const assessment = riskAssessments[m.id];
      return m.status !== "churned" && assessment && (assessment.riskLevel === "elevated" || assessment.riskLevel === "high" || assessment.riskLevel === "critical");
    }).length;

    const churnedCount = members.filter((m) => m.status === "churned").length;
    const recoveredCount = Math.max(1, Math.floor(churnedCount * 0.15)); // Simulated recovery rate

    const n: SankeyNode[] = [
      { id: "new", label: "New", count: newCount, x: 30, y: 40, color: "#3b82f6" },
      { id: "active", label: "Active", count: activeCount, x: 150, y: 30, color: "#22c55e" },
      { id: "at-risk", label: "At Risk", count: atRiskCount, x: 270, y: 55, color: "#f59e0b" },
      { id: "churned", label: "Churned", count: churnedCount, x: 390, y: 80, color: "#ef4444" },
      { id: "recovered", label: "Recovered", count: recoveredCount, x: 270, y: 120, color: "#8b5cf6" },
    ];

    const l: SankeyLink[] = [
      { source: "new", target: "active", value: Math.max(1, newCount - 1), color: "#3b82f680" },
      { source: "active", target: "at-risk", value: Math.max(1, Math.floor(atRiskCount * 0.6)), color: "#f59e0b60" },
      { source: "at-risk", target: "churned", value: Math.max(1, Math.floor(churnedCount * 0.5)), color: "#ef444460" },
      { source: "at-risk", target: "active", value: Math.max(1, Math.floor(atRiskCount * 0.3)), color: "#22c55e40" },
      { source: "churned", target: "recovered", value: recoveredCount, color: "#8b5cf640" },
      { source: "recovered", target: "active", value: recoveredCount, color: "#22c55e40" },
    ];

    return { nodes: n, links: l };
  }, [members, riskAssessments]);

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  function createCurvePath(link: SankeyLink): string {
    const src = nodeMap[link.source];
    const tgt = nodeMap[link.target];
    if (!src || !tgt) return "";

    const x1 = src.x + 40;
    const y1 = src.y + 10;
    const x2 = tgt.x;
    const y2 = tgt.y + 10;
    const mx = (x1 + x2) / 2;

    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }

  return (
    <div className="rounded-xl border border-peec-border-light bg-white p-5">
      <h3 className="mb-1 text-sm font-semibold text-peec-dark">Member Flow</h3>
      <p className="mb-4 text-2xs text-peec-text-muted">State transitions</p>

      <svg viewBox="0 0 460 160" className="w-full" style={{ minHeight: 140 }}>
        {/* Links */}
        {links.map((link) => {
          const key = `${link.source}-${link.target}`;
          const isHovered = hoveredLink === key;

          return (
            <motion.path
              key={key}
              d={createCurvePath(link)}
              fill="none"
              stroke={link.color}
              strokeWidth={Math.max(2, Math.min(link.value * 1.5, 12))}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, opacity: isHovered ? 1 : 0.6 }}
              transition={{ duration: 1, delay: 0.2 }}
              onMouseEnter={() => setHoveredLink(key)}
              onMouseLeave={() => setHoveredLink(null)}
              className="cursor-pointer"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <rect
              x={node.x}
              y={node.y}
              width="40"
              height="20"
              rx="6"
              fill={node.color}
              opacity={0.9}
            />
            <text
              x={node.x + 20}
              y={node.y - 5}
              textAnchor="middle"
              className="fill-stone-600 text-[8px] font-medium"
            >
              {node.label}
            </text>
            <text
              x={node.x + 20}
              y={node.y + 13}
              textAnchor="middle"
              className="fill-white text-[9px] font-bold"
            >
              {node.count}
            </text>
          </motion.g>
        ))}

        {/* Hover tooltip */}
        {hoveredLink && (() => {
          const link = links.find((l) => `${l.source}-${l.target}` === hoveredLink);
          if (!link) return null;
          const src = nodeMap[link.source];
          const tgt = nodeMap[link.target];
          if (!src || !tgt) return null;
          const tx = (src.x + tgt.x) / 2 + 20;
          const ty = (src.y + tgt.y) / 2 - 5;
          return (
            <g>
              <rect x={tx - 30} y={ty - 10} width="60" height="18" rx="4" fill="#171717" opacity={0.9} />
              <text x={tx} y={ty + 2} textAnchor="middle" className="fill-white text-[8px]">
                {link.value} members
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
