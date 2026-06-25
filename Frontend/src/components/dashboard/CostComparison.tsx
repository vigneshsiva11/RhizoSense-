import { TrendingDown } from "lucide-react";
import { type FarmDetail } from "@/lib/api";
import { SectionCard } from "./ui";
import { useLang } from "@/lib/i18n";

export function CostComparison({ farm }: { farm: FarmDetail }) {
  const { t } = useLang();
  const fmt = (n: number) => n.toLocaleString("en-IN");

  return (
    <SectionCard title={t("financial")}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/20 bg-danger-soft p-4">
          <p className="text-sm font-semibold text-foreground">{t("current_chemical_spend")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{farm.chemical_products}</p>
          <p className="mt-3 text-3xl font-extrabold text-danger">
            ₹{fmt(farm.chemical_total_inr)}
          </p>
        </div>

        <div className="rounded-xl border border-healthy/20 bg-healthy-soft p-4">
          <p className="text-sm font-semibold text-foreground">{t("recommended_biofertilizer")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("bio_inoculant_programme")}</p>
          <p className="mt-3 text-3xl font-extrabold text-healthy">
            ₹{fmt(farm.biofert_total_inr)}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-brand px-4 py-3 text-center text-brand-foreground">
        <p className="flex items-center justify-center gap-2 text-lg font-bold">
          <TrendingDown className="h-5 w-5" />
          {t("save")} ₹{fmt(farm.saving_inr)} ({farm.saving_pct}%) {t("this_season")}
        </p>
      </div>

      <p className="mt-2 text-center text-sm font-medium text-healthy">
        ₹{fmt(farm.per_acre_saving_inr)} {t("saving_per_acre")}
      </p>
    </SectionCard>
  );
}
