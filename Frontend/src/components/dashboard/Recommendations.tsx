import { Beaker, CalendarClock, IndianRupee, StickyNote } from "lucide-react";
import { type FarmDetail } from "@/lib/api";
import { SectionCard } from "./ui";
import { useLang } from "@/lib/i18n";

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <span className="font-medium text-muted-foreground">{label}:</span>
      <span className="flex-1 text-foreground">{children}</span>
    </div>
  );
}

export function Recommendations({ farm }: { farm: FarmDetail }) {
  const { t } = useLang();

  return (
    <SectionCard title={t("recommended")}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {farm.recommendations.map((rec, i) => {
          const isCritical = rec.severity === "critical";
          const borderColor = isCritical ? "var(--color-danger)" : "var(--color-amber)";
          const tagClass = isCritical ? "bg-danger-soft text-danger" : "bg-amber-soft text-amber";
          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
              style={{ borderLeftWidth: 5, borderLeftColor: borderColor }}
            >
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tagClass}`}
              >
                {t("deficiency")}: {rec.deficiency}
              </span>

              <h3 className="mt-2 text-base font-bold text-navy">{rec.product}</h3>
              <p className="text-xs text-muted-foreground">{rec.microbial}</p>

              <div className="mt-3 space-y-2">
                <Row icon={<Beaker className="h-4 w-4" />} label={t("dose")}>
                  {rec.dose}
                </Row>
                <Row icon={<CalendarClock className="h-4 w-4" />} label={t("when_apply")}>
                  {rec.timing}
                </Row>
                <Row icon={<IndianRupee className="h-4 w-4" />} label={t("cost_label")}>
                  {t("recommendations.per_acre_cost", {
                    cost: rec.cost_per_acre.toLocaleString("en-IN"),
                  })}{" "}
                  · ₹{rec.total_cost_inr.toLocaleString("en-IN")}{" "}
                  {t("recommendations.total_cost_calc")}
                </Row>
                <Row icon={<StickyNote className="h-4 w-4" />} label={t("note_label")}>
                  {rec.note}
                </Row>
              </div>

              <p className="mt-3 rounded-lg bg-healthy-soft px-3 py-2 text-xs italic text-foreground">
                {rec.mechanism}
              </p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
