// components/StudentBadge.tsx
"use client";
import React from "react";
import { STUDENT } from "@/lib/config";

export default function StudentBadge() {
  return (
    <div aria-label="Student" title="Student Number" style={{display:"flex",gap:8,alignItems:"center"}}>
      <strong>{STUDENT.number}</strong>
    </div>
  );
}
