export const metadata = {
  title: "Tapasya AI Assistant",
  description: "Embeddable hybrid AI chatbot widget",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ margin: 0, fontFamily: "ui-sans-serif, system-ui", height: '100%' }}>
        {children}
      </body>
    </html>
  );
}
