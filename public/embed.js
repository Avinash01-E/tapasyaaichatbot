(function () {
    // Configuration
    const WIDGET_URL = "http://localhost:3000/widget"; // Change this to your deployed URL in production
    const WIDGET_WIDTH = "400px";
    const WIDGET_HEIGHT = "600px";

    // Create container
    const container = document.createElement("div");
    container.id = "tapasya-chat-widget-container";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "flex-end";
    document.body.appendChild(container);

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = WIDGET_URL;
    iframe.style.width = WIDGET_WIDTH;
    iframe.style.height = WIDGET_HEIGHT;
    iframe.style.border = "none";
    iframe.style.borderRadius = "10px";
    iframe.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    iframe.style.marginBottom = "10px";
    iframe.style.display = "none"; // Initially hidden
    iframe.style.backgroundColor = "transparent";
    container.appendChild(iframe);

    // Create launcher button
    const button = document.createElement("button");
    button.innerText = "Chat";
    button.style.backgroundColor = "#0f172a";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "50%"; // Circular button
    button.style.width = "60px";
    button.style.height = "60px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    button.style.fontSize = "16px";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";

    // Add icon (optional, using simple text for now)
    button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;

    container.appendChild(button);

    // Toggle functionality
    let isOpen = false;
    button.onclick = function () {
        isOpen = !isOpen;
        iframe.style.display = isOpen ? "block" : "none";
        button.innerHTML = isOpen
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>` // Close icon
            : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`; // Chat icon
    };

})();
