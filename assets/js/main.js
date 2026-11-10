/* ==========================================================================
   TROODON PARK HOTEL — MAIN INTERACTIONS & LUXURY MAXIMALIST LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileDrawer();
  initSousaLiveWidget();
  initCursorBead();
  initAmbientSound();
  initScrollReveals();
});

/* 1. Header scroll state */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* 2. Mobile Drawer Navigation */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.drawer-close');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* 3. Live Sousa, Paraíba Info Widget (Clock & Weather) */
function initSousaLiveWidget() {
  const clockEl = document.getElementById('liveSousaClock');
  const tempEl = document.getElementById('liveSousaTemp');

  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    // Sousa-PB is UTC-3 (America/Fortaleza or Sao_Paulo)
    const options = {
      timeZone: 'America/Fortaleza',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    clockEl.textContent = new Intl.DateTimeFormat('pt-BR', options).format(now);
  }

  updateClock();
  setInterval(updateClock, 1000);

  // Weather simulation for Sousa-PB (tropical semi-arid warm climate)
  if (tempEl) {
    const hours = new Date().getHours();
    let temp = 31;
    if (hours >= 11 && hours <= 16) temp = 34;
    else if (hours >= 19 || hours <= 6) temp = 26;
    tempEl.textContent = `${temp}°C Ensolarado`;
  }
}

/* 4. Luxury 3D Cursor Follower */
function initCursorBead() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on mobile touch

  const bead = document.createElement('div');
  bead.className = 'cursor-bead';
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';

  document.body.appendChild(bead);
  document.body.appendChild(dot);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let beadX = mouseX;
  let beadY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function render() {
    beadX += (mouseX - beadX) * 0.15;
    beadY += (mouseY - beadY) * 0.15;
    bead.style.transform = `translate3d(${beadX}px, ${beadY}px, 0)`;
    requestAnimationFrame(render);
  }
  render();

  const interactiveElements = document.querySelectorAll('a, button, input, select, .card-3d, .seal-troodon-3d');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* 5. Web Audio API Ambient Luxury Sound Synthesis */
let audioCtx = null;
let soundActive = false;

function playLuxuryChime(freq = 528, duration = 1.2) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.debug('Audio not available yet', err);
  }
}

function initAmbientSound() {
  const widget = document.getElementById('soundAmbientWidget');
  if (!widget) return;

  const waveBars = widget.querySelector('.sound-waves');

  widget.addEventListener('click', () => {
    soundActive = !soundActive;
    if (soundActive) {
      if (waveBars) waveBars.classList.remove('paused');
      playLuxuryChime(440, 1.5);
      widget.setAttribute('title', 'Som Ambiente Ativo');
    } else {
      if (waveBars) waveBars.classList.add('paused');
      widget.setAttribute('title', 'Som Ambiente Desativado');
    }
  });

  // Attach soft tactile chime to buttons
  document.querySelectorAll('.btn, .seal-troodon-3d, .nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      if (soundActive) {
        playLuxuryChime(660, 0.6);
      }
    });
  });
}

/* 6. Intersection Observer Reveals */
function initScrollReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/* 7. Interactive 3D Room Visualizer */
const ROOM_VISUALIZER_DATA = {
  standard: {
    title: 'Quarto Standard Duplo',
    desc: 'Projetado para viagens dinâmicas e estadias com máximo custo-benefício. Possui bancada de trabalho, climatização silenciosa e todo o conforto necessário no centro de Sousa.',
    area: '24 m²',
    capacity: 'Até 2 hóspedes',
    bed: '1 Cama de Casal ou 2 Solteiro',
    breakfast: 'Incluso diariamente',
    price: 'Média de R$ 180 a R$ 260',
    img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'
  },
  luxo: {
    title: 'Quarto Luxo Premium',
    desc: 'Acomodação nobre com vista panorâmica da cidade, cama king-size, enxoval de fios nobres, frigobar completo e isolamento acústico superior para o descanso perfeito.',
    area: '38 m²',
    capacity: 'Até 3 hóspedes',
    bed: 'Cama King Size',
    breakfast: 'Incluso com serviço à la carte',
    price: 'A partir de R$ 340',
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
  },
  flat: {
    title: 'Flat Mobiliado Completo',
    desc: 'Apartamento privativo projetado para estadias prolongadas (long stay) de profissionais ou famílias. Dispõe de sala de estar integrada, cozinha equipada e área de trabalho.',
    area: '52 m²',
    capacity: 'Até 4 hóspedes',
    bed: 'Suíte King + Sofá-Cama',
    breakfast: 'Incluso na diária',
    price: 'Sob consulta com desconto progressivo',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
  }
};

