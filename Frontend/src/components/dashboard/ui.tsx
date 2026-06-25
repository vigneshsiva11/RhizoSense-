import type { ReactNode } from "react";

export function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-navy">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

const PILL_STYLE: Record<string, string> = {
  critical: "bg-danger-soft text-danger",
  low: "bg-amber-soft text-amber",
  healthy: "bg-healthy-soft text-healthy",
};

export function StatusPill({
  status,
  label,
}: {
  status: "critical" | "low" | "healthy";
  label: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${PILL_STYLE[status]}`}
    >
      {label}
    </span>
  );
}
