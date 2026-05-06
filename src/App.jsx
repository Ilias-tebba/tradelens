import { useState } from "react";

const sections = [
  {
    id: "news", label: "NEWS", icon: "01", color: "#ff4d4d",
    items: [
      { id: "news_clear",   label: "ماكاين خبر خلال 30 دقيقة",      weight: 15 },
      { id: "news_session", label: "London Open / NY Open",           weight: 10 },
      { id: "news_impact",  label: "High Impact News مرات — تجنب",   weight: 10 },
    ],
  },
  {
    id: "usdx_poi", label: "USDX — POI", icon: "02", color: "#ff8c42",
    items: [
      { id: "usdx_at_poi",    label: "USDX عند POI واضح",                 weight: 15 },
      { id: "usdx_reaction",  label: "USDX كيعطي رد فعل من الـ POI",       weight: 10 },
      { id: "usdx_structure", label: "Structure ديال USDX واضح (HH/LL)",   weight: 10 },
    ],
  },
  {
    id: "gbp_poi", label: "GBP — POI", icon: "03", color: "#ffd166",
    items: [
      { id: "gbp_at_poi",    label: "GBP عند POI واضح",                   weight: 15 },
      { id: "gbp_reaction",  label: "GBP كيعطي رد فعل من الـ POI",        weight: 10 },
      { id: "gbp_structure", label: "Structure ديال GBP واضح",            weight: 10 },
      { id: "corr",          label: "Correlation USDX / GBP معاكسة ✓",    weight: 10 },
    ],
  },
  {
    id: "vwap", label: "VWAP — GBP ONLY", icon: "04", color: "#06d6a0",
    items: [
      { id: "vwap_poi",    label: "GBP عند VWAP أو بعيد عنها",  weight: 10 },
      { id: "vwap_align",  label: "VWAP تتماشى مع الـ POI",      weight: 10 },
      { id: "vwap_target", label: "VWAP واضحة كهدف أو مرجع",    weight: 5  },
    ],
  },
  {
    id: "footprint", label: "FOOTPRINT", icon: "05", color: "#a78bfa",
    items: [
      { id: "absorption", label: "ABSORPTION — سعر ثابت مع volume عالي",   weight: 20 },
      { id: "delta_flip", label: "DELTA FLIP (DF) — تغيير اتجاه الـ delta",weight: 20 },
      { id: "imbalance",  label: "IMBALANCE (IM) — فرق واضح BID / ASK",    weight: 20 },
    ],
  },
  {
    id: "rejecting", label: "REJECTING", icon: "06", color: "#f72585",
    items: [
      { id: "rej_wick",  label: "Wick طويل يرفض الـ POI",           weight: 15 },
      { id: "rej_close", label: "الكانديل يغلق داخل الـ range",      weight: 10 },
      { id: "rej_body",  label: "Body صغير = ضغط قوي على السعر",     weight: 10 },
    ],
  },
  {
    id: "fibo", label: "FIBONACCI — USDX / GBP", icon: "07", color: "#00d4ff",
    items: [
      { id: "fibo_level", label: "السعر عند Fibo 0.618 / 0.786",       weight: 15 },
      { id: "fibo_usdx",  label: "USDX عند نفس Fibo Zone",             weight: 10 },
      { id: "fibo_gbp",   label: "GBP عند Fibo يتوافق مع الـ POI",     weight: 10 },
      { id: "fibo_conf",  label: "Fibo + POI + Footprint = Confluence", weight: 15 },
    ],
  },
];

const totalWeight = sections.reduce(
  (acc, s) => acc + s.items.reduce((a, i) => a + i.weight, 0), 0
);

function getStatus(score) {
  if (score >= 88) return { label: "EXECUTE", color: "#00ff88", bg: "#00ff8812", border: "#00ff8840" };
  if (score >= 70) return { label: "STRONG",  color: "#ffd166", bg: "#ffd16612", border: "#ffd16640" };
  if (score >= 50) return { label: "WEAK",    color: "#ff8c42", bg: "#ff8c4212", border: "#ff8c4240" };
  return              { label: "SKIP",    color: "#ff4d4d", bg: "#ff4d4d12", border: "#ff4d4d40" };
}

