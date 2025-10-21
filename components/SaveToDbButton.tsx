// components/SaveToDbButton.tsx
"use client";
import React from "react";

export default function SaveToDbButton({ content }: { content: string }) {
  const saveOutput = async () => {
    if (!content) {
      alert("Generate first!");
      return;
    }
    const title = prompt("Title for this output?");
    if (!title) return;

    const res = await fetch("/api/outputs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) alert("Saved to DB!");
    else {
      const t = await res.text();
      alert("Save failed: " + t);
    }
  };

  return (
    <button className="btn" onClick={saveOutput} disabled={!content}>
      💾 Save to DB
    </button>
  );
}
