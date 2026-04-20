const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const quoteForm = document.querySelector('#quote-form');

if (quoteForm) {
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const name = String(formData.get('name') || '').trim();
    const vehicle = String(formData.get('vehicle') || '').trim();
    const area = String(formData.get('area') || '').trim();
    const notes = String(formData.get('notes') || '').trim();

    const message = [
      'Hello Fix My Windscreen SA, I need a quote.',
      `Name: ${name}`,
      `Vehicle: ${vehicle}`,
      `Area: ${area}`,
      `Damage details: ${notes}`,
    ].join('\n');

    const url = `https://wa.me/27691589252?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    quoteForm.reset();
  });
}

const chatbotToggle = document.querySelector('#chatbot-toggle');
const chatbotPanel = document.querySelector('#chatbot-panel');
const chatbotMessages = document.querySelector('#chatbot-messages');
const chatbotForm = document.querySelector('#chatbot-form');
const chatbotInput = document.querySelector('#chatbot-input');
const quickActionButtons = document.querySelectorAll('.chatbot-quick-actions button');

const botReplyMap = [
  {
    match: /price|cost|quote|how much|pricing/i,
    text: 'Pricing depends on vehicle model and glass type. Share your make/model and area in our quote form, or WhatsApp 069 158 9252 for a quick estimate.',
  },
  {
    match: /area|location|where|midrand|johannesburg|pretoria/i,
    text: 'We provide mobile service in Midrand, Johannesburg, and Pretoria. For nearby areas, message us and we will confirm availability.',
  },
  {
    match: /time|how long|turnaround|today|urgent/i,
    text: 'We aim for fast same-day or next available service depending on stock and location. We are always open for enquiries.',
  },
  {
    match: /open|hours|available|weekend/i,
    text: 'Our page indicates we are always open for enquiries. You can call or WhatsApp anytime on 069 158 9252.',
  },
  {
    match: /contact|phone|call|whatsapp|number/i,
    text: 'You can call 069 158 9252 or WhatsApp us directly. Use the floating WhatsApp button for a quick chat.',
  },
];

const fallbackReply =
  'Thanks for your message. For a precise answer, please share your car model and location, and we will assist quickly on WhatsApp: 069 158 9252.';

function appendChatMessage(sender, text) {
  if (!chatbotMessages) {
    return;
  }
  const message = document.createElement('p');
  message.className = `chat-message ${sender}`;
  message.textContent = text;
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getBotResponse(question) {
  const found = botReplyMap.find((entry) => entry.match.test(question));
  return found ? found.text : fallbackReply;
}

if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener('click', () => {
    const isOpening = chatbotPanel.hasAttribute('hidden');
    if (isOpening) {
      chatbotPanel.removeAttribute('hidden');
    } else {
      chatbotPanel.setAttribute('hidden', '');
    }
    chatbotToggle.setAttribute('aria-expanded', String(isOpening));

    if (isOpening && chatbotMessages && chatbotMessages.childElementCount === 0) {
      appendChatMessage('bot', 'Hello, welcome to Fix My Windscreen SA. Ask me about prices, service areas, turnaround time, or contact details.');
    }
  });
}

if (chatbotForm && chatbotInput) {
  chatbotForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = chatbotInput.value.trim();
    if (!question) {
      return;
    }

    appendChatMessage('user', question);
    appendChatMessage('bot', getBotResponse(question));
    chatbotInput.value = '';
    chatbotInput.focus();
  });
}

quickActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const topic = button.dataset.question || '';
    appendChatMessage('user', button.textContent || 'Question');
    appendChatMessage('bot', getBotResponse(topic));
  });
});
