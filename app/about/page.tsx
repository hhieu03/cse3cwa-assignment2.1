// app/about/page.tsx
import { STUDENT } from "@/lib/config";

export default function AboutPage() {
  return (
    <article className="card">
      <h1>About</h1>
      <p><strong>Name:</strong> {STUDENT.name}</p>
      <p><strong>Student Number:</strong> {STUDENT.number}</p>

      <h2>How to use this website (Video)</h2>
      <ol>
        <li>Open <strong>Tabs</strong> → Use Preset “1 / 3 / 5 tabs”.</li>
        <li>Edit content → choose <strong>Generate Output</strong>.</li>
        <li><strong>Copy</strong> code → paste to <code>Hello.html</code> → open in browser.</li>
      </ol>

      {/* YouTube video */}
      <div style={{ marginTop: 12 }}>
        <iframe
          width="720"
          height="405"
          src="https://www.youtube.com/embed/AyEyxc9ezKM"
          title="How to use this website"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </article>
  );
}
