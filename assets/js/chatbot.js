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

(() => {
  const icon = document.getElementById('chatbot-icon');
  const panel = document.getElementById('chatbot-container');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  const micBtn = document.getElementById('chatbot-mic');

  const open = () => {
    panel.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'false');
    setTimeout(() => input?.focus(), 0);
  };
  const close = () => {
    panel.classList.add('hidden');
    panel.setAttribute('aria-hidden', 'true');
  };

  const appendMsg = (text, who = 'user') => {
    if (!text.trim()) return;
    const div = document.createElement('div');
    div.className = `chat-message ${who}`;
    div.textContent = text.trim();
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  };

  const botReply = (text) => {
    const reply = `Thanks! I received: "${text.trim()}"`;
    setTimeout(() => appendMsg(reply, 'bot'), 300);
  };

  const send = () => {
    const text = input.value || '';
    appendMsg(text, 'user');
    input.value = '';
    botReply(text);
  };

  icon?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);

  sendBtn?.addEventListener('click', send);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Voice input (best-effort)
  let recognizing = false;
  let recognition;
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.addEventListener('result', (e) => {
        const transcript = e.results[0][0].transcript;
        input.value = transcript;
        send();
      });
      recognition.addEventListener('end', () => {
        recognizing = false;
        micBtn.textContent = '🎙️';
      });
    }
  } catch {}

  micBtn?.addEventListener('click', () => {
    if (!recognition) {
      appendMsg('Voice not supported in this browser.', 'bot');
      return;
    }
    if (!recognizing) {
      recognizing = true;
      micBtn.textContent = '⏹️';
      recognition.start();
    } else {
      recognition.stop();
    }
  });
})();