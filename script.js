// ---------- Menu ----------
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('#nav-links');

toggle.addEventListener('click', () => {
  const isOpen = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
});

links.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Price calculator ----------
const sizeSelect = document.querySelector('#car-size');
const serviceSelect = document.querySelector('#service');
const totalText = document.querySelector('#total');
const bookLink = document.querySelector('#calc-whatsapp');

function updateTotal() {
  const size = Number(sizeSelect.value);
  const service = Number(serviceSelect.value);
  const total = Math.round((service * size) / 5) * 5;

  totalText.textContent = `AED ${total}`;

  const sizeName = sizeSelect.options[sizeSelect.selectedIndex].text;
  const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
  const message = `Hello, I want ${serviceName} for a ${sizeName}. Total: AED ${total}`;
  bookLink.href = `https://wa.me/971562625216?text=${encodeURIComponent(message)}`;
}

sizeSelect.addEventListener('change', updateTotal);
serviceSelect.addEventListener('change', updateTotal);
updateTotal();

// ---------- Booking form ----------
const form = document.querySelector('#booking-form');
const nameInput = document.querySelector('#name');
const carInput = document.querySelector('#car');
const bookService = document.querySelector('#book-service');
const dateInput = document.querySelector('#date');
const timeInput = document.querySelector('#time');
const statusText = document.querySelector('#form-status');

// Today's date in local time, so the date picker blocks past days
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
dateInput.min = today;

function setError(input, message) {
  document.querySelector(`#${input.id}-error`).textContent = message;
  input.classList.toggle('invalid', message !== '');
  return message === '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const car = carInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  const results = [
    setError(nameInput, name.length < 2 ? 'Please enter your name.' : ''),
    setError(carInput, car.length < 2 ? 'Please enter your car details.' : ''),
    setError(
      dateInput,
      date === '' ? 'Please choose a date.' : date < today ? 'Please choose today or a later date.' : ''
    ),
    setError(
      timeInput,
      time === '' ? 'Please choose a time.' : time < '08:00' || time > '20:00' ? 'We are open 8 AM to 8 PM.' : ''
    ),
  ];

  if (results.includes(false)) {
    statusText.textContent = '';
    return;
  }

  const message = [
    'Hello, I want to book a car wash:',
    `Name: ${name}`,
    `Car: ${car}`,
    `Service: ${bookService.value}`,
    `Date: ${date}`,
    `Time: ${time}`,
  ].join('\n');

  const url = `https://wa.me/971562625216?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');

  statusText.textContent = 'WhatsApp is opening. Press Send there to finish your booking request.';
  form.reset();
});

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    const isOpen = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', String(!isOpen));
    answer.hidden = isOpen;
  });
});

// ---------- Open now / Closed badge ----------
const OPEN_HOUR = 8;
const CLOSE_HOUR = 20;

function formatHour(hour) {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12} ${suffix}`;
}

function getDubaiHour() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dubai',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  return Number(parts.find((part) => part.type === 'hour').value);
}

const badge = document.querySelector('#open-badge');

function updateBadge() {
  const hour = getDubaiHour();
  const isOpen = hour >= OPEN_HOUR && hour < CLOSE_HOUR;

  badge.textContent = isOpen
    ? `Open now · until ${formatHour(CLOSE_HOUR)}`
    : `Closed now · opens ${formatHour(OPEN_HOUR)}`;

  badge.classList.toggle('open', isOpen);
  badge.classList.toggle('closed', !isOpen);
}

updateBadge();
setInterval(updateBadge, 60000);