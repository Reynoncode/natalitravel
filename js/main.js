// ─── NAVBAR ───────────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) navbar?.classList.add('scrolled');
  else navbar?.classList.remove('scrolled');
});

hamburger?.addEventListener('click', () => {
  mobileNav?.classList.toggle('open');
});

// ─── SEARCH TABS ───────────────────────────────────────────────────
document.querySelectorAll('.search-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.search-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(target)?.classList.add('active');
  });
});

// ─── AIRLINES DATA ───────────────────────────────────────────────────
const AIRLINES = [
  { name: 'AZAL', emoji: '🇦🇿', code: 'J2' },
  { name: 'Turkish Airlines', emoji: '🇹🇷', code: 'TK' },
  { name: 'flydubai', emoji: '🇦🇪', code: 'FZ' },
  { name: 'Pegasus', emoji: '🦅', code: 'PC' },
  { name: 'Qatar Airways', emoji: '🇶🇦', code: 'QR' },
  { name: 'Emirates', emoji: '🇦🇪', code: 'EK' },
  { name: 'Lufthansa', emoji: '🇩🇪', code: 'LH' },
  { name: 'Air Arabia', emoji: '🕌', code: 'G9' },
  { name: 'Wizz Air', emoji: '💜', code: 'W6' },
  { name: 'Azerkenar', emoji: '✈️', code: 'AZ' },
];

const DESTINATIONS = {
  'istanbul': { city: 'İstanbul', code: 'IST', country: 'Türkiyə', emoji: '🕌' },
  'dubai': { city: 'Dubai', code: 'DXB', country: 'BAƏ', emoji: '🏙' },
  'antalya': { city: 'Antalya', code: 'AYT', country: 'Türkiyə', emoji: '🏖' },
  'moscow': { city: 'Moskva', code: 'SVO', country: 'Rusiya', emoji: '🏛' },
  'london': { city: 'London', code: 'LHR', country: 'UK', emoji: '🎡' },
  'paris': { city: 'Paris', code: 'CDG', country: 'Fransa', emoji: '🗼' },
  'rome': { city: 'Roma', code: 'FCO', country: 'İtaliya', emoji: '🏟' },
  'doha': { city: 'Doha', code: 'DOH', country: 'Qətər', emoji: '🏟' },
  'frankfurt': { city: 'Frankfurt', code: 'FRA', country: 'Almaniya', emoji: '🏦' },
  'amsterdam': { city: 'Amsterdam', code: 'AMS', country: 'Niderland', emoji: '🌷' },
};

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function randomTime() {
  const h = String(randInt(6, 22)).padStart(2,'0');
  const m = ['00','15','30','45'][randInt(0,3)];
  return `${h}:${m}`;
}

function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total/60) % 24).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
}

function durationStr(mins) {
  return `${Math.floor(mins/60)}s ${mins%60}d`;
}

// ─── GENERATE FLIGHTS ───────────────────────────────────────────────────
function generateFlights(from, to, date, passengers = 1) {
  const count = randInt(5, 8);
  const results = [];
  const fromInfo = Object.values(DESTINATIONS).find(d =>
    d.city.toLowerCase().includes(from.toLowerCase()) ||
    d.code.toLowerCase() === from.toLowerCase()
  ) || { city: from.toUpperCase(), code: from.substring(0,3).toUpperCase() };

  const toInfo = Object.values(DESTINATIONS).find(d =>
    d.city.toLowerCase().includes(to.toLowerCase()) ||
    d.code.toLowerCase() === to.toLowerCase()
  ) || { city: to.toUpperCase(), code: to.substring(0,3).toUpperCase() };

  const basePrice = randInt(80, 400);

  for (let i = 0; i < count; i++) {
    const airline = AIRLINES[randInt(0, AIRLINES.length - 1)];
    const dep = randomTime();
    const duration = randInt(90, 420);
    const arr = addMinutes(dep, duration);
    const price = Math.round((basePrice + randInt(-30, 120)) * passengers);
    const stops = i === 0 ? 0 : randInt(0, 1);

    results.push({
      id: i,
      airline,
      from: fromInfo,
      to: toInfo,
      dep, arr,
      duration,
      stops,
      price,
      flightNo: `${airline.code}${randInt(100, 999)}`,
      class: ['İqtisadi', 'Biznes'][randInt(0,1)],
    });
  }

  return results.sort((a, b) => a.price - b.price);
}

// ─── GENERATE HOTELS ───────────────────────────────────────────────────
const HOTEL_NAMES = [
  'Grand Palace Hotel', 'Azure Sea Resort', 'City Center Suites',
  'Royal Garden Hotel', 'Sunrise Boutique', 'Luxury Crown Hotel',
  'Ocean View Resort', 'Golden Tulip', 'Park Inn', 'Hilton Garden Inn',
];

const HOTEL_FEATURES = ['WiFi', 'Hovuz', 'SPA', 'Parkovka', 'Restoran', 'Otaq xidməti', 'Kondisioner', 'Fitness'];

