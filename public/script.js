const sendBtn =
  document.getElementById("send-btn");

sendBtn.addEventListener(
  "click",
  sendMessage
);

async function sendMessage() {

  const input =
    document.getElementById("user-input");

  const message = input.value;

  if(message.trim() === "") return;

  const chatBox =
    document.getElementById("chat-box");



  // Show user message
  chatBox.innerHTML += `
    <div class="user">
      ${message}
    </div>
  `;

  input.value = "";



  try {

    const response = await fetch("/chat", {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        message
      })
    });

    const data =
      await response.json();



    // Show bot message
    chatBox.innerHTML += `
      <div class="bot">
        ${data.reply}
      </div>
    `;

  } catch(error) {

    console.log(error);

    chatBox.innerHTML += `
      <div class="bot">
        Error generating response
      </div>
    `;
  }
}