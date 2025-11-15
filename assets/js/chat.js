// assets/js/chat.js
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('chat-toggle');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');

  const API_URL = "https://taha-43-web-portfolio.hf.space/respond";

  function openPanel() {
    panel.classList.add('open');
    input.focus();
  }
  function closePanel() {
    panel.classList.remove('open');
  }

  toggle.addEventListener('click', () => {
    panel.classList.contains('open') ? closePanel() : openPanel();
  });
  closeBtn.addEventListener('click', closePanel);

  function appendMessage(text, who = 'bot') {
    const div = document.createElement('div');
    div.className = who === 'user'
      ? 'chat-msg chat-user'
      : who === 'system'
      ? 'chat-system'
      : 'chat-msg chat-bot';
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendToBot(message) {
    try {
      appendMessage("...", "system"); // temporary loader
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      // remove "..." loader
      const last = messages.lastElementChild;
      if (last && last.classList.contains("chat-system")) last.remove();

      if (!response.ok) throw new Error("Network error: " + response.status);

      const data = await response.json();
      const reply = data.response || data.answer || JSON.stringify(data);
      appendMessage(reply, "bot");
    } catch (error) {
      appendMessage("⚠️ Error: Unable to reach AI bot.", "system");
      console.error(error);
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    input.value = '';
    sendToBot(text);
  });
});
