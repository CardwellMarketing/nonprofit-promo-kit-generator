const form = document.getElementById('promo-form');
const output = document.getElementById('output');
const template = document.getElementById('output-template');
const resetButton = document.getElementById('reset-btn');

const toneGuides = {
  professional: {
    opener: 'Join us for an engaging and timely conversation.',
    cta: 'Reserve your spot today.'
  },
  warm: {
    opener: 'We would love for you to join us for this community-centered event.',
    cta: 'We hope you will register and join us.'
  },
  urgent: {
    opener: 'This is a timely opportunity to engage with leaders and peers.',
    cta: 'Register now to secure your place.'
  },
  friendly: {
    opener: 'Come be part of a meaningful conversation with fellow community members.',
    cta: 'Sign up today and invite a colleague.'
  },
  executive: {
    opener: 'This event convenes leaders for practical, high-impact insights.',
    cta: 'Confirm your attendance today.'
  },
  'cardwell-oano': {
    opener: 'Join a values-driven conversation centered on equity, impact, and community voice.',
    cta: 'Register today and help advance meaningful change together.'
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

function buildGuidance(eventContext) {
  const text = eventContext.toLowerCase();
  const guidance = {
    ctaStrength: 'standard',
    benefitFocus: false,
    donorFocus: false,
    urgencyBoost: false
  };

  if (/(maximum registration|max registration|sell out|fill seats|high attendance|boost turnout)/.test(text)) {
    guidance.ctaStrength = 'strong';
    guidance.urgencyBoost = true;
  }

  if (/(fundraising|donor|sponsor|giving|donation)/.test(text)) {
    guidance.donorFocus = true;
  }

  if (/(outcome|results|impact|takeaway|practical|skills|training)/.test(text)) {
    guidance.benefitFocus = true;
  }

  if (/(urgent|deadline|limited|last chance|final)/.test(text)) {
    guidance.urgencyBoost = true;
  }

  return guidance;
}

function composeCta(baseCta, guidance, registration) {
  if (guidance.ctaStrength === 'strong' || guidance.urgencyBoost) {
    return `Register now: ${registration}`;
  }
  return `${baseCta} Register here: ${registration}`;
}

function buildPromoKit(d) {
  const tone = toneGuides[d.tone] || toneGuides.professional;
  const guidance = buildGuidance(d.eventContext);
  const benefitLine = guidance.benefitFocus
    ? 'Participants will leave with practical insights they can apply immediately.'
    : 'Participants will gain practical insights for mission-driven impact.';
  const donorLine = guidance.donorFocus
    ? 'Your participation helps strengthen the broader community of supporters and partners behind this work.'
    : '';
  const ctaLine = composeCta(tone.cta, guidance, d.registration);

  return [
    {
      title: 'Email announcement',
      text: `Subject: You’re invited: ${d.title}\n\nDear ${d.audience},\n\n${tone.opener}\n\nPlease join us for ${d.title} on ${d.date} at ${d.time} (${d.location}).\n\nThis event will explore ${d.topic} with ${d.speakers}. ${benefitLine}\n\n${donorLine}\n\n${ctaLine}\n\nWith appreciation,\n[Your Nonprofit Name]`
    },
    {
      title: 'LinkedIn post',
      text: `${tone.opener}\n\n${d.title}\n📅 ${d.date}\n⏰ ${d.time}\n📍 ${d.location}\n\nJoin ${d.speakers} for a conversation on ${d.topic} designed for ${d.audience}. ${benefitLine}\n\n${composeCta('Save your spot.', guidance, d.registration)}\n\n#NonprofitLeadership #CommunityImpact #ProfessionalDevelopment`
    },
    {
      title: 'Facebook post',
      text: `You’re invited! 🎉\n\n${d.title} is happening on ${d.date} at ${d.time} at ${d.location}.\n\nWe’ll dive into ${d.topic} with ${d.speakers} and bring together ${d.audience}. ${benefitLine}\n\n${donorLine}\n\n${composeCta('Save your seat today.', guidance, d.registration)}\n\nPlease share with someone who should join us.`
    },
    {
      title: 'Website blurb',
      text: `${d.title} brings together ${d.audience} on ${d.date} at ${d.time} at ${d.location} for a focused discussion on ${d.topic}. Featuring ${d.speakers}, this session offers actionable insights and real-world perspective for mission-driven organizations. ${benefitLine} ${composeCta('Learn more and sign up.', guidance, d.registration)}`
    },
    {
      title: 'Reminder email',
      text: `Subject: Reminder: ${d.title} is almost here\n\nHello ${d.audience},\n\nA quick reminder that ${d.title} takes place on ${d.date} at ${d.time} (${d.location}).\n\n${d.speakers} will lead the discussion on ${d.topic}, and we’re excited to have you with us.\n\n${composeCta('If you have not registered yet, there is still time.', guidance, d.registration)}\n\nSee you soon,\n[Your Nonprofit Name]`
    },
    {
      title: 'Speaker introduction',
      text: `Welcome, and thank you for joining us for ${d.title}.\n\nToday’s conversation focuses on ${d.topic} and is designed with ${d.audience} in mind.\n\nWe are honored to be joined by ${d.speakers}, who bring valuable insight and practical experience to this discussion.\n\nLet’s begin.`
    }
  ];
}

function renderSections(sections) {
  output.innerHTML = '';

  sections.forEach((section) => {
    const node = template.content.cloneNode(true);
    const title = node.querySelector('h3');
    const text = node.querySelector('.output-text');
    const copyButton = node.querySelector('.copy-btn');

    title.textContent = section.title;
    text.textContent = section.text.replace(/\n\n\n+/g, '\n\n');

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
