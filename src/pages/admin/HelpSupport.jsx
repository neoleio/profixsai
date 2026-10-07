import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as Icons from "lucide-react";
import { Search, ChevronDown, Info } from "lucide-react";
import { useAuth } from "../../lib/auth-context.jsx";
import { HELP_CATEGORIES } from "../../lib/helpContent.js";

const ROLE_LABEL = { admin: "Administrators only", staff: "Admin & Staff", technician: "Technicians" };

function visibleFor(role, roles) {
  return !roles || roles.includes(role);
}

function matchesQuery(topic, q) {
  const hay = [topic.title, topic.intro, topic.note, ...(topic.steps || []), ...(topic.points || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((word) => hay.includes(word));
}

export default function HelpSupport() {
  const { user } = useAuth();
  const role = user?.role;
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [openTopic, setOpenTopic] = useState(null);

  const categories = useMemo(
    () =>
      HELP_CATEGORIES
        .filter((c) => showAll || visibleFor(role, c.roles))
        .map((c) => ({ ...c, topics: c.topics.filter((t) => showAll || visibleFor(role, t.roles)) }))
        .filter((c) => c.topics.length),
    [role, showAll]
  );

  const requested = params.get("cat");
  const activeId = categories.some((c) => c.id === requested) ? requested : categories[0]?.id;
  const active = categories.find((c) => c.id === activeId);

  const q = query.trim().toLowerCase();
  const results = q
    ? categories.flatMap((c) => c.topics.filter((t) => matchesQuery(t, q)).map((t) => ({ ...t, category: c })))
    : [];

  function pickCategory(id) {
    setQuery("");
    setOpenTopic(null);
    setParams({ cat: id }, { replace: true });
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl flex items-center gap-2.5">
        <Icons.LifeBuoy className="text-brand-blue" size={26} /> Help &amp; Support
      </h1>
      <p className="text-ink/60 mt-1">
        Learn how ProFixSAI works, step by step. Pick a category, or search for what you need.
      </p>

      <div className="relative mt-5 max-w-xl">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
        <input
          className="input !pl-10"
          placeholder="Search help — e.g. payment, warranty, status, add user…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-6 grid lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* Categories */}
        <nav aria-label="Help categories" className="card p-2 lg:sticky lg:top-6 flex lg:flex-col gap-1 overflow-x-auto">
          {categories.map((c) => {
            const Icon = Icons[c.icon] || Icons.HelpCircle;
            const isActive = !q && c.id === activeId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => pickCategory(c.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left whitespace-nowrap lg:whitespace-normal transition-colors ${
                  isActive ? "bg-brand-blue/10 text-brand-blueDeep" : "text-ink/70 hover:bg-ink/5"
                }`}
              >
                <Icon size={17} className="shrink-0" />
                <span className="flex-1">{c.title}</span>
                <span className="hidden lg:inline text-xs text-ink/35">{c.topics.length}</span>
              </button>
            );
          })}
          <label className="hidden lg:flex items-center gap-2 px-3 pt-3 mt-1 border-t border-ink/10 text-xs text-ink/55 cursor-pointer">
            <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
            Show topics for all roles
          </label>
        </nav>

        {/* Topics */}
        <div>
          {q ? (
            <div>
              <p className="text-sm text-ink/55 mb-3">
                {results.length} result{results.length === 1 ? "" : "s"} for “{query}”
              </p>
              {results.length === 0 && (
                <div className="card p-6 text-sm text-ink/60">
                  Nothing matched. Try a simpler word, or tick “Show topics for all roles”.
                </div>
              )}
              <div className="flex flex-col gap-3">
                {results.map((t) => (
                  <Topic
                    key={`${t.category.id}-${t.id}`}
                    topic={t}
                    crumb={t.category.title}
                    open={openTopic === `${t.category.id}-${t.id}`}
                    onToggle={() => setOpenTopic(openTopic === `${t.category.id}-${t.id}` ? null : `${t.category.id}-${t.id}`)}
                  />
                ))}
              </div>
            </div>
          ) : (
            active && (
              <div>
                <h2 className="font-display font-semibold text-lg">{active.title}</h2>
                <p className="text-sm text-ink/55 mt-0.5 mb-4">{active.summary}</p>
                <div className="flex flex-col gap-3">
                  {active.topics.map((t, i) => {
                    const key = `${active.id}-${t.id}`;
                    return (
                      <Topic
                        key={key}
                        topic={t}
                        open={openTopic === key || (openTopic === null && i === 0)}
                        onToggle={() => setOpenTopic(openTopic === key || (openTopic === null && i === 0) ? "__none" : key)}
                      />
                    );
                  })}
                </div>
              </div>
            )
          )}

          <div className="card p-5 mt-8 flex gap-3">
            <Info size={18} className="text-brand-blue shrink-0 mt-0.5" />
            <div className="text-sm text-ink/65">
              <p className="font-semibold text-ink/80">Still stuck?</p>
              <p className="mt-1">
                Ask your system administrator, and include what you were trying to do and the message you saw on screen.
                Administrators can also open <strong>Audit Logs</strong> to see what changed and when.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Topic({ topic, open, onToggle, crumb }) {
  return (
    <div className="card overflow-hidden">
      <button type="button" onClick={onToggle} aria-expanded={open} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-ink/[0.02]">
        <div className="flex-1 min-w-0">
          {crumb && <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/35">{crumb}</p>}
          <p className="font-display font-semibold">{topic.title}</p>
          {topic.roles && (
            <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-fog-200 text-ink/60">
              {ROLE_LABEL[topic.roles.length === 1 ? topic.roles[0] : "staff"]}
            </span>
          )}
        </div>
        <ChevronDown size={18} className={`text-ink/40 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 text-sm text-ink/75 leading-relaxed border-t border-ink/5 pt-4">
          {topic.intro && <p>{topic.intro}</p>}
          {topic.steps && (
            <ol className="mt-3 flex flex-col gap-2">
              {topic.steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blueDeep text-xs font-bold grid place-items-center">{i + 1}</span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          )}
          {topic.points && (
            <ul className={`flex flex-col gap-2 ${topic.intro || topic.steps ? "mt-4" : ""}`}>
              {topic.points.map((p, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-red/70 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
          {topic.note && (
            <p className="mt-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-2.5 text-[13px]">
              <strong>Good to know: </strong>{topic.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
