const form = document.getElementById('promo-form');
const output = document.getElementById('output');
const template = document.getElementById('output-template');
const resetButton = document.getElementById('reset-btn');

const toneVoice = {
  professional: {
    opener: "We're proud to invite you to a focused conversation",
    closer: 'Join us as we move this work forward together.'
  },
  warm: {
    opener: "We'd love to welcome you into a heartfelt gathering",
    closer: "We can't wait to share this time with you and our community."
  },
  urgent: {
    opener: "We're reaching out with an urgent invitation to take action together",
    closer: 'Please make plans to join us and help drive timely impact.'
  },
  friendly: {
    opener: "We're excited to welcome you to a conversation with neighbors and peers",
    closer: "We'd love to have you there."
  },
  executive: {
    opener: "You're invited to a strategic discussion designed for leadership",
    closer: 'Your perspective will strengthen this shared work.'
  },
  'cardwell-oano': {
    opener: "Join us for a values-driven conversation centered on equity and lived experience",
    closer: 'Together, we can turn insight into collective action.'
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
  const ctx = contextPhrase ? ` ${contextPhrase}` : '';

  return [
    {
      title: 'Email announcement',
      text: `Subject: Join us for ${d.title}

Dear ${d.audience},

${voice.opener} on ${d.date} at ${d.time}, hosted at ${d.location}.

We will explore ${d.topic} with insights from ${d.speakers}.${ctx}

${voice.closer}

Register here: ${d.registration}

Warmly,
[Your Nonprofit Name]`
    },
    {
      title: 'LinkedIn post',
      text: `${voice.opener} for ${d.audience}.

${d.title}
📅 ${d.date}
⏰ ${d.time}
📍 ${d.location}

We will focus on ${d.topic} with perspectives from ${d.speakers}.${ctx}

${voice.closer}

Register: ${d.registration}

#NonprofitLeadership #CommunityImpact #ProfessionalDevelopment`
    },
    {
      title: 'Facebook post',
      text: `Big news, community! 🎉

${voice.opener} as part of ${d.title} on ${d.date} at ${d.time}, happening at ${d.location}.

We will dig into ${d.topic} with ${d.speakers}.${ctx}

${voice.closer}

Save your spot now: ${d.registration}

Tag someone in your network who should attend!`
    },
    {
      title: 'Website blurb',
      text: `${d.title} brings together ${d.audience} on ${d.date} at ${d.time} at ${d.location}. ${voice.opener}, with a timely focus on ${d.topic} and insights from ${d.speakers}.${ctx} ${voice.closer} Register today: ${d.registration}`
    },
    {
      title: 'Reminder email',
      text: `Subject: Reminder: ${d.title} is coming up

Hello ${d.audience},

This is a quick reminder that ${d.title} takes place on ${d.date} at ${d.time}.

Location/Access: ${d.location}
Featured speakers: ${d.speakers}

${voice.opener} with a focus on ${d.topic}.${ctx}

${voice.closer}

If you have not registered yet, you can still join us here: ${d.registration}

Looking forward to connecting with you,
[Your Nonprofit Name]`
    },
    {
      title: 'Speaker introduction',
      text: `Welcome everyone, and thank you for joining ${d.title}.

${voice.opener}. Today, we are focusing on ${d.topic}. We are honored to be joined by ${d.speakers}, who bring valuable perspective for ${d.audience}.${ctx}

${voice.closer}`
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

  if (themes.length === 1) {
    return `Expect a thoughtful look at ${themes[0]}.`;
  }

  if (themes.length === 2) {
    return `Expect a thoughtful look at ${themes[0]} and ${themes[1]}.`;
  }

  return `Expect a thoughtful look at ${themes[0]}, ${themes[1]}, and ${themes[2]}.`;
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
