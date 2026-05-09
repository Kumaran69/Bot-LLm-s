const sendBtn = document.getElementById("send-btn");
const input = document.getElementById("user-input");

// Send on button click
sendBtn.addEventListener("click", sendMessage);

// Send on Enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {

  const message = input.value;

  if (message.trim() === "") return;

  const chatBox = document.getElementById("chat-box");

  // Show user message
  chatBox.innerHTML += `
    <div class="message user-message">
      <div class="avatar user-avatar">YOU</div>
      <div class="message-content">
        <div class="message-bubble">${message}</div>
        <div class="message-time">${getTime()}</div>
      </div>
    </div>
  `;

  input.value = "";
  scrollToBottom(chatBox);

  // Show typing indicator
  const typingId = "typing-" + Date.now();
  chatBox.innerHTML += `
    <div class="message bot-message" id="${typingId}">
      <div class="avatar bot-avatar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
      </div>
      <div class="message-content">
        <div class="message-bubble">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  scrollToBottom(chatBox);

  try {

    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // Remove typing indicator
    document.getElementById(typingId)?.remove();

    // Show bot message
    chatBox.innerHTML += `
      <div class="message bot-message">
        <div class="avatar bot-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
        </div>
        <div class="message-content">
          <div class="message-bubble">${data.reply}</div>
          <div class="message-time">${getTime()}</div>
        </div>
      </div>
    `;

  } catch (error) {

    console.log(error);

    // Remove typing indicator
    document.getElementById(typingId)?.remove();

    // Show error message
    chatBox.innerHTML += `
      <div class="message bot-message">
        <div class="avatar bot-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
        </div>
        <div class="message-content">
          <div class="message-bubble" style="border-color: rgba(255,80,80,0.3); color: #ff6b6b;">
            ⚠ Signal lost. Error generating response.
          </div>
          <div class="message-time">${getTime()}</div>
        </div>
      </div>
    `;
  }

  scrollToBottom(chatBox);
}

// Helpers
function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function scrollToBottom(el) {
  el.scrollTop = el.scrollHeight;
}