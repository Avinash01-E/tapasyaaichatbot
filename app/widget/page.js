import Widget from "../../components/Widget";

export const metadata = {
  title: "Tapasya AI Assistant Widget",
};

export default function WidgetPage() {
  return (
    <div style={{ height: "100vh" }}>
      <Widget embedded />
    </div>
  );
}
