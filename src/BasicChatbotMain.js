const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
let chatHistory = [];
const systemPrompt = '당신은 사용자의 취향과 상황을 고려하여 점심 메뉴를 추천해주는 똑똑한 챗봇입니다.';
let isProcessing = false;

sendButton.addEventListener('click', async () => {
  if (isProcessing) return;
  isProcessing = true;

  const message = userInput.value.trim();
  if (!message) {
    isProcessing = false;
    return;
  }

  appendMessage('user', message);
  userInput.value = '';

  try {
    chatHistory.push({ role: 'user', content: message });
    console.log('사용자 입력:', message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory
        ],
      }),
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || '응답을 받을 수 없습니다.';
    chatHistory.push({ role: 'assistant', content: botReply });
    console.log('챗봇 응답:', botReply);
    appendMessage('bot', botReply);
    isProcessing = false;
  } catch (error) {
    appendMessage('bot', '오류가 발생했습니다.');
    isProcessing = false;
  }
});

userInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendButton.click();
  }
});

function appendMessage(sender, text) {
  const messageEl = document.createElement('div');
  messageEl.className = `message ${sender}`;
  messageEl.textContent = `${sender === 'user' ? '나' : '챗봇'}: ${text}`;
  chatWindow.appendChild(messageEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return messageEl;
}