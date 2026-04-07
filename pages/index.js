import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");

  async function handleSubmit() {
    setResult("Analyzing...");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setResult(data.result);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>AI Visibility Score</h1>

      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Analyze
      </button>

      <p>{result}</p>
    </div>
  );
}
