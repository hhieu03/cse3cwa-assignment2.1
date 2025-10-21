// components/Footer.tsx
import React from "react";
import { STUDENT } from "@/lib/config";

export default function Footer() {
  const date = new Date().toLocaleDateString();
  return (
    <footer role="contentinfo">
      <div className="container">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap"}}>
          <small>
            {STUDENT.copyright}
            {" · "}Student: {STUDENT.name} ({STUDENT.number})
            {" · "}Date: {date}
          </small>
          <small>Built for Assignment 1 (Front-end part). Accessibility friendly.</small>
        </div>
      </div>
    </footer>
  );
}