function generateHotels(destination, checkin, checkout, guests = 1) {
  const nights = Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / 86400000));
  const count = randInt(5, 9);
  const results = [];

  for (let i = 0; i < count; i++) {
    const stars = randInt(3, 5);
    const pricePerNight = randInt(40, 300) * guests;
    const features = [...HOTEL_FEATURES].sort(() => .5 - Math.random()).slice(0, randInt(3, 6));

    results.push({
      id: i,
      name: HOTEL_NAMES[i % HOTEL_NAMES.length],
      stars,
      destination,
      features,
      pricePerNight,
      totalPrice: pricePerNight * nights,
      nights,
      rating: (3.5 + Math.random() * 1.5).toFixed(1),
      emoji: ['🏨','🏩','🛎','🏰','🌴'][randInt(0,4)],
    });
  }

  return results.sort((a, b) => a.pricePerNight - b.pricePerNight);
}

// ─── RENDER FLIGHTS ───────────────────────────────────────────────────
function renderFlights(flights, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!flights.length) {
    container.innerHTML = `<div class="empty-state"><div class="icon">✈️</div><h3>Uçuş tapılmadı</h3><p>Başqa tarix və ya dəstinasiya cəhd edin</p></div>`;
    return;
  }

  container.innerHTML = flights.map(f => `
    <div class="result-card fade-in">
      <div class="flight-info">
        <div class="airline-logo">${f.airline.emoji}</div>
        <div class="flight-times">
          <div class="time-block">
            <div class="time">${f.dep}</div>
            <div class="city">${f.from.code}</div>
          </div>
          <div class="flight-line">
            <span class="duration">${durationStr(f.duration)}</span>
            <div class="line"></div>
            <span class="duration">${f.stops === 0 ? 'Birbaşa' : f.stops + ' dayanacaq'}</span>
          </div>
          <div class="time-block">
            <div class="time">${f.arr}</div>
            <div class="city">${f.to.code}</div>
          </div>
        </div>
        <div>
          <div class="flight-airline">${f.airline.name}</div>
          <div style="font-size:11px;color:var(--muted)">${f.flightNo} · ${f.class}</div>
        </div>
      </div>
      <div class="result-price">
        <span class="price-label">Qiymət / nəfər</span>
        <div class="price">$${f.price}</div>
        <button class="btn-sm" onclick="alert('Rezervasiya sistemi inteqrasiyası üçün müraciət edin!')">Seç</button>
      </div>
    </div>
  `).join('');
}

// ─── RENDER HOTELS ───────────────────────────────────────────────────
function renderHotels(hotels, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!hotels.length) {
    container.innerHTML = `<div class="empty-state"><div class="icon">🏨</div><h3>Otel tapılmadı</h3><p>Başqa dəstinasiya cəhd edin</p></div>`;
    return;
  }

  container.innerHTML = hotels.map(h => `
    <div class="hotel-card fade-in">
      <div class="hotel-img">${h.emoji}</div>
      <div class="hotel-body">
        <h3>${h.name}</h3>
        <div class="stars">${'★'.repeat(h.stars)}${'☆'.repeat(5-h.stars)}</div>
        <p>${h.destination} · ${h.nights} gecə · Reytinq: ${h.rating}/5</p>
        <div class="hotel-features">
          ${h.features.map(f => `<span class="hotel-feat">${f}</span>`).join('')}
        </div>
      </div>
      <div class="hotel-price-col">
        <div>
          <span style="font-size:11px;color:var(--muted);display:block">gecəlik</span>
          <span style="font-family:Syne,sans-serif;font-size:20px;font-weight:800;color:var(--primary)">$${h.pricePerNight}</span>
          <span style="font-size:11px;color:var(--muted);display:block">Cəmi: $${h.totalPrice}</span>
        </div>
        <button class="btn-sm" onclick="alert('Rezervasiya sistemi inteqrasiyası üçün müraciət edin!')">Rezerv et</button>
      </div>
    </div>
  `).join('');
}

// ─── COUNTER ANIMATION ───────────────────────────────────────────────────
function animateCount(el, end, suffix = '') {
  let current = 0;
  const step = end / 60;
  const timer = setInterval(() => {
    current = Math.min(current + step, end);
    el.textContent = Math.round(current).toLocaleString() + suffix;
    if (current >= end) clearInterval(timer);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        animateCount(el, +el.dataset.count, el.dataset.suffix || '');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelector('.stats-strip') && statsObserver.observe(document.querySelector('.stats-strip'));

// ─── TOAST ───────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:${type === 'success' ? 'var(--primary)' : '#333'};
    color:white;padding:14px 22px;border-radius:12px;
    font-size:14px;font-weight:500;
    box-shadow:0 8px 32px rgba(0,0,0,0.2);
    animation:fadeInUp .3s ease;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ─── INIT DATE DEFAULTS ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const weekLater = new Date(today); weekLater.setDate(today.getDate() + 8);

  document.querySelectorAll('input[type="date"]').forEach((inp, i) => {
    if (!inp.value) {
      if (inp.dataset.default === 'checkout' || i % 2 === 1) inp.value = fmt(weekLater);
      else inp.value = fmt(tomorrow);
      inp.min = fmt(today);
    }
  });
});
