"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  filters?: { label: string; value: string }[];
  filterKey?: keyof T;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  searchable,
  searchKeys,
  filters,
  filterKey,
  emptyMessage = "No data found",
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(() => {
    let result = data;

    // Text search
    if (search && searchKeys) {
      const lower = search.toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((key) => {
          const val = row[key] as unknown;
          return typeof val === "string" && val.toLowerCase().includes(lower);
        }),
      );
    }

    // Filter
    if (activeFilter !== "all" && filterKey) {
      result = result.filter((row) => (row[filterKey] as unknown) === activeFilter);
    }

    return result;
  }, [data, search, searchKeys, activeFilter, filterKey]);

  return (
    <div>
      {/* Search + Filters */}
      {(searchable || filters) && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {searchable && (
            <div className="flex items-center gap-2 rounded-lg border border-peec-border-light bg-white px-3 py-2">
              <Search className="h-4 w-4 text-peec-text-muted" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 bg-transparent text-sm text-peec-dark placeholder:text-peec-text-muted focus:outline-none"
              />
            </div>
          )}
          {filters && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeFilter === "all"
                    ? "bg-peec-dark text-white"
                    : "bg-stone-100 text-peec-text-tertiary hover:text-peec-dark"
                }`}
              >
                All
              </button>
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setActiveFilter(f.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeFilter === f.value
                      ? "bg-peec-dark text-white"
                      : "bg-stone-100 text-peec-text-tertiary hover:text-peec-dark"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-peec-border-light bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-peec-border-light bg-stone-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-2xs font-medium uppercase tracking-wider text-peec-text-muted ${col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-peec-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-b border-peec-border-light/50 transition-colors last:border-0 hover:bg-stone-50/50 ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${col.className ?? ""}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
