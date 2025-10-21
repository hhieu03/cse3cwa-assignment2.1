// app/tabs/page.tsx
"use client";
import React from "react";
import SaveToDbButton from "@/components/SaveToDbButton";

type Tab = { id: string; title: string; content: string };

const LS_KEY = "tabs-v1";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function escapeHtml(s: string) {
  return (s || "").replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );
}

function minifyJs(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function generateOutputHTML(tabs: Tab[]) {
  const buttons = tabs
    .map((t, i) => {
      const isFirst = i === 0;
      return `
      <button role="tab" id="tab-${i + 1}" aria-controls="panel-${i + 1}" aria-selected="${
        isFirst ? "true" : "false"
      }"
        tabindex="${isFirst ? "0" : "-1"}"
        style="padding:8px 12px;border:1px solid rgba(127,127,127,.35);border-radius:10px;margin-right:6px;cursor:pointer;background:${
          isFirst ? "#e8eefc" : "transparent"
        };color:#111;outline:none;">
        ${escapeHtml(t.title || `Tab ${i + 1}`)}
      </button>`;
    })
    .join("");

  const panels = tabs
    .map((t, i) => {
      const isFirst = i === 0;
      return `
      <div role="tabpanel" id="panel-${i + 1}" aria-labelledby="tab-${i + 1}"
        style="display:${isFirst ? "block" : "none"};margin-top:12px;padding:12px;border:1px solid rgba(127,127,127,.35);border-radius:10px;">
        ${escapeHtml(t.content || `Content ${i + 1}`).replace(/\n/g, "<br/>")}
      </div>`;
    })
    .join("");

  const script = `
  (function(){
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));
    function activate(idx){
      tabs.forEach(function(btn, i){
        var active = i===idx;
        btn.setAttribute('aria-selected', active? 'true':'false');
        btn.setAttribute('tabindex', active? '0':'-1');
        btn.style.background = active ? '#e8eefc' : 'transparent';
      });
      panels.forEach(function(p, i){
        p.style.display = i===idx ? 'block' : 'none';
      });
      try { localStorage.setItem('activeTabIndex', String(idx)); } catch(e){}
    }
    tabs.forEach(function(btn, i){
      btn.addEventListener('click', function(){ activate(i); btn.focus(); });
      btn.addEventListener('keydown', function(e){
        var k = e.key;
        if(k==='ArrowRight' || k==='ArrowLeft'){
          e.preventDefault();
          var dir = (k==='ArrowRight') ? 1 : -1;
          var ni = (i + dir + tabs.length) % tabs.length;
          activate(ni);
          tabs[ni].focus();
        }
        if(k==='Home'){ e.preventDefault(); activate(0); tabs[0].focus(); }
        if(k==='End'){ e.preventDefault(); activate(tabs.length-1); tabs[tabs.length-1].focus(); }
      });
    });
    try {
      var saved = parseInt(localStorage.getItem('activeTabIndex') || '0', 10);
      if(!isNaN(saved) && saved>=0 && saved<tabs.length){ activate(saved); }
    } catch(e){}
  })();`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Inline Tabs</title>
</head>
<body style="font-family: Arial, system-ui, -apple-system, Segoe UI, Roboto; margin:0; padding:16px; background:#ffffff; color:#111111;">
  <main style="max-width:980px;margin:0 auto;">
    <h1 style="margin:0 0 12px 0;">Tabs (Inline CSS, No Classes)</h1>
    <div role="tablist" aria-label="Sample Tabs" style="display:flex;flex-wrap:wrap;gap:6px;">
      ${buttons}
    </div>
    ${panels}
  </main>
  <script>${minifyJs(script)}</script>
</body>
</html>`;
}

export default function TabsPage() {
  const [tabs, setTabs] = React.useState<Tab[]>([]);
  const [output, setOutput] = React.useState("");

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setTabs(JSON.parse(raw));
      else setTabs([{ id: uid(), title: "Tab 1", content: "Hello from Tab 1" }]);
    } catch {
      setTabs([{ id: uid(), title: "Tab 1", content: "Hello from Tab 1" }]);
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(tabs));
    } catch {}
  }, [tabs]);

  const addTab = () => {
    if (tabs.length >= 15) return;
    setTabs((prev) => [
      ...prev,
      { id: uid(), title: `Tab ${prev.length + 1}`, content: `Content ${prev.length + 1}` },
    ]);
  };

  const removeTab = (id: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTab = (id: string, patch: Partial<Tab>) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const generate = () => {
    if (tabs.length === 0) return;
    setOutput(generateOutputHTML(tabs));
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      alert("Copied!");
    } catch {
      const ta = document.getElementById("output-area") as HTMLTextAreaElement | null;
      if (ta) {
        ta.focus();
        ta.select();
      }
    }
  };

  const presets = {
    one: () => setTabs([{ id: uid(), title: "Intro", content: "This is a single tab." }]),
    three: () =>
      setTabs([
        { id: uid(), title: "Alpha", content: "Alpha content" },
        { id: uid(), title: "Beta", content: "Beta content" },
        { id: uid(), title: "Gamma", content: "Gamma content" },
      ]),
    five: () =>
      setTabs([
        { id: uid(), title: "One", content: "1" },
        { id: uid(), title: "Two", content: "2" },
        { id: uid(), title: "Three", content: "3" },
        { id: uid(), title: "Four", content: "4" },
        { id: uid(), title: "Five", content: "5" },
      ]),
  };

  return (
    <div className="card">
      <h1>Tabs Page</h1>
      <p>
        Up to 15 tabs. Change headings, update content, stored in <code>localStorage</code>. Generate HTML + JS output with inline CSS only.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0 16px" }}>
        <button className="btn" onClick={presets.one}>Preset: 1 tab</button>
        <button className="btn" onClick={presets.three}>Preset: 3 tabs</button>
        <button className="btn" onClick={presets.five}>Preset: 5 tabs</button>
      </div>

      <section aria-label="Tabs editor" style={{ display: "grid", gap: 16 }}>
        {tabs.map((t, idx) => (
          <div key={t.id} className="card" style={{ padding: "12px" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <strong>Tab {idx + 1}</strong>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn"
                  onClick={() => {
                    const title = prompt("New title", t.title) ?? t.title;
                    updateTab(t.id, { title });
                  }}
                >
                  Rename
                </button>
                <button className="btn" onClick={() => removeTab(t.id)} disabled={tabs.length <= 1}>
                  - Remove
                </button>
              </div>
            </div>

            <label style={{ display: "block", marginTop: 8 }}>
              <span style={{ display: "block", marginBottom: 6 }}>Heading</span>
              <input type="text" value={t.title} onChange={(e) => updateTab(t.id, { title: e.target.value })} />
            </label>

            <label style={{ display: "block", marginTop: 8 }}>
              <span style={{ display: "block", marginBottom: 6 }}>Content</span>
              <textarea rows={4} value={t.content} onChange={(e) => updateTab(t.id, { content: e.target.value })} />
            </label>
          </div>
        ))}
      </section>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button className="btn" onClick={addTab} disabled={tabs.length >= 15}>+ Add Tab</button>
        <button
          className="btn"
          onClick={() => {
            if (confirm("Reset all tabs?"))
              setTabs([{ id: uid(), title: "Tab 1", content: "Hello from Tab 1" }]);
          }}
        >
          Reset
        </button>
        <span style={{ alignSelf: "center" }}>
          Current: <strong>{tabs.length}</strong> / 15
        </span>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <h2>Output</h2>
      <p>Click <strong>Generate Output</strong> to create HTML code. Then copy and paste into a blank <code>Hello.html</code> file.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn" onClick={generate}>Generate Output</button>
        <button className="btn" onClick={copyOutput} disabled={!output}>Copy</button>
        <SaveToDbButton content={output} />
          <button className="btn" onClick={() => { window.location.href = "/outputs"; }}>📂 View Outputs</button>
      </div>
      <textarea id="output-area" rows={16} value={output} readOnly style={{ marginTop: 12 }} aria-label="Generated HTML output"></textarea>
    </div>
  );
}
