const form = document.getElementById('promo-form');
const output = document.getElementById('output');
const template = document.getElementById('output-template');

const toneGuides = {
  professional: 'clear, confident, and mission-focused',
  warm: 'inviting, heartfelt, and community-centered',
  urgent: 'high-priority, action-driven, and time-sensitive',
  friendly: 'conversational, upbeat, and approachable',
  executive: 'strategic, high-level, and leadership-oriented',
  'cardwell-oano': 'warm, clear, practical, professional, and mission-focused'
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
    context: data.get('context').trim(),
    tone: data.get('tone')
  };

  renderSections(buildPromoKit(details));
});

form.addEventListener('reset', () => {
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
  const toneLine = toneGuides[d.tone] || toneGuides.professional;
  const contextLine = d.context ? `\n\nAdditional context: ${d.context}` : '';

  return [
    {
      title: 'Email announcement',
      text: `Subject: Join us for ${d.title}\n\nDear ${d.audience},\n\nYou are invited to ${d.title} on ${d.date} at ${d.time}. This event will take place at ${d.location}.\n\nWe will explore ${d.topic} with insights from ${d.speakers}. The message should feel ${toneLine}.${contextLine}\n\nPlease register here: ${d.registration}\n\nWe hope to see you there,\n[Your Nonprofit Name]`
    },
    {
      title: 'LinkedIn post',
      text: `We're excited to invite ${d.audience} to ${d.title}.\n\n📅 ${d.date}\n⏰ ${d.time}\n📍 ${d.location}\n\nThis session focuses on ${d.topic}, featuring ${d.speakers}.${contextLine}\n\nRegister: ${d.registration}\n\n#NonprofitLeadership #CommunityImpact #ProfessionalDevelopment`
    },
    {
      title: 'Facebook post',
      text: `Big news, community! 🎉\n\n${d.title} is happening on ${d.date} at ${d.time}. Join us at ${d.location} for a meaningful conversation on ${d.topic}.\n\nFeaturing: ${d.speakers}${d.context ? `\n\nWhy this matters: ${d.context}` : ''}\n\nSave your spot now: ${d.registration}\n\nTag someone in your network who should attend!`
    },
    {
      title: 'Website blurb',
      text: `${d.title} brings together ${d.audience} for a timely discussion on ${d.topic}. Join us on ${d.date} at ${d.time} at ${d.location}. Hear from ${d.speakers} and walk away with practical next steps for mission-driven impact.${d.context ? ` ${d.context}` : ''} Register today: ${d.registration}`
    },
    {
      title: 'Reminder email',
      text: `Subject: Reminder: ${d.title} is coming up\n\nHello ${d.audience},\n\nA quick reminder that ${d.title} is happening on ${d.date} at ${d.time}.\n\nLocation/Access: ${d.location}\nFeatured speakers: ${d.speakers}${d.context ? `\nEvent context: ${d.context}` : ''}\n\nIf you have not registered yet, you can still join us here: ${d.registration}\n\nLooking forward to connecting with you,\n[Your Nonprofit Name]`
    },
    {
      title: 'Speaker introduction',
      text: `Welcome everyone, and thank you for joining ${d.title}.\n\nToday, we are focusing on ${d.topic}. We are honored to be joined by ${d.speakers}, who bring valuable perspective for ${d.audience}.${d.context ? `\n\nContext for this event: ${d.context}` : ''}\n\nPlease join me in welcoming our speaker(s).`
    }
  ];
}

function renderSections(sections) {
  output.innerHTML = '';

  sections.forEach((section) => {
    const node = template.content.cloneNode(true);
    const title = node.querySelector('h3');
    const content = node.querySelector('.content');
    const copyButton = node.querySelector('.copy-btn');

    title.textContent = section.title;
    content.textContent = section.text;

    copyButton.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        await navigator.clipboard.writeText(section.text);
        copyButton.textContent = 'Copied!';
        copyButton.classList.add('copied');
      } catch (error) {
        copyButton.textContent = 'Copy failed';
      }
      setTimeout(() => {
        copyButton.textContent = 'Copy';
        copyButton.classList.remove('copied');
      }, 1200);
    });

    output.appendChild(node);
  });
}
