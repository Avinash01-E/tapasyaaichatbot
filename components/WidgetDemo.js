import Widget from "./Widget";

export default function WidgetDemo() {
  return (
    <section style={{ marginTop: 24 }}>
      <h2>Live Widget Preview</h2>
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 16,
          background: "#f8fafc",
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <Widget />
      </div>
    </section>
  );
}
