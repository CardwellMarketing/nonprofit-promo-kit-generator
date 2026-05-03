const form = document.getElementById('promo-form');
const output = document.getElementById('output');
const template = document.getElementById('output-template');
const resetButton = document.getElementById('reset-btn');

const toneVoice = {
  professional: {
    opener: 'We are pleased to invite you to',
    closer: 'Thank you for your continued commitment to our community.'
  },
  warm: {
    opener: 'We would love for you to join us for',
    closer: 'We are grateful to be in this work with you.'
  },
  urgent: {
    opener: 'Now is the time to join us for',
    closer: 'Please take a moment to register and share this with your network.'
  },
  friendly: {
    opener: 'We are excited to welcome you to',
    closer: 'We cannot wait to connect with you there.'
  },
  executive: {
    opener: 'You are invited to participate in',
    closer: 'We look forward to advancing this work together.'
  },
  'cardwell-oano': {
    opener: 'Join us for',
    closer: 'Together, we can turn shared values into meaningful action.'
  }
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const details = {
    title: data.get('eventTitle').trim(),
    date: formatDate(data.get('eventDate')),
    time: formatTime(data.get('eventTime')),
    location: data.get('location').trim(),
    audience: data.get('audience').trim(),
    speakers: data.get('speakers').trim(),
    topic: data.get('topic').trim(),
    registration: data.get('registration').trim(),
    eventContext: data.get('eventContext').trim(),
    tone: data.get('tone')
  };

  const sections = buildPromoKit(details);
  renderSections(sections);
});

resetButton.addEventListener('click', () => {
  output.innerHTML = '';
});

function formatDate(rawDate) {
  const date = new Date(`${rawDate}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function formatTime(rawTime) {
  const [hour, minute] = rawTime.split(':');
  const date = new Date();
  date.setHours(Number(hour), Number(minute), 0);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

function buildPromoKit(d) {
  const voice = toneVoice[d.tone] || toneVoice.professional;
  const contextPhrase = buildContextPhrase(d.eventContext);

  return [
    {
      title: 'Email announcement',
      text: `Subject: Join us for ${d.title}\n\nDear ${d.audience},\n\n${voice.opener} ${d.title} on ${d.date} at ${d.time}. This event will take place at ${d.location}.\n\nWe will explore ${d.topic} with insights from ${d.speakers}.${contextPhrase ? ` ${contextPhrase}` : ''}\n\nPlease register here: ${d.registration}\n\n${voice.closer}\n[Your Nonprofit Name]`
    },
    {
      title: 'LinkedIn post',
      text: `${voice.opener} ${d.title}.\n\n📅 ${d.date}\n⏰ ${d.time}\n📍 ${d.location}\n\nThis session focuses on ${d.topic}, featuring ${d.speakers}.${contextPhrase ? ` ${contextPhrase}` : ''}\n\nRegister: ${d.registration}\n\n${voice.closer}\n\n#NonprofitLeadership #CommunityImpact #ProfessionalDevelopment`
    },
    {
      title: 'Facebook post',
      text: `Big news, community! 🎉\n\n${voice.opener} ${d.title} on ${d.date} at ${d.time}. Join us at ${d.location} for a meaningful conversation on ${d.topic}.\n\nFeaturing: ${d.speakers}${contextPhrase ? `\n\n${contextPhrase}` : ''}\n\nSave your spot now: ${d.registration}\n\n${voice.closer}`
    },
    {
      title: 'Website blurb',
      text: `${d.title} brings together ${d.audience} for a timely discussion on ${d.topic}. ${voice.opener} ${d.title} on ${d.date} at ${d.time} at ${d.location}. Hear from ${d.speakers} and walk away with practical next steps for mission-driven impact.${contextPhrase ? ` ${contextPhrase}` : ''} ${voice.closer} Register today: ${d.registration}`
    },
    {
      title: 'Reminder email',
      text: `Subject: Reminder: ${d.title} is coming up\n\nHello ${d.audience},\n\n${voice.opener} ${d.title} on ${d.date} at ${d.time}.\n\nLocation/Access: ${d.location}\nFeatured speakers: ${d.speakers}${contextPhrase ? `\n\n${contextPhrase}` : ''}\n\nIf you have not registered yet, you can still join us here: ${d.registration}\n\n${voice.closer}\n[Your Nonprofit Name]`
    },
    {
      title: 'Speaker introduction',
      text: `Welcome everyone, and thank you for joining ${d.title}.\n\n${voice.opener} ${d.title}. Today, we are focusing on ${d.topic}. We are honored to be joined by ${d.speakers}, who bring valuable perspective for ${d.audience}.${contextPhrase ? ` ${contextPhrase}` : ''}\n\n${voice.closer}`
    }
  ];
}


function buildContextPhrase(rawContext) {
  if (!rawContext) {
    return '';
  }

  const normalized = rawContext
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .filter((word) => !['with', 'from', 'that', 'this', 'your', 'about', 'into', 'have', 'will', 'their', 'they', 'them', 'event', 'details'].includes(word));

  const themes = [...new Set(normalized)].slice(0, 3);

  if (!themes.length) {
    return '';
  }

  return `This conversation connects directly to ${themes[0]} in our community.`;
}

function renderSections(sections) {
  output.innerHTML = '';

  sections.forEach((section) => {
    const node = template.content.cloneNode(true);
    const title = node.querySelector('h3');
    const text = node.querySelector('.output-text');
    const copyButton = node.querySelector('.copy-btn');

    title.textContent = section.title;
    text.textContent = section.text;

    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(section.text);
      copyButton.textContent = 'Copied!';
      copyButton.classList.add('copied');
      setTimeout(() => {
        copyButton.textContent = 'Copy';
        copyButton.classList.remove('copied');
      }, 1200);
    });

    output.appendChild(node);
  });
}
