import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, ClipboardCheck, Send, Star, TrendingUp } from "lucide-react";
import { submitHarvestFeedback, type FarmDetail, type HarvestFeedbackResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "./ui";

function RatingButton({
  value,
  selected,
  onSelect,
}: {
  value: number;
  selected: boolean;
  onSelect: (value: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex h-10 min-w-10 items-center justify-center rounded-md border text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        selected
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-background text-foreground hover:bg-muted"
      }`}
      aria-pressed={selected}
    >
      {value}
    </button>
  );
}

function FeedbackImpact({ result }: { result: HarvestFeedbackResponse }) {
  const { t } = useLang();
  return (
    <div className="rounded-lg border border-healthy/20 bg-healthy-soft p-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-healthy" />
        <div>
          <p className="text-sm font-bold text-foreground">{result.message}</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {t("harvest.projected_score")}
              </p>
              <p className="text-2xl font-extrabold text-healthy">
                {result.model_impact.projected_score_next_season}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {t("harvest.expected_lift")}
              </p>
              <p className="text-2xl font-extrabold text-healthy">
                {result.model_impact.projected_score_improvement}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground">{result.model_impact.network_effect}</p>
        </div>
      </div>
    </div>
  );
}

export function HarvestFeedback({ farm }: { farm: FarmDetail }) {
  const { t } = useLang();
  const [yieldKgPerAcre, setYieldKgPerAcre] = useState("");
  const [followedRecommendation, setFollowedRecommendation] = useState(true);
  const [farmerRating, setFarmerRating] = useState(5);
  const [notes, setNotes] = useState("");

  const mutation = useMutation({
    mutationFn: submitHarvestFeedback,
  });

  const parsedYield = Number(yieldKgPerAcre);
  const canSubmit = Number.isFinite(parsedYield) && parsedYield > 0 && farmerRating >= 1;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    mutation.mutate({
      farm_id: farm.id,
      yield_kg_per_acre: parsedYield,
      followed_recommendation: followedRecommendation,
      farmer_rating: farmerRating,
      notes,
    });
  };

  return (
    <SectionCard
      title={t("harvest.title")}
      subtitle="Record the season outcome so the recommendation model can learn from real farm results."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="yield_kg_per_acre" className="mb-1.5 block">
              {t("harvest.yield_per_acre")}
            </Label>
            <div className="relative">
              <TrendingUp className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="yield_kg_per_acre"
                type="number"
                min="1"
                step="0.1"
                value={yieldKgPerAcre}
                onChange={(event) => setYieldKgPerAcre(event.target.value)}
                placeholder="2800"
                className="pl-9"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{t("harvest.kg_per_acre")}</p>
          </div>

          <div>
            <Label className="mb-1.5 block">{t("harvest.recommendation_followed")}</Label>
            <div className="flex h-9 items-center justify-between rounded-md border border-input px-3">
              <span className="flex items-center gap-2 text-sm text-foreground">
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                {t("harvest.biofertilizer_protocol")}
              </span>
              <Switch
                checked={followedRecommendation}
                onCheckedChange={setFollowedRecommendation}
                aria-label={t("harvest.toggle_recommendation")}
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-1.5 flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            {t("harvest.farmer_rating")}
          </Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <RatingButton
                key={value}
                value={value}
                selected={farmerRating === value}
                onSelect={setFarmerRating}
              />
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="feedback_notes" className="mb-1.5 block">
            {t("harvest.notes")}
          </Label>
          <Textarea
            id="feedback_notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t("harvest.notes_placeholder")}
            className="min-h-24"
          />
        </div>

        {mutation.isError && (
          <div className="rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
            {t("harvest.submit_error", { url: "localhost:8000" })}
          </div>
        )}

        {mutation.data && <FeedbackImpact result={mutation.data} />}

        <Button
          type="submit"
          disabled={!canSubmit || mutation.isPending}
          className="w-full bg-brand text-brand-foreground hover:bg-brand/90 sm:w-auto"
        >
          <Send className="h-4 w-4" />
          {mutation.isPending ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </SectionCard>
  );
}