function Arc({ score }) {
  const R = 58, C = 2 * Math.PI * R;
  const st = getStatus(score);
  return (
    <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto" }}>
      <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="80" cy="80" r={R} fill="none" stroke="#111" strokeWidth="8" />
        <circle cx="80" cy="80" r={R} fill="none"
          stroke={st.color} strokeWidth="8"
          strokeDasharray={C}
          strokeDashoffset={C - (score / 100) * C}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .5s cubic-bezier(.4,2,.6,1), stroke .3s" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: st.color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 9, color: "#444", letterSpacing: 3, marginTop: 2 }}>SCORE</div>
        <div style={{ marginTop: 6, fontSize: 9, fontWeight: 700, letterSpacing: 3, color: st.color, background: st.bg, border: `1px solid ${st.border}`, padding: "3px 10px", borderRadius: 20 }}>{st.label}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [checked, setChecked] = useState({});
  const [open, setOpen]       = useState(() => Object.fromEntries(sections.map(s => [s.id, true])));
  const [tab, setTab]         = useState("check");
  const [note, setNote]       = useState("");
  const [logs, setLogs]       = useState([]);
  const [slPips, setSlPips]   = useState(15);

  const score = Math.round(
    sections.reduce((a, s) => a + s.items.reduce((b, i) => b + (checked[i.id] ? i.weight : 0), 0), 0)
    / totalWeight * 100
  );

  const st = getStatus(score);
  const checkedN = Object.values(checked).filter(Boolean).length;
  const totalN   = sections.reduce((a, s) => a + s.items.length, 0);
  const toggle = id => setChecked(p => ({ ...p, [id]: !p[id] }));
  const reset  = () => { setChecked({}); setNote(""); };
  const save = () => {
    if (score < 50) return;
    setLogs(p => [{ id: Date.now(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), score, label: st.label, color: st.color, note }, ...p].slice(0, 30));
    reset();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#06060f", fontFamily: "'Courier New', monospace", color: "#fff", maxWidth: 430, margin: "0 auto", paddingBottom: 90 }}>
      <div style={{ padding: "18px 18px 0", borderBottom: "1px solid #0f0f1e", paddingBottom: 14, position: "sticky", top: 0, background: "#06060f", zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 8, color: "#2a2a3a", letterSpacing: 4 }}>CONFLUENCE SYSTEM</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>TRADE<span style={{ color: "#00d4ff" }}>LENS</span></div>
          </div>
          <div style={{ fontSize: 9, color: st.color, background: st.bg, border: `1px solid ${st.border}`, padding: "5px 12px", borderRadius: 20 }}>{checkedN}/{totalN}</div>
        </div>
        <div style={{ display: "flex", marginTop: 12, borderBottom: "1px solid #111" }}>
          {[["check","CHECKLIST"],["log","LOG"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "8px 0", background: "none", border: "none", borderBottom: tab === k ? "2px solid #00d4ff" : "2px solid transparent", color: tab === k ? "#00d4ff" : "#333", fontSize: 9, letterSpacing: 3, cursor: "pointer", fontFamily: "monospace" }}>{l}</button>
          ))}
        </div>
      </div>

      {tab === "check" && (
        <div style={{ padding: 16 }}>
          <div style={{ background: "#0b0b1a", borderRadius: 18, padding: 20, marginBottom: 14, border: `1px solid ${st.border}`, boxShadow: `0 0 60px ${st.bg}` }}>
            <Arc score={score} />
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 9, color: "#333", letterSpacing: 2 }}>
              {score >= 88 ? "ALL CONDITIONS MET — EXECUTE" : score >= 70 ? "STRONG — REVIEW MISSING ITEMS" : score >= 50 ? "WEAK — WAIT FOR MORE CONFLUENCE" : "DO NOT ENTER"}
            </div>
          </div>

          {sections.map(sec => {
            const done = sec.items.filter(i => checked[i.id]).length;
            const full = done === sec.items.length;
            return (
              <div key={sec.id} style={{ background: "#0a0a17", borderRadius: 14, marginBottom: 8, border: `1px solid ${full ? sec.color + "33" : "#111"}`, overflow: "hidden" }}>
                <div onClick={() => setOpen(p => ({ ...p, [sec.id]: !p[sec.id] }))} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 9, color: sec.color, border: `1px solid ${sec.color}44`, padding: "2px 6px", borderRadius: 4 }}>{sec.icon}</span>
                    <span style={{ fontSize: 11, letterSpacing: 2, color: full ? "#fff" : "#666" }}>{sec.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, color: full ? sec.color : "#333", background: full ? sec.color + "1a" : "#111", padding: "2px 8px", borderRadius: 10 }}>{done}/{sec.items.length}</span>
                    <span style={{ color: "#222", fontSize: 10 }}>{open[sec.id] ? "▲" : "▼"}</span>
                  </div>
                </div>
                {open[sec.id] && (
                  <div style={{ padding: "0 16px 12px" }}>
                    {sec.items.map((item, idx) => {
                      const on = !!checked[item.id];
                      return (
                        <div key={item.id} onClick={() => toggle(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: idx < sec.items.length - 1 ? "1px solid #0f0f1e" : "none", cursor: "pointer" }}>
                          <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, border: `1.5px solid ${on ? sec.color : "#1e1e2e"}`, background: on ? sec.color + "20" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
                            {on && <div style={{ width: 8, height: 8, borderRadius: 2, background: sec.color }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, color: on ? "#ccc" : "#444", lineHeight: 1.4 }}>{item.label}</div>
                            <div style={{ fontSize: 8, color: "#1e1e2e", marginTop: 1 }}>+{item.weight} pts</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ background: "#0a0a17", borderRadius: 14, padding: 16, marginBottom: 8, border: "1px solid #111" }}>
            <div style={{ fontSize: 8, color: "#333", letterSpacing: 3, marginBottom: 12 }}>TRADE MANAGER</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 9, color: "#444" }}>SL</span>
              <input type="number" value={slPips} onChange={e => setSlPips(Math.max(1, Number(e.target.value)))} style={{ width: 56, background: "#0d0d1c", border: "1px solid #1e1e2e", borderRadius: 8, color: "#fff", padding: "5px 8px", fontSize: 14, fontFamily: "monospace", outline: "none", textAlign: "center" }} />
              <span style={{ fontSize: 9, color: "#333" }}>PIPS</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{ lot: "1", rr: 2, color: "#06d6a0", note: "BE @ 1:1 → CLOSE" }, { lot: "2", rr: 5, color: "#a78bfa", note: "BE @ 1:2 → TRAIL" }].map(l => (
                <div key={l.lot} style={{ background: "#0d0d1c", borderRadius: 10, padding: 12, border: `1px solid ${l.color}22` }}>
                  <div style={{ fontSize: 8, color: l.color, letterSpacing: 3, marginBottom: 6 }}>LOT {l.lot}</div>
                  <div style={{ fontSize: 8, color: "#333" }}>RR</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>1:{l.rr}</div>
                  <div style={{ marginTop: 6, fontSize: 8, color: "#333" }}>TP</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: l.color }}>{slPips * l.rr}<span style={{ fontSize: 9, color: "#333" }}> pips</span></div>
                  <div style={{ marginTop: 4, fontSize: 8, color: "#2a2a3a" }}>{l.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#0a0a17", borderRadius: 14, padding: 14, marginBottom: 8, border: "1px solid #111" }}>
            <div style={{ fontSize: 8, color: "#333", letterSpacing: 3, marginBottom: 8 }}>NOTE</div>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="entry / sl / observation..." style={{ width: "100%", background: "#0d0d1c", border: "1px solid #1a1a2e", borderRadius: 8, color: "#777", padding: 10, fontSize: 11, fontFamily: "monospace", resize: "none", height: 52, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={reset} style={{ flex: 1, padding: 14, borderRadius: 12, background: "#0d0d1c", border: "1px solid #1a1a2e", color: "#333", fontSize: 9, letterSpacing: 3, cursor: "pointer", fontFamily: "monospace" }}>RESET</button>
            <button onClick={save} disabled={score < 50} style={{ flex: 2.5, padding: 14, borderRadius: 12, background: score >= 88 ? "#00ff8812" : score >= 70 ? "#ffd16612" : "#0d0d1c", border: `1px solid ${score >= 88 ? "#00ff8850" : score >= 70 ? "#ffd16650" : "#1a1a2e"}`, color: score >= 88 ? "#00ff88" : score >= 70 ? "#ffd166" : "#333", fontSize: 9, letterSpacing: 3, cursor: score >= 50 ? "pointer" : "not-allowed", fontFamily: "monospace", fontWeight: 700, transition: "all .3s" }}>
              {score >= 88 ? "✓ SAVE & EXECUTE" : score >= 70 ? "SAVE SETUP" : "NOT READY"}
            </button>
          </div>
        </div>
      )}

      {tab === "log" && (
        <div style={{ padding: 16 }}>
          {logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: 80, color: "#1a1a2e" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>◈</div>
              <div style={{ fontSize: 9, letterSpacing: 4 }}>NO ENTRIES YET</div>
            </div>
          ) : (
            <>
              <div style={{ background: "#0a0a17", borderRadius: 14, padding: 16, marginBottom: 12, border: "1px solid #111" }}>
                <div style={{ fontSize: 8, color: "#333", letterSpacing: 3, marginBottom: 10 }}>SUMMARY</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[{ v: logs.length, l: "SETUPS" }, { v: Math.round(logs.reduce((a,t) => a + t.score, 0) / logs.length) + "%", l: "AVG" }, { v: logs.filter(t => t.score >= 88).length, l: "EXECUTE" }].map(s => (
                    <div key={s.l} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: "#00d4ff" }}>{s.v}</div>
                      <div style={{ fontSize: 8, color: "#333", letterSpacing: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              {logs.map(t => (
                <div key={t.id} style={{ background: "#0a0a17", borderRadius: 12, padding: 14, marginBottom: 6, border: `1px solid ${t.color}22` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 8, color: "#333", letterSpacing: 2 }}>{t.time}</div>
                      {t.note && <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{t.note}</div>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: t.color, lineHeight: 1 }}>{t.score}</div>
                      <div style={{ fontSize: 8, color: t.color, background: t.color + "15", padding: "2px 8px", borderRadius: 10, marginTop: 2 }}>{t.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