function initRoomVisualizer() {
  const container = document.getElementById('roomVisualizer');
  if (!container) return;

  const tabs = container.querySelectorAll('.visualizer-tab-btn');
  const imgEl = container.querySelector('#visualizerImg');
  const titleEl = container.querySelector('#visualizerTitle');
  const descEl = container.querySelector('#visualizerDesc');
  const areaEl = container.querySelector('#specArea');
  const capEl = container.querySelector('#specCapacity');
  const bedEl = container.querySelector('#specBed');
  const priceEl = container.querySelector('#specPrice');
  const bookBtn = container.querySelector('#visualizerBookBtn');
  const stageCard = container.querySelector('.visualizer-stage-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const roomKey = tab.getAttribute('data-room-target');
      const data = ROOM_VISUALIZER_DATA[roomKey];
      if (!data) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (stageCard) {
        stageCard.style.transform = 'perspective(1200px) rotateY(12deg) scale(0.97)';
        stageCard.style.opacity = '0.7';
      }

      setTimeout(() => {
        if (imgEl) imgEl.src = data.img;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (areaEl) areaEl.textContent = data.area;
        if (capEl) capEl.textContent = data.capacity;
        if (bedEl) bedEl.textContent = data.bed;
        if (priceEl) priceEl.textContent = data.price;
        if (bookBtn) bookBtn.setAttribute('data-room', roomKey);

        if (stageCard) {
          stageCard.style.transform = 'perspective(1200px) rotateY(0deg) scale(1)';
          stageCard.style.opacity = '1';
        }
      }, 200);
    });
  });
}

/* 8. Interactive Gastronomy Menu Tabs */
const GASTRONOMY_DISHES = {
  cafe: [
    { name: 'Cuscuz Nordestino com Carne de Sol', price: 'Incluso na diária', desc: 'Cuscuz de milho vaporizado na manteiga de garrafa, servido com lascas de carne de sol desfiada e queijo coalho.', tags: ['Regional', 'Buffet Incluso'] },
    { name: 'Tapiocas Feitas na Hora', price: 'Incluso na diária', desc: 'Goma fresca recheada com coco ralado, queijo de coalho selado ou geleia de frutas da estação.', tags: ['Sem Glúten', 'Artesanal'] },
    { name: 'Frutas Tropicais & Sucos Naturais', price: 'Incluso na diária', desc: 'Seleção diária de melão de Mossoró, melancia, mamão, suco de caju, graviola e seriguela fresca.', tags: ['Fresco', 'Saudável'] },
    { name: 'Bolos Regionais & Pães Artesanais', price: 'Incluso na diária', desc: 'Bolo de rolo paraibano, bolo de milho verde cremoso e pães de fermentação natural.', tags: ['Confeitaria Regional'] }
  ],
  alacarte: [
    { name: 'Filé de Carne de Sol na Nata', price: 'R$ 78,00', desc: 'Corte nobre marinado na casa, gratinado com nata fresca sertaneja e servido com baião de dois e macaxeira crocante.', tags: ['Especialidade Troodon', 'Serve 2'] },
    { name: 'Moqueca Sertaneja de Peixe & Camarão', price: 'R$ 92,00', desc: 'Postas de robalo com camarões salteados ao leite de coco caseiro, azeite de dendê e farofa crocante.', tags: ['Frutos do Mar', 'Chef Especial'] },
    { name: 'Medalhão ao Molho de Vinho & Queijo Coalho', price: 'R$ 84,00', desc: 'Mignon grelhado em crosta de pimentas nativas, redução balsâmica e risoto de queijo coalho tostado.', tags: ['Contemporâneo'] },
    { name: 'Baião de Dois Nobre do Sertão', price: 'R$ 62,00', desc: 'Feijão verde, arroz da terra, queijo coalho em cubos, bacon crocante e manteiga de garrafa aromática.', tags: ['Tradicional'] }
  ],
  bar: [
    { name: 'Coquetel Pegada do Troodon', price: 'R$ 32,00', desc: 'Cachaça nobre paraibana envelhecida em umburana, xarope artesanal de cajá, folhas de manjericão e espuma de gengibre.', tags: ['Autoral', 'Refrescante'] },
    { name: 'Caipirinha de Seriguela & Pimenta Rosa', price: 'R$ 28,00', desc: 'Fruta colhida no Sertão macerada com cachaça artesanal e perfume suave de pimenta rosa.', tags: ['Regional'] },
    { name: 'Isca de Peixe Crocante com Molho Tártaro', price: 'R$ 48,00', desc: 'Tiras de peixe fresco empanadas em crosta de panko crocante, servidas na piscina com limão galego.', tags: ['Petisco', 'Piscina'] },
    { name: 'Tábua de Queijo Coalho com Mel de Engenho', price: 'R$ 42,00', desc: 'Cubos tostados na chapa de ferro fundido com fio dourado de mel de cana puro.', tags: ['Para Compartilhar'] }
  ]
};

function initGastronomyMenu() {
  const container = document.getElementById('gastronomyMenuBoard');
  if (!container) return;

  const tabs = container.querySelectorAll('.menu-tab-pill');
  const itemsContainer = container.querySelector('#menuItemsContainer');

  function renderDishes(category) {
    if (!itemsContainer) return;
    const list = GASTRONOMY_DISHES[category] || GASTRONOMY_DISHES.alacarte;
    
    itemsContainer.innerHTML = list.map(item => `
      <div class="menu-dish-card card-3d">
        <div class="dish-header">
          <h4 class="dish-name">${item.name}</h4>
          <span class="dish-price">${item.price}</span>
        </div>
        <p class="dish-desc">${item.desc}</p>
        <div class="dish-tags">
          ${item.tags.map(tag => `<span class="dish-tag-chip">${tag}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-menu-cat');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderDishes(category);
    });
  });

  renderDishes('cafe');
}

// Call new initializers
document.addEventListener('DOMContentLoaded', () => {
  initRoomVisualizer();
  initGastronomyMenu();
});
