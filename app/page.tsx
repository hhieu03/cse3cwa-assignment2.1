// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="card">
      <h1>Home</h1>
      <p>
        This page shows how to use the Tabs code generator (HTML5 + JS) just use <strong>inline CSS</strong>, 
        meets the requirements of “pasting into an empty file still works” and “not using CSS classes”.
      </p>

      <ul>
        <li>Go to <Link href="/tabs">Tabs Page</Link> to create up to 15 tabs, change title, content, save to <code>localStorage</code>, and Export code.</li>
        <li><Link href="/about">About</Link> has Name, Student Code, and video tutorial (you replace your file/video).</li>
      </ul>

      <div style={{display:"grid", gap:12, marginTop:16}}>
        <Link className="btn" href="/tabs">👉 Open Tabs Page</Link>
        <Link className="btn" href="/about">ℹ️ Watch About + Video</Link>
      </div>
    </div>
  );
}
