"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatDate } from "@/lib/utils";
import type { Candidate, Poll, PollResult } from "@/lib/types";

interface Props {
  polls: Poll[];
  resultsByPoll: Record<string, PollResult[]>;
  candidates: Candidate[];
}

export function TrendChart({ polls, resultsByPoll, candidates }: Props) {
  const sorted = [...polls].sort((a, b) => (a.published_at > b.published_at ? 1 : -1));

  const data = sorted.map((poll) => {
    const row: Record<string, number | string> = {
      date: formatDate(poll.published_at),
    };
    for (const candidate of candidates) {
      const result = resultsByPoll[poll.id]?.find((r) => r.candidate_id === candidate.id);
      if (result) row[candidate.name] = result.value;
    }
    return row;
  });

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border-strong)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            unit="%"
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "var(--background)",
              border: "1px solid var(--border-strong)",
              borderRadius: 10,
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          {candidates.map((candidate) => (
            <Line
              key={candidate.id}
              type="monotone"
              dataKey={candidate.name}
              stroke={candidate.party?.color ?? "var(--primary)"}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
