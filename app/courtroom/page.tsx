"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Message = {
  id: string;
  text: string;
  kind: "boss" | "family" | "agile" | "a11y" | "security" | "login";
  dueAt: number;
  escalatesAt?: number;
  escalated?: boolean;
  resolved?: boolean;
};

const BG_URL = "/courtroom-bg.jpg";
const TICK = 250;
const DEFAULT_INTERVAL = 25_000; // 20–30s
const UID = () => Math.random().toString(36).slice(2, 9);

export default function CourtRoomPage() {
  const [now, setNow] = useState(Date.now());
  const [manualMins, setManualMins] = useState(5);
  const [running, setRunning] = useState(false);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const timerRef = useRef<number | null>(null);

  const seedMessages = useMemo(() => {
    const base = Date.now();
    const mk = (offset: number, text: string, kind: Message["kind"]) => ({
      id: UID(), text, kind, dueAt: base + offset, escalatesAt: base + offset + 120_000
    });
    return [
      mk(DEFAULT_INTERVAL, "Boss: Are you done with sprint 1?", "boss"),
      mk(DEFAULT_INTERVAL * 2, "Family: Pick up the kids after work?", "family"),
      mk(DEFAULT_INTERVAL * 3, "Agile: Change Title colour to Red.", "agile"),
      mk(DEFAULT_INTERVAL * 4, "Fix alt in img1 (accessibility).", "a11y"),
      mk(DEFAULT_INTERVAL * 5, "Fix input validation (security).", "security"),
      mk(DEFAULT_INTERVAL * 6, "Fix User login (broken).", "login"),
    ];
  }, []);

  useEffect(() => { setMessages(seedMessages); }, [seedMessages]);

  useEffect(() => {
    if (!running) return;
    timerRef.current = window.setInterval(() => setNow(Date.now()), TICK);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [running]);

  const startTimer = () => {
    const e = Date.now() + manualMins * 60_000;
    setEndAt(e); setRunning(true);
    setLog(l => [...l, `⏱️ Timer started for ${manualMins} minutes.`]);
  };
  const pauseTimer = () => { setRunning(false); setLog(l => [...l, "⏸️ Paused"]); };
  const resetTimer = () => { setRunning(false); setEndAt(null); setLog(l => [...l, "🔁 Reset"]); };
  const remainingMs = endAt ? Math.max(0, endAt - now) : 0;
  const mm = Math.floor(remainingMs/60_000), ss = Math.floor((remainingMs%60_000)/1000);

  useEffect(() => {
    if (!running) return;
    setMessages(prev => prev.map(m => {
      if (!m.resolved && !m.escalated && m.escalatesAt && now >= m.escalatesAt) {
        return { ...m, escalated: true, text: `URGENT: ${m.text}` };
      }
      return m;
    }));
  }, [now, running]);

  const dueList = messages.filter(m => !m.resolved && now >= m.dueAt);

  const resolveMessage = (id: string, note?: string) => {
    setMessages(prev => prev.map(m => m.id===id ? { ...m, resolved: true } : m));
    if (note) setLog(l => [...l, note]);
  };

  const showCourt =
    messages.some(m => ["a11y","security","login"].includes(m.kind) && m.escalated && !m.resolved);

  const tasks = [
    { key:"format",  text:"Format code correctly",      action:()=> setLog(l=>[...l,"✔ Code formatted"]) },
    { key:"debug",   text:"Click the bug icon to debug",action:()=> setLog(l=>[...l,"🪲 Debug console opened"]) },
    { key:"range",   text:"Write code print 0..1000",   action:()=> setLog(l=>[...l,"#0..1000 generated in output"]) },
    { key:"convert", text:"Port data from A -> B",      action:()=> setLog(l=>[...l,"🔁 Data converted"]) },
  ];

  return (
    <main
      style={{minHeight:"100vh", backgroundImage:`url(${BG_URL})`, backgroundSize:"cover", backgroundPosition:"center", padding:"16px"}}
      aria-label="Court Room Game"
    >
      <div style={{maxWidth:960, margin:"0 auto", background:"rgba(255,255,255,0.9)", padding:16, borderRadius:12}}>
        <h1>⚖️ Court Room</h1>

        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <label>Manual Timer (minutes):</label>
          <input type="number" min={1} value={manualMins} onChange={e=>setManualMins(+e.target.value)} />
          <button onClick={startTimer}>Start</button>
          <button onClick={pauseTimer}>Pause</button>
          <button onClick={resetTimer}>Reset</button>
          <strong style={{marginLeft:"auto"}}>⏳ {String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}</strong>
        </div>

        <div style={{display:"flex", gap:12, marginTop:12}}>
          <button title="Format"  onClick={()=>tasks[0].action()}><img alt="format"  src="/icons/format.svg"  height={28}/></button>
          <button title="Debug"   onClick={()=>tasks[1].action()}><img alt="debug"   src="/icons/debug.svg"   height={28}/></button>
          <button title="0..1000" onClick={()=>tasks[2].action()}><img alt="numbers" src="/icons/numbers.svg" height={28}/></button>
          <button title="Convert" onClick={()=>tasks[3].action()}><img alt="convert" src="/icons/convert.svg" height={28}/></button>
        </div>

        <section style={{marginTop:16}}>
          <h2>📨 Messages</h2>
          <ul>
            {dueList.map(m=>(
              <li key={m.id} style={{margin:"6px 0"}}>
                <strong>{m.kind.toUpperCase()}</strong>: {m.text}
                <button style={{marginLeft:8}} onClick={()=>resolveMessage(m.id, `✔ Resolved: ${m.text}`)}>Mark Done</button>
              </li>
            ))}
            {dueList.length===0 && <li>No new messages yet…</li>}
          </ul>
        </section>

        {showCourt && (
          <div role="alert" style={{marginTop:16, padding:16, border:"2px solid red", borderRadius:12}}>
            <h2>🏛️ COURT SUMMONS</h2>
            <p>You ignored critical issues (Accessibility/Security/Login). You are fined for breaking relevant laws.</p>
          </div>
        )}

        <details style={{marginTop:16}}>
          <summary>Event Log</summary>
          <ul>{log.map((l,i)=>(<li key={i}>{l}</li>))}</ul>
        </details>
      </div>
    </main>
  );
}
