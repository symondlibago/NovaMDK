import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Loader2, Lock, LogOut, MessageSquare, RefreshCw, UserRound } from "lucide-react";
import Seo from "../components/Seo";
import PortalLogin from "../components/portal/PortalLogin";
import PortalMessages from "../components/portal/PortalMessages";
import PortalVisits from "../components/portal/PortalVisits";
import PortalProfile from "../components/portal/PortalProfile";
import { getLenis } from "../lib/smoothScroll";
import { portalAuth } from "../lib/portal";

const TABS = [
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "visits", label: "Visits", icon: CalendarDays },
  { key: "profile", label: "Profile", icon: UserRound },
];

export default function PatientPortalPage() {
  const navigate = useNavigate();
  const [state, setState] = useState("checking"); // checking | out | in | down
  const [firstName, setFirstName] = useState(null);
  const [tab, setTab] = useState("messages");
  // Bumping this remounts the active view, which is what the Refresh control
  // in MDI's own portal does.
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    portalAuth({ action: "session" })
      .then(({ authenticated }) => setState(authenticated ? "in" : "out"))
      .catch(() => setState("down"));
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    return () => lenis?.start();
  }, []);

  const signOut = useCallback(() => {
    portalAuth({ action: "logout" }).catch(() => {});
    setFirstName(null);
    setTab("messages");
    setState("out");
  }, []);

  const chip =
    "flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-[0.85rem] font-semibold text-muted transition-colors hover:border-primary hover:text-ink";

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-bg text-ink">
      <Seo title="Patient Portal" noindex />

      <header className="shrink-0 border-b border-line bg-surface">
        <div className="flex h-15 items-center justify-between px-4 md:px-6">
          <Link to="/" aria-label="NovaMDK home">
            <img src="/logo.png" alt="NovaMDK" className="h-9 w-auto" />
          </Link>
          <span className="hidden items-center gap-2 text-[0.85rem] font-medium text-muted sm:flex">
            <Lock size={13} className="text-primary" />
            {firstName ? `${firstName}'s portal` : "Patient portal"}
          </span>
          <div className="flex items-center gap-2">
            {state === "in" && (
              <>
                <button onClick={() => setReloadKey((k) => k + 1)} aria-label="Refresh" className={chip}>
                  <RefreshCw size={14} />
                </button>
                <button onClick={signOut} className={chip}>
                  <LogOut size={14} /> <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            )}
            <button onClick={() => navigate("/")} className={chip}>
              <ArrowLeft size={14} /> Exit
            </button>
          </div>
        </div>

        {state === "in" && (
          <nav className="flex gap-1 overflow-x-auto px-3 md:px-5" aria-label="Portal sections">
            {TABS.map(({ key, label, icon }) => {
              // Assigned rather than destructured as `icon: Icon` — the repo's
              // no-unused-vars only exempts capitalised variables, not params.
              const Icon = icon;
              const active = tab === key;
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 pb-2.5 pt-1 text-[0.88rem] font-semibold transition-colors ${
                    active
                      ? "border-primary text-ink"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  <Icon size={15} className={active ? "text-primary" : ""} /> {label}
                </button>
              );
            })}
          </nav>
        )}
      </header>

      {state === "checking" && (
        <div className="grid flex-1 place-items-center">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      )}

      {state === "down" && (
        <div className="grid flex-1 place-items-center px-6 text-center">
          <div className="max-w-sm">
            <h1 className="text-[1.35rem] text-ink">The portal is temporarily unavailable</h1>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
              Please try again shortly. If you need help now,{" "}
              <Link to="/contact" className="font-medium text-primary underline-offset-4 hover:underline">
                contact our care team
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      {state === "out" && (
        <PortalLogin onAuthenticated={(name) => { setFirstName(name); setState("in"); }} />
      )}

      {state === "in" && (
        <React.Fragment key={`${tab}-${reloadKey}`}>
          {tab === "messages" && <PortalMessages onUnauthorized={signOut} />}
          {tab === "visits" && <PortalVisits onUnauthorized={signOut} />}
          {tab === "profile" && (
            <PortalProfile onUnauthorized={signOut} onName={(n) => setFirstName(n)} />
          )}
        </React.Fragment>
      )}
    </main>
  );
}
