'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const STATIC_ROOT = __dirname;

app.use(express.static(STATIC_ROOT, {
  extensions: ['html']
}));

function buildFallbackReply(input) {
  const text = String(input || '').toLowerCase();

  if (!text.trim()) {
    return 'I can help with portfolio details, services, skills, education, and contact information.';
  }

  if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(text)) {
    return 'Hello. How can I help you today?';
  }

  if (/\b(contact|email|phone|number|whatsapp|reach)\b/.test(text)) {
    return 'You can reach Omiru at omiruonline@gmail.com or 0772602443.';
  }

  if (/\b(where|location|based|from)\b/.test(text)) {
    return 'Omiru is based in Chilaw, Puttalam, Sri Lanka.';
  }

  if (/\b(skill|skills|stack|technology|technologies)\b/.test(text)) {
    return 'Core skills include HTML, CSS, JavaScript, TypeScript, React, Vue, Angular, Firebase, Bootstrap, Git, Photoshop, and Adobe XD.';
  }

  if (/\b(service|services|offer|do you do|work)\b/.test(text)) {
    return 'Main services include web and app development, UI/UX design, game development, and videography with 3D animation.';
  }

  if (/\b(education|qualification|certification|study|school|college|university)\b/.test(text)) {
    return 'Education includes a B.Sc. in Data Science and a Higher Diploma in Computer Engineering, plus multiple certifications.';
  }

  if (/\b(portfolio|project|projects|recent work|news|events)\b/.test(text)) {
    return 'The portfolio highlights recent cybersecurity, development, and multimedia projects.';
  }

  if (/\b(thank|thanks)\b/.test(text)) {
    return 'You are welcome.';
  }

  if (/\b(hire|available)\b/.test(text)) {
    return 'Yes, Omiru is available for selected freelance and collaboration work.';
  }

  return 'I can help with services, skills, education, portfolio details, and contact information. Ask me anything related to the site.';
}

app.post('/api/openai', (req, res) => {
  const message = req.body?.message || req.body?.prompt || '';
  const reply = buildFallbackReply(message);
  res.json({ reply });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(STATIC_ROOT, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
