import WidgetDemo from "../components/WidgetDemo";

export default function HomePage() {
  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Tapasya AI Assistant</h1>
      <p style={{ marginTop: 0 }}>
        Hybrid chatbot: rule-based + semantic search (Qdrant) + DeepSeek.
      </p>
      <WidgetDemo />
      <section style={{ marginTop: 32 }}>
        <h2>Embed Snippet</h2>
        <pre
          style={{
            background: "#0f172a",
            color: "#e2e8f0",
            padding: 16,
            borderRadius: 8,
            overflowX: "auto",
          }}
        >{`<script src="/tapasya-widget.js" data-tapasya-origin="http://localhost:3000"></script>`}</pre>
        <p style={{ marginTop: 8 }}>
          Include the script above on any site to load the widget.
        </p>
      </section>
    </main>
  );
}
