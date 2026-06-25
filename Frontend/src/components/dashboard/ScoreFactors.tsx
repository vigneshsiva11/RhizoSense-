import { type FarmDetail } from "@/lib/api";
import { SectionCard } from "./ui";
import { useLang } from "@/lib/i18n";

export function ScoreFactors({ farm }: { farm: FarmDetail }) {
  const { t } = useLang();
  const factors = farm.top_factors;
  const maxImpact = Math.max(...factors.map((f) => Math.abs(f.impact)), 1);

  return (
    <SectionCard title={t("score_explanation")}>
      <div className="space-y-3">
        {factors.map((f, i) => {
          const pct = (Math.abs(f.impact) / maxImpact) * 100;
          const positive = f.direction === "positive";
          const color = positive ? "#4EA72E" : "#EF4444";
          return (
            <div
              key={i}
              className="grid grid-cols-[10rem_1fr_3rem] items-center gap-3 sm:grid-cols-[12rem_1fr_3.5rem]"
            >
              <span className="truncate text-sm font-medium text-foreground" title={f.factor}>
                {f.factor}
              </span>
              <div className="h-3 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.max(pct, 3)}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-right text-sm font-bold tabular-nums" style={{ color }}>
                {positive ? "+" : "-"}
                {Math.abs(f.impact).toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs italic text-muted-foreground">{t("score_factors.powered_by")}</p>
    </SectionCard>
  );
}
