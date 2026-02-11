import Widget from "../../components/Widget";

export const metadata = {
  title: "Tapasya AI Assistant Widget",
};

export default function WidgetPage() {
  return (
    <div style={{
      height: "100%",
      width: "100%",
      // Remove flex alignment so it fills the space naturally
      padding: 0,
      margin: 0
    }}>
      <Widget embedded />
    </div>
  );
}
