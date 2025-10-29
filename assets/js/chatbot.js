'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const icon = document.getElementById('chatbot-icon');
  const container = document.getElementById('chatbot-container');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const inputEl = document.getElementById('chatbot-input');
  const messagesEl = document.getElementById('chatbot-messages');
  const micBtn = document.getElementById('chatbot-mic');

  // Voice selection (prefer female)
  let selectedVoice = null;
  const femaleHints = ['serena','samantha','maria','victoria','kendra','kathy','amy','jane','olivia','amelia','arielle','megan','claire','zira','emma','ava','female','girl'];
  function pickFemale(voices) {
    const low = s => (s || '').toLowerCase();
    let v = voices.find(vo => low(vo.name).includes('serena'));
    if (v) return v;
    v = voices.find(vo => femaleHints.some(h => low(vo.name).includes(h) || low(vo.voiceURI).includes(h)));
    if (v) return v;
    v = voices.find(vo => vo.lang?.toLowerCase().startsWith('en') && !/male|man/i.test(vo.name));
    return v || voices[0] || null;
  }
  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices() || [];
    if (voices.length) selectedVoice = pickFemale(voices);
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = selectedVoice?.lang || 'en-US';
      u.rate = 1.0; u.pitch = 1.15;
      if (selectedVoice) u.voice = selectedVoice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  }

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-message ${role === 'user' ? 'user' : 'bot'}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function openChat() {
    container.classList.remove('hidden');
    container.setAttribute('aria-hidden', 'false');
    icon.style.display = 'none';
    if (!messagesEl.dataset.greeted) {
      messagesEl.dataset.greeted = '1';
      const greet = 'Hello — I am your assistant. Type or use voice.';
      appendMessage('bot', greet);
      speak(greet);
    }
  }
  function closeChat() {
    container.classList.add('hidden');
    container.setAttribute('aria-hidden', 'true');
    icon.style.display = 'grid';
  }

  icon?.addEventListener('click', openChat);
  closeBtn?.addEventListener('click', closeChat);

  sendBtn?.addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (!text) return;
    appendMessage('user', text);
    inputEl.value = '';
    getBotResponse(text);
  });
  inputEl?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendBtn.click(); });

  async function getBotResponse(userText) {
    // Try server proxy first (optional)
    try {
      const resp = await fetch('/api/openai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });
      if (resp.ok) {
        const data = await resp.json();
        const bot = data?.reply || 'Sorry, I could not fetch a response.';
        appendMessage('bot', bot);
        speak(bot);
        return;
      }
    } catch {}

    // Fallback rules + actions
    const l = userText.toLowerCase();
    let reply = "Sorry, I don't understand. Try: 'open youtube', 'open google', or ask about contact.";
    if (l.includes('open youtube')) reply = 'Opening YouTube for you.';
    else if (l.includes('open google')) reply = 'Opening Google.';
    else if (l.includes('open facebook')) reply = 'Opening Facebook.';
    else if (l.includes('open instagram')) reply = 'Opening Instagram.';
    else if (l.includes('hello') || l.includes('hi')) reply = 'Hello! How can I help you today?';
    else if (l.includes('contact') || l.includes('email')) reply = 'Email: omiruonline@gmail.com. WhatsApp: 0772602443.';

    appendMessage('bot', reply);
    speak(reply);

    if (l.includes('open youtube')) window.open('https://www.youtube.com', '_blank');
    if (l.includes('open google')) window.open('https://www.google.com', '_blank');
    if (l.includes('open facebook')) window.open('https://www.facebook.com', '_blank');
    if (l.includes('open instagram')) window.open('https://www.instagram.com', '_blank');
  }

  // Speech recognition
  let recognition = null, recognizing = false;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      appendMessage('user', text);
      getBotResponse(text);
    };
    recognition.onerror = () => {
      try { recognition.stop(); } catch {}
      recognizing = false;
      micBtn?.classList.remove('listening');
      micBtn && (micBtn.title = 'Voice input');
    };
    recognition.onend = () => {
      recognizing = false;
      micBtn?.classList.remove('listening');
      micBtn && (micBtn.title = 'Voice input');
    };
  } else {
    micBtn && (micBtn.style.opacity = '0.45', micBtn.title = 'Voice not supported');
  }

  micBtn?.addEventListener('click', () => {
    if (!recognition) return;
    if (!recognizing) {
      try {
        recognition.start();
        recognizing = true;
        micBtn.classList.add('listening');
        micBtn.title = 'Listening... click to stop';
        speak('Listening...');
      } catch {}
    } else {
      recognition.stop();
      recognizing = false;
      micBtn.classList.remove('listening');
      micBtn.title = 'Voice input';
    }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !container.classList.contains('hidden')) closeChat(); });

  // debug
  window.__chatbot = { openChat, closeChat };
});

// Simple chat widget behavior (open/close, send, voice input)
(() => {
  const icon = document.getElementById('chatbot-icon');
  const container = document.getElementById('chatbot-container');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  const micBtn = document.getElementById('chatbot-mic');

  if (!icon || !container || !sendBtn || !input || !messages) return;

  const openChat = () => {
    container.classList.remove('hidden');
    container.setAttribute('aria-hidden', 'false');
    setTimeout(() => input?.focus(), 0);
  };

  const closeChat = () => {
    container.classList.add('hidden');
    container.setAttribute('aria-hidden', 'true');
    icon?.focus();
  };

  const scrollToBottom = () => {
    messages.scrollTop = messages.scrollHeight;
  };

  const addMsg = (text, role = 'bot') => {
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    div.textContent = text;
    messages.appendChild(div);
    scrollToBottom();
  };

  const handleSend = () => {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    // Simple bot placeholder
    setTimeout(() => addMsg('Thanks! I’m a demo assistant here. How can I help?'), 300);
  };

  // Open/close handlers
  icon.addEventListener('click', openChat);
  closeBtn?.addEventListener('click', closeChat);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !container.classList.contains('hidden')) closeChat();
  });

  // Send handlers
  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Voice input (Web Speech API if available)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognizing = false;
  let recognizer;

  if (SpeechRecognition) {
    recognizer = new SpeechRecognition();
    recognizer.lang = 'en-US';
    recognizer.interimResults = false;
    recognizer.maxAlternatives = 1;

    recognizer.onstart = () => {
      recognizing = true;
      micBtn.textContent = '🛑';
      micBtn.setAttribute('aria-label', 'Stop voice input');
      addMsg('Listening...', 'bot');
    };

    recognizer.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join(' ');
      input.value = transcript;
      handleSend();
    };

    const endListening = () => {
      recognizing = false;
      micBtn.textContent = '🎙️';
      micBtn.setAttribute('aria-label', 'Start voice input');
    };

    recognizer.onerror = () => endListening();
    recognizer.onend = () => endListening();

    micBtn.addEventListener('click', () => {
      if (!recognizing) {
        try { recognizer.start(); } catch {}
      } else {
        try { recognizer.stop(); } catch {}
      }
    });
  } else {
    // Fallback when no speech recognition
    micBtn.addEventListener('click', () => {
      addMsg('Voice input is not supported in this browser.', 'bot');
    });
  }
})();