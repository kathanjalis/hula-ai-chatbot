const chatMessages = document.getElementById('chat-messages');
const welcomeScreen = document.getElementById('welcome-screen');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', handleUserMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserMessage(); });

async function handleUserMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    // 1. First interaction: Hide Welcome, Show Chat
    if (welcomeScreen.style.display !== "none") {
        welcomeScreen.style.display = "none";
        chatMessages.style.display = "flex";
    }

    addMessage(message, 'user');
    userInput.value = '';
    showTypingIndicator();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        removeTypingIndicator();

        if (data.reply) {
            addMessage(data.reply, 'bot');
        }
    } catch (error) {
        removeTypingIndicator();
        addMessage("Connection error. Ensure Vercel is set up.", 'bot');
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    
    // Parse Markdown for the bot, keep text simple for the user
    const formattedText = (sender === 'bot') ? marked.parse(text) : text;

    if (sender === 'user') {
        messageDiv.innerHTML = `<div class="text">${formattedText}</div>`;
    } else {
        messageDiv.innerHTML = `
            <div class="avatar" style="background: #3b82f6;"><i class="fas fa-robot"></i></div>
            <div class="text">${formattedText}</div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message bot-message';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
        <div class="avatar" style="background: #444;"><i class="fas fa-ellipsis-h"></i></div>
        <div style="color: #b4b4b4; font-style: italic;">Hula AI is thinking...</div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}