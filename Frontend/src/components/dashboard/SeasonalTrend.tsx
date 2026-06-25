import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type FarmDetail } from "@/lib/api";
import { SectionCard } from "./ui";
import { useLang } from "@/lib/i18n";

const PROJECTED_COLOR = "#0E2841";
const ACTUAL_COLOR = "#4EA72E";

function DiamondDot(props: { cx?: number; cy?: number; value?: number | null }) {
  const { cx, cy, value } = props;
  if (cx == null || cy == null || value == null) return null;
  return (
    <path
      d={`M ${cx} ${cy - 7} L ${cx + 7} ${cy} L ${cx} ${cy + 7} L ${cx - 7} ${cy} Z`}
      fill={PROJECTED_COLOR}
      stroke="#fff"
      strokeWidth={1.5}
    />
  );
}

export function SeasonalTrend({ farm }: { farm: FarmDetail }) {
  const { t } = useLang();
  const points = farm.seasonal_trend;

  const lastActualIdx = (() => {
    let idx = -1;
    points.forEach((p, i) => {
      if (p.type === "actual") idx = i;
    });
    return idx;
  })();

  const data = points.map((p, i) => ({
    season: p.season,
    actual: p.type === "actual" ? p.score : null,
    projected: p.type === "projected" ? p.score : i === lastActualIdx ? p.score : null,
  }));

  const projectedNote = points.find((p) => p.type === "projected")?.note;

  return (
    <SectionCard title={t("seasonal")}>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="season"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name={t("actual")}
              stroke={ACTUAL_COLOR}
              strokeWidth={3}
              dot={{ r: 4, fill: ACTUAL_COLOR }}
              connectNulls
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="projected"
              name={t("projected")}
              stroke={PROJECTED_COLOR}
              strokeWidth={3}
              strokeDasharray="6 6"
              dot={<DiamondDot />}
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {projectedNote && (
        <p className="mt-2 text-center text-xs italic text-muted-foreground">{projectedNote}</p>
      )}
    </SectionCard>
  );
}
