"use client";

import React, { useEffect, useState } from "react";

type Item = { id: number; title: string; createdAt: string };

export default function OutputsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await fetch("/api/outputs");
        if (!r.ok) throw new Error(await r.text());
        const data = (await r.json()) as Item[];
        if (alive) setItems(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        if (alive) setErr(message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Saved Outputs</h1>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: "crimson" }}>Error: {err}</p>}

      {!loading && !err && (
        <ul>
          {items.map((i) => (
            <li key={i.id}>
              <a href={`/api/outputs/${i.id}`} target="_blank" rel="noreferrer">
                {i.title}
              </a>{" "}
              — {new Date(i.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}

      {!loading && !err && items.length === 0 && <p>No data yet.</p>}
    </div>
  );
}
