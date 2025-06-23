const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

sendButton.addEventListener('click', async () => {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage('user', message);
  userInput.value = '';

  appendMessage('bot', '...');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();
    updateLastBotMessage(data.choices?.[0]?.message?.content || '응답을 받을 수 없습니다.');
  } catch (error) {
    updateLastBotMessage('오류가 발생했습니다.');
  }
});

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});

function appendMessage(sender, text) {
  const messageEl = document.createElement('div');
  messageEl.className = `message ${sender}`;
  messageEl.textContent = `${sender === 'user' ? '나' : '챗봇'}: ${text}`;
  chatWindow.appendChild(messageEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateLastBotMessage(text) {
  const messages = chatWindow.querySelectorAll('.message.bot');
  if (messages.length > 0) {
    messages[messages.length - 1].textContent = `챗봇: ${text}`;
  }
}