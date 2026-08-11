import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { AlertCircle, ChevronLeft, ChevronRight, FileText, Loader2, Pill, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { portalData } from "../../lib/portal";

const STATUS = {
  new: { label: "Submitted", tone: "muted" },
  pending: { label: "Submitted", tone: "muted" },
  assigned: { label: "With your clinician", tone: "active" },
  processing: { label: "In review", tone: "active" },
  prescribed: { label: "Treatment prescribed", tone: "done" },
  completed: { label: "Complete", tone: "done" },
  closed: { label: "Complete", tone: "done" },
  cancelled: { label: "Cancelled", tone: "muted" },
  canceled: { label: "Cancelled", tone: "muted" },
};

const titleCase = (s) => String(s || "").replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function StatusPill({ status }) {
  if (!status) return null;
  const { label, tone } = STATUS[status] || { label: titleCase(status), tone: "muted" };
  const tones = {
    active: "border-primary/30 bg-primary/10 text-primary",
    done: "border-line-strong bg-surface-2 text-ink",
    muted: "border-line bg-surface-2 text-muted",
  };
  return (
    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.72rem] font-semibold ${tones[tone]}`}>
      {label}
    </span>
  );
}

function Treatments({ treatments }) {
  if (!treatments.length) {
    return (
      <p className="text-[0.92rem] text-muted">
        No treatment prescribed yet. Your clinician will post here once they've
        reviewed your intake.
      </p>
    );
  }
  return (
    <ul className="space-y-2.5">
      {treatments.map((t) => (
        <li key={t.id} className="flex gap-3 rounded-xl border border-line bg-bg p-3.5">
          <Pill size={16} className="mt-0.5 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-[0.92rem] font-semibold text-ink">{t.name}</p>
            {t.detail && <p className="mt-0.5 text-[0.85rem] leading-relaxed text-muted">{t.detail}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function PortalVisits({ onUnauthorized }) {
  const [cases, setCases] = useState(null);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    portalData({ resource: "cases" })
      .then(({ cases: next }) => setCases(next))
      .catch((err) => {
        if (err.status === 401) return onUnauthorized();
        setError(err.message);
      });
  }, [onUnauthorized]);

  const shell = "min-h-0 flex-1 overflow-y-auto px-5 py-8";

  if (error) {
    return (
      <div className={shell} data-lenis-prevent>
        <p role="alert" className="mx-auto flex max-w-3xl items-center gap-2 text-[0.9rem] text-ink">
          <AlertCircle size={15} className="text-primary" /> {error}
        </p>
      </div>
    );
  }

  if (cases === null) {
    return (
      <div className="grid flex-1 place-items-center">
        <Loader2 size={26} className="animate-spin text-primary" />
      </div>
    );
  }

  const open = cases.find((c) => c.case_id === openId);

  if (open) {
    return (
      <div className={shell} data-lenis-prevent>
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => setOpenId(null)}
            className="mb-5 flex items-center gap-1 text-[0.88rem] font-medium text-muted transition-colors hover:text-ink"
          >
            <ChevronLeft size={16} /> All visits
          </button>

          <div className="rounded-2xl border border-line bg-surface p-6 nv-shadow sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-[1.45rem] leading-tight text-ink">Visit #{open.number}</h1>
                <p className="mt-1 text-[0.9rem] text-muted">
                  {format(new Date(open.created_at), "MMMM d, yyyy")}
                  {open.clinician && <> · Dr. {open.clinician}</>}
                </p>
              </div>
              <StatusPill status={open.status} />
            </div>

            {open.specialty && (
              <p className="mt-3 flex items-start gap-2 text-[0.85rem] leading-relaxed text-muted">
                <Stethoscope size={14} className="mt-0.5 shrink-0 text-primary" /> {open.specialty}
              </p>
            )}

            <hr className="my-6 border-line" />

            <h2 className="mb-3 text-[1.05rem] text-ink">Requested treatment</h2>
            <Treatments treatments={open.treatments} />

            <hr className="my-6 border-line" />

            <p className="text-[0.88rem] leading-relaxed text-muted">
              Questions about your treatment? Message your care team from the{" "}
              <span className="font-medium text-ink">Messages</span> tab. For orders
              or shipping, use the <span className="font-medium text-ink">Support</span> tab.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={shell} data-lenis-prevent>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-[1.45rem] leading-tight text-ink">Your visits</h1>
        <p className="mt-1 text-[0.9rem] text-muted">
          Every consultation you've submitted, newest first.
        </p>

        {cases.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-line bg-surface p-10 text-center nv-shadow">
            <FileText size={26} className="mx-auto text-primary" />
            <p className="mt-3 text-[1.05rem] font-semibold text-ink">No visits yet</p>
            <p className="mx-auto mt-1.5 max-w-sm text-[0.9rem] leading-relaxed text-muted">
              Once you complete an intake, your consultation will appear here.
            </p>
            <Link
              to="/treatments"
              className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-[0.9rem] font-semibold text-on-primary transition-colors hover:bg-primary-deep"
            >
              Browse treatments
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {[...cases].reverse().map((c) => (
              <li key={c.case_id}>
                <button
                  onClick={() => setOpenId(c.case_id)}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-line bg-surface p-4 text-left transition-colors hover:border-primary sm:p-5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-2 text-primary">
                    <FileText size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="text-[1rem] font-semibold text-ink">Visit #{c.number}</span>
                      <StatusPill status={c.status} />
                    </span>
                    <span className="mt-1 block truncate text-[0.85rem] text-muted">
                      {format(new Date(c.created_at), "MMM d, yyyy")}
                      {c.clinician && <> · Dr. {c.clinician}</>}
                      {" · "}
                      {c.treatments.length
                        ? `${c.treatments.length} treatment${c.treatments.length > 1 ? "s" : ""}`
                        : "No treatment prescribed"}
                    </span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-muted transition-colors group-hover:text-primary" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
