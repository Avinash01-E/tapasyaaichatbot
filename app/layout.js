export const metadata = {
  title: "Tapasya AI Assistant",
  description: "Embeddable hybrid AI chatbot widget",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "ui-sans-serif, system-ui" }}>
        {children}
      </body>
    </html>
  );
}
