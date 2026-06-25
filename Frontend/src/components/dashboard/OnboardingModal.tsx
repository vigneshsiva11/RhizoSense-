import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Upload,
  Info,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { API_BASE, colorForScore, HEX, type FarmDetail } from "@/lib/api";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Step = 1 | 2 | 3 | 4;

interface FormData {
  farmer_name: string;
  location: string;
  crop: string;
  area_acres: string;
}

const CROPS = ["Tomato", "Rice", "Wheat", "Cotton", "Sugarcane", "Vegetables"];
const STEP_LABELS = ["Farm Details", "Soil Sample", "Processing", "Results"];

const PROCESSING_STEPS = [
  "Preprocessing soil image...",
  "Simulating 16S rRNA sequencing...",
  "Running Kraken2 taxonomic classification...",
  "Applying FAPROTAX functional annotation...",
  "Computing health score with Random Forest model...",
  "Generating biofertilizer recommendations...",
];

/* ------------------------------------------------------------------ */
/*  Progress bar                                                       */
/* ------------------------------------------------------------------ */

function ProgressBar({ step }: { step: Step }) {
  const { t } = useLanguage();
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors"
                style={{
                  backgroundColor: done ? HEX.green : active ? "var(--brand)" : "var(--muted)",
                  color: done || active ? "#fff" : "var(--muted-foreground)",
                }}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : n}
              </div>
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{
                  color: done || active ? "var(--navy)" : "var(--muted-foreground)",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Track */}
      <div className="mx-auto mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className="h-full rounded-full bg-[var(--brand)] transition-all duration-500"
          style={{ width: `${((step - 1) / (STEP_LABELS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Farm Details                                              */
/* ------------------------------------------------------------------ */

function StepFarmDetails({
  form,
  onChange,
  onNext,
}: {
  form: FormData;
  onChange: (f: FormData) => void;
  onNext: () => void;
}) {
  const { t } = useLanguage();
  const valid =
    form.farmer_name.trim().length > 0 &&
    form.location.trim().length > 0 &&
    form.crop.length > 0 &&
    Number(form.area_acres) >= 0.5;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="farmer_name" className="mb-1.5 block">
          {t("onboarding.farmer_name")}
        </Label>
        <Input
          id="farmer_name"
          value={form.farmer_name}
          onChange={(e) => onChange({ ...form, farmer_name: e.target.value })}
          placeholder={t("onboarding.ph_farmer_name")}
          className="focus-visible:ring-[var(--brand)]"
        />
      </div>

      <div>
        <Label htmlFor="location" className="mb-1.5 block">
          {t("onboarding.location")}
        </Label>
        <Input
          id="location"
          value={form.location}
          onChange={(e) => onChange({ ...form, location: e.target.value })}
          placeholder={t("onboarding.ph_location")}
          className="focus-visible:ring-[var(--brand)]"
        />
      </div>

      <div>
        <Label htmlFor="crop" className="mb-1.5 block">
          {t("onboarding.crop_type")}
        </Label>
        <Select value={form.crop} onValueChange={(v) => onChange({ ...form, crop: v })}>
          <SelectTrigger id="crop" className="focus:ring-[var(--brand)]">
            <SelectValue placeholder={t("onboarding.ph_crop")} />
          </SelectTrigger>
          <SelectContent>
            {CROPS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="area" className="mb-1.5 block">
          {t("onboarding.farm_area")}
        </Label>
        <Input
          id="area"
          type="number"
          min={0.5}
          max={50}
          step={0.5}
          value={form.area_acres}
          onChange={(e) => onChange({ ...form, area_acres: e.target.value })}
          placeholder={t("onboarding.ph_area")}
          className="focus-visible:ring-[var(--brand)]"
        />
      </div>

      <button
        disabled={!valid}
        onClick={onNext}
        className="mt-2 w-full rounded-lg bg-[var(--brand)] py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-[#3e8c22] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t("next")} →
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Soil Sample Upload                                        */
/* ------------------------------------------------------------------ */

function StepSoilSample({ onNext }: { onNext: () => void }) {
  const { t } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-[var(--navy)]">{t("onboarding.upload_title")}</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t("onboarding.upload_desc")}</p>
      </div>

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--muted)] py-10 text-[var(--muted-foreground)] transition-colors hover:border-[var(--brand)] hover:bg-[var(--healthy-soft)] cursor-pointer"
      >
        {preview ? (
          <img
            src={preview}
            alt={t("onboarding.preview_alt")}
            className="h-36 w-auto rounded-lg object-cover shadow"
          />
        ) : (
          <>
            <Upload className="h-10 w-10 text-[var(--brand)]" />
            <span className="text-sm font-medium">{t("onboarding.drop_image")}</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Info box */}
      <div className="flex items-start gap-2 rounded-lg border border-[var(--brand)]/30 bg-[var(--healthy-soft)] px-3 py-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
        <p className="text-xs text-[var(--foreground)]">{t("onboarding.sample_info")}</p>
      </div>

      <button
        disabled={!preview}
        onClick={onNext}
        className="mt-2 w-full rounded-lg bg-[var(--brand)] py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-[#3e8c22] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t("onboarding.start_analysis")} →
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Processing Animation                                     */
/* ------------------------------------------------------------------ */

function StepProcessing({
  form,
  onComplete,
}: {
  form: FormData;
  onComplete: (result: FarmDetail) => void;
}) {
  const { t } = useLanguage();
  const [completed, setCompleted] = useState<number[]>([]);
  const [apiDone, setApiDone] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [allAnimDone, setAllAnimDone] = useState(false);
  const resultRef = useRef<FarmDetail | null>(null);
  const hasStarted = useRef(false);

  const callApi = useCallback(async () => {
    try {
      setApiError(null);
      const params = new URLSearchParams({
        farmer_name: form.farmer_name,
        location: form.location,
        crop: form.crop,
        area_acres: form.area_acres,
      });
      const res = await fetch(`${API_BASE}/farm/onboard?${params}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      resultRef.current = json as FarmDetail;
      setApiDone(true);
    } catch {
      setApiError("Analysis failed — backend unreachable");
    }
  }, [form]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Fire API call
    callApi();

    // Animate steps one by one
    PROCESSING_STEPS.forEach((_, i) => {
      setTimeout(
        () => {
          setCompleted((prev) => [...prev, i]);
          if (i === PROCESSING_STEPS.length - 1) {
            setAllAnimDone(true);
          }
        },
        (i + 1) * 600,
      );
    });
  }, [callApi]);

  const ready = allAnimDone && apiDone && resultRef.current;

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[var(--navy)]">{t("onboarding.analyzing")}</h3>

      <div className="space-y-3">
        {PROCESSING_STEPS.map((label, i) => {
          const isDone = completed.includes(i);
          const isActive = !isDone && (i === 0 || completed.includes(i - 1));
          const show = i === 0 || completed.includes(i - 1) || isDone;
          if (!show) return null;
          return (
            <div
              key={i}
              className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-[var(--brand)]" />
              ) : isActive ? (
                <Loader2 className="h-5 w-5 animate-spin text-[var(--brand)]" />
              ) : (
                <div className="h-5 w-5" />
              )}
              <span
                className="text-sm"
                style={{
                  color: isDone ? "var(--navy)" : "var(--muted-foreground)",
                  fontWeight: isDone ? 600 : 400,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Error state */}
      {apiError && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-4 py-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--danger)]" />
          <p className="flex-1 text-sm font-medium text-[var(--danger)]">{apiError}</p>
          <button
            onClick={() => {
              hasStarted.current = false;
              setCompleted([]);
              setAllAnimDone(false);
              setApiDone(false);
              setApiError(null);
              // re-trigger
              setTimeout(() => {
                hasStarted.current = true;
                callApi();
                PROCESSING_STEPS.forEach((_, i) => {
                  setTimeout(
                    () => {
                      setCompleted((prev) => [...prev, i]);
                      if (i === PROCESSING_STEPS.length - 1) setAllAnimDone(true);
                    },
                    (i + 1) * 600,
                  );
                });
              }, 100);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--danger)] px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-red-600"
          >
            <RefreshCw className="h-3.5 w-3.5" /> {t("common.retry")}
          </button>
        </div>
      )}

      {/* Success state */}
      {ready && (
        <div className="flex flex-col items-center gap-4 pt-2 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--healthy-soft)]">
            <CheckCircle2 className="h-12 w-12 text-[var(--brand)]" />
          </div>
          <p className="text-lg font-extrabold text-[var(--navy)]">
            {t("onboarding.analysis_complete")}
          </p>
          <button
            onClick={() => onComplete(resultRef.current!)}
            className="flex items-center gap-2 rounded-lg bg-[var(--brand)] px-6 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-[#3e8c22]"
          >
            {t("onboarding.view_results")} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4 — Results Preview                                           */
/* ------------------------------------------------------------------ */

function StepResults({
  result: onboardResult,
  onViewDashboard,
  onBackHome,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
  onViewDashboard: () => void;
  onBackHome: () => void;
}) {
  const { t } = useLanguage();

  if (!onboardResult || !onboardResult.farm) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--brand)]" />
      </div>
    );
  }

  const farm = onboardResult.farm;
  const score = Math.round(farm.health_score) || 0;

  let hex = "#EF4444";
  if (farm.score_color === "amber") hex = "#F59E0B";
  else if (farm.score_color === "green") hex = "#4EA72E";

  const statusLabel = farm.status_label || "Analysis Complete";
  const farmName = farm.name || "New Farm";

  const deficiencies: string[] = farm.deficiency_keys || [];
  const topRec = farm.recommendations?.[0];

  return (
    <div className="space-y-5">
      {/* Farm header */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-[var(--navy)]">{farmName}</h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          {farm.farmer_name} · {farm.location}
        </p>
      </div>

      {/* Score circle */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-4xl font-extrabold text-white shadow-md"
          style={{ backgroundColor: hex }}
        >
          {score}
        </div>
        <span className="text-sm font-bold" style={{ color: hex }}>
          {statusLabel}
        </span>
      </div>

      {/* Deficiencies */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
          {t("onboarding.deficiencies_detected")}
        </p>
        {deficiencies.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {deficiencies.map((d: string) => (
              <span
                key={d}
                className="rounded-full bg-[var(--danger-soft)] px-2.5 py-1 text-xs font-medium text-[var(--danger)]"
              >
                {d}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm font-bold text-[#4EA72E]">{t("onboarding.no_deficiencies")}</p>
        )}
      </div>

      {/* Top recommendation */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--healthy-soft)] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--brand)]">
          {t("onboarding.top_recommendation")}
        </p>
        {topRec ? (
          <>
            <p className="mt-1 text-sm font-semibold text-[var(--navy)]">{topRec.product}</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              ₹{topRec.total_cost_inr?.toLocaleString("en-IN")} {t("onboarding.total_cost")}
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {t("onboarding.recommendations_loading")}
          </p>
        )}
      </div>

      {/* Savings */}
      {farm.cost_summary?.saving_inr !== undefined &&
        farm.cost_summary?.saving_pct !== undefined && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[var(--brand)]/30 bg-[var(--healthy-soft)] px-4 py-3">
            <span className="text-lg font-extrabold text-[var(--brand)]">
              {t("onboarding.save_amount_pct", {
                amount: farm.cost_summary.saving_inr.toLocaleString("en-IN"),
                pct: farm.cost_summary.saving_pct.toString(),
              })}
            </span>
          </div>
        )}

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onViewDashboard}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-[#3e8c22]"
        >
          {t("onboarding.view_dashboard")} <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={onBackHome}
          className="w-full py-2 text-center text-sm font-medium text-[var(--muted-foreground)] underline-offset-2 hover:text-[var(--navy)] hover:underline"
        >
          {t("onboarding.back_home")}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Modal                                                         */
/* ------------------------------------------------------------------ */

export function OnboardingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    farmer_name: "",
    location: "",
    crop: "",
    area_acres: "3",
  });
  const [result, setResult] = useState<FarmDetail | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setForm({ farmer_name: "", location: "", crop: "", area_acres: "3" });
      setResult(null);
    }
  }, [open]);

  const handleProcessingComplete = (res: FarmDetail) => {
    setResult(res);
    setStep(4);
  };

  const handleViewDashboard = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (result as any)?.farm?.id ?? "farm_004";
    onClose();
    queryClient.invalidateQueries({ queryKey: ["farms"] });
    navigate({ to: "/farm/$id", params: { id } });
  };

  const handleBackHome = () => {
    onClose();
    queryClient.invalidateQueries({ queryKey: ["farms"] });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        className="max-h-[90vh] max-w-[560px] overflow-y-auto rounded-2xl border-0 bg-white p-6 shadow-xl"
        onInteractOutside={(e) => {
          // Don't close during processing
          if (step === 3) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (step === 3) e.preventDefault();
        }}
      >
        <DialogTitle className="sr-only">{t("onboarding.add_new_farm")}</DialogTitle>
        <DialogDescription className="sr-only">
          {t("onboarding.add_new_farm_desc")}
        </DialogDescription>

        <ProgressBar step={step} />

        {step === 1 && <StepFarmDetails form={form} onChange={setForm} onNext={() => setStep(2)} />}

        {step === 2 && <StepSoilSample onNext={() => setStep(3)} />}

        {step === 3 && <StepProcessing form={form} onComplete={handleProcessingComplete} />}

        {step === 4 && result && (
          <StepResults
            result={result}
            onViewDashboard={handleViewDashboard}
            onBackHome={handleBackHome}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
