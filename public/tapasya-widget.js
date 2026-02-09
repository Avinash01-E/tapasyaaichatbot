(() => {
  const scriptTag = document.currentScript;
  const origin = scriptTag?.dataset?.tapasyaOrigin || "http://localhost:3000";

  const container = document.createElement("div");
  container.id = "tapasya-widget-container";
  container.style.position = "fixed";
  container.style.bottom = "24px";
  container.style.right = "24px";
  container.style.width = "380px";
  container.style.height = "540px";
  container.style.zIndex = "999999";
  container.style.boxShadow = "0 20px 50px rgba(15, 23, 42, 0.2)";
  container.style.borderRadius = "18px";
  container.style.overflow = "hidden";

  const iframe = document.createElement("iframe");
  iframe.src = `${origin}/widget`;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.title = "Tapasya AI Assistant";

  container.appendChild(iframe);
  document.body.appendChild(container);
})();
