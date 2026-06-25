import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { colorForScore, HEX, STATUS_HEX, type FarmDetail } from "@/lib/api";
import { SectionCard } from "./ui";
import { useLang } from "@/lib/i18n";

export function HealthGauge({ farm }: { farm: FarmDetail }) {
  const { t } = useLang();
  const score = farm.health_score;
  const color = colorForScore(score);
  const hex = HEX[color];
  const statusLabel =
    farm.deficiency_count <= 0
      ? t("healthy")
      : color === "red"
        ? t("critical")
        : t("needs_attention");

  const data = [
    { value: score, fill: hex },
    { value: 100 - score, fill: "#E5E7EB" },
  ];

  return (
    <SectionCard title={t("health_score")}>
      <div className="relative mx-auto h-44 w-full max-w-sm">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              cx="50%"
              cy="100%"
              innerRadius={90}
              outerRadius={130}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-5xl font-extrabold" style={{ color: hex }}>
            {Math.round(score)}
          </span>
          <span className="text-xs font-medium text-muted-foreground">{t("out_of_100")}</span>
        </div>
      </div>

      <p className="mt-2 text-center text-base font-semibold" style={{ color: hex }}>
        {statusLabel}
      </p>

      <div className="mt-5 space-y-3">
        {farm.score_breakdown.map((item) => {
          const pct = item.max_pts > 0 ? (item.pts_earned / item.max_pts) * 100 : 0;
          const barColor = STATUS_HEX[item.status];
          return (
            <div key={item.group} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{item.group}</span>
                <span className="text-muted-foreground">
                  {item.pts_earned} / {item.max_pts}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.max(pct, 3)}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
