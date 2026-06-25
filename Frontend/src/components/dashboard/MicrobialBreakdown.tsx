import { STATUS_HEX, type FarmDetail } from "@/lib/api";
import { SectionCard, StatusPill } from "./ui";
import { useLang } from "@/lib/i18n";

const STATUS_LABEL_KEY = {
  critical: "critical",
  low: "low",
  healthy: "healthy",
} as const;

export function MicrobialBreakdown({ farm }: { farm: FarmDetail }) {
  const { t } = useLang();

  return (
    <SectionCard title={t("microbial")}>
      <div className="space-y-5">
        {farm.score_breakdown.map((item) => {
          const max = Math.max(item.actual, item.baseline) * 1.15 || 1;
          const actualPct = (item.actual / max) * 100;
          const baselinePct = (item.baseline / max) * 100;
          const hex = STATUS_HEX[item.status];
          return (
            <div key={item.group}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-foreground">{item.group}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {item.actual} / {item.baseline}
                  </span>
                  <StatusPill status={item.status} label={t(STATUS_LABEL_KEY[item.status])} />
                </div>
              </div>
              <div className="relative h-3 w-full rounded-full bg-muted">
                {/* baseline marker */}
                <div
                  className="absolute top-1/2 z-10 h-5 w-0.5 -translate-y-1/2 rounded bg-navy/60"
                  style={{ left: `calc(${baselinePct}% - 1px)` }}
                  title={`${t("baseline")} ${item.baseline}`}
                />
                {/* actual fill */}
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.max(actualPct, 2)}%`, backgroundColor: hex }}
                />
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: hex }} />
                  {t("actual")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-3 w-0.5 rounded bg-navy/60" />
                  {t("baseline")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
