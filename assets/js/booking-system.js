/* ==========================================================================
   TROODON PARK HOTEL — BOOKING ENGINE & RESERVATION CALCULATOR
   ========================================================================== */

const ROOM_RATES = {
  standard: { name: 'Quarto Standard Duplo', price: 220, desc: 'Prático e confortável com café regional incluso' },
  luxo: { name: 'Quarto Luxo Premium', price: 340, desc: 'Acomodação superior com enxoval nobre e vista' },
  flat: { name: 'Flat Mobiliado Completo', price: 420, desc: 'Ideal para estadias prolongadas com sala e cozinha' }
};

const OFFICIAL_PHONE_1 = '5583991590232';
const OFFICIAL_PHONE_2 = '5583991180412';

document.addEventListener('DOMContentLoaded', () => {
  initBookingModal();
  initHomeBookingDock();
});

function initBookingModal() {
  const modalOverlay = document.getElementById('bookingModal');
  if (!modalOverlay) return;

  const closeBtn = modalOverlay.querySelector('.modal-close-btn');
  const triggerBtns = document.querySelectorAll('.btn-open-booking');

  const checkinInput = document.getElementById('modalCheckin');
  const checkoutInput = document.getElementById('modalCheckout');
  const roomSelect = document.getElementById('modalRoom');
  const guestsSelect = document.getElementById('modalGuests');
  const tourCheckbox = document.getElementById('addonTour');
  const basketCheckbox = document.getElementById('addonBasket');
  const priceDisplay = document.getElementById('modalTotalPrice');
  const nightsDisplay = document.getElementById('modalNightsCount');
  const sendWhatsAppBtn = document.getElementById('btnSubmitWhatsApp');

  // Set default dates (Tomorrow -> +2 nights)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkoutDate = new Date(tomorrow);
  checkoutDate.setDate(checkoutDate.getDate() + 2);

  const formatDateYMD = (d) => d.toISOString().split('T')[0];

  if (checkinInput && !checkinInput.value) {
    checkinInput.value = formatDateYMD(tomorrow);
    checkinInput.min = formatDateYMD(today);
  }
  if (checkoutInput && !checkoutInput.value) {
    checkoutInput.value = formatDateYMD(checkoutDate);
    checkoutInput.min = formatDateYMD(tomorrow);
  }

  function calculateTotal() {
    if (!checkinInput || !checkoutInput || !roomSelect || !priceDisplay) return;

    const cin = new Date(checkinInput.value);
    const cout = new Date(checkoutInput.value);
    
    let nights = Math.ceil((cout - cin) / (1000 * 60 * 60 * 24));
    if (isNaN(nights) || nights < 1) nights = 1;

    if (nightsDisplay) {
      nightsDisplay.textContent = `${nights} ${nights === 1 ? 'diária' : 'diárias'}`;
    }

    const roomType = roomSelect.value || 'standard';
    const rate = ROOM_RATES[roomType] ? ROOM_RATES[roomType].price : 220;

    let subtotal = rate * nights;

    if (tourCheckbox && tourCheckbox.checked) subtotal += 90;
    if (basketCheckbox && basketCheckbox.checked) subtotal += 75;

    priceDisplay.textContent = `R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    return { nights, subtotal, roomType };
  }

  // Update on change
  [checkinInput, checkoutInput, roomSelect, guestsSelect, tourCheckbox, basketCheckbox].forEach(el => {
    if (el) el.addEventListener('change', calculateTotal);
  });

  // Modal open triggers
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetRoom = btn.getAttribute('data-room');
      if (targetRoom && roomSelect) {
        roomSelect.value = targetRoom;
      }
      calculateTotal();
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close triggers
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Build WhatsApp text and redirect
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      const { nights, subtotal, roomType } = calculateTotal();
      const selectedRoomName = ROOM_RATES[roomType].name;
      const guests = guestsSelect ? guestsSelect.value : '2 Hóspedes';
      const checkinFormatted = checkinInput.value.split('-').reverse().join('/');
      const checkoutFormatted = checkoutInput.value.split('-').reverse().join('/');

      let extrasList = [];
      if (tourCheckbox && tourCheckbox.checked) extrasList.push('Tour Vale dos Dinossauros (+R$ 90)');
      if (basketCheckbox && basketCheckbox.checked) extrasList.push('Cesta de Boas-Vindas Sertaneja (+R$ 75)');
      const extrasStr = extrasList.length > 0 ? `\n• Opcionais: ${extrasList.join(', ')}` : '';

      const message = `Olá, Troodon Park Hotel! Gostaria de consultar a disponibilidade e fazer uma reserva:
🏨 *Acomodação:* ${selectedRoomName}
📅 *Check-in:* ${checkinFormatted} (a partir das 14h)
📅 *Check-out:* ${checkoutFormatted} (até as 12h)
🌙 *Período:* ${nights} ${nights === 1 ? 'diária' : 'diárias'}
👥 *Hóspedes:* ${guests}${extrasStr}
💰 *Estimativa de Tarifa:* R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (café incluso)

Poderiam confirmar a disponibilidade para essas datas? Muito obrigado!`;

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/${OFFICIAL_PHONE_1}?text=${encoded}`, '_blank');
    });
  }

  calculateTotal();
}

function initHomeBookingDock() {
  const dock = document.getElementById('homeBookingDock');
  if (!dock) return;

  const btnDockSubmit = document.getElementById('btnDockSubmit');
  const dockCheckin = document.getElementById('dockCheckin');
  const dockCheckout = document.getElementById('dockCheckout');
  const dockRoom = document.getElementById('dockRoom');
  const dockGuests = document.getElementById('dockGuests');

  // Set default dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkoutDate = new Date(tomorrow);
  checkoutDate.setDate(checkoutDate.getDate() + 2);

  const formatDateYMD = (d) => d.toISOString().split('T')[0];

  if (dockCheckin && !dockCheckin.value) {
    dockCheckin.value = formatDateYMD(tomorrow);
    dockCheckin.min = formatDateYMD(today);
  }
  if (dockCheckout && !dockCheckout.value) {
    dockCheckout.value = formatDateYMD(checkoutDate);
    dockCheckout.min = formatDateYMD(tomorrow);
  }

  if (btnDockSubmit) {
    btnDockSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      // Sync into modal
      const modal = document.getElementById('bookingModal');
      const modalCheckin = document.getElementById('modalCheckin');
      const modalCheckout = document.getElementById('modalCheckout');
      const modalRoom = document.getElementById('modalRoom');
      const modalGuests = document.getElementById('modalGuests');

      if (modalCheckin && dockCheckin) modalCheckin.value = dockCheckin.value;
      if (modalCheckout && dockCheckout) modalCheckout.value = dockCheckout.value;
      if (modalRoom && dockRoom) modalRoom.value = dockRoom.value;
      if (modalGuests && dockGuests) modalGuests.value = dockGuests.value;

      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Trigger calculation inside modal
        const event = new Event('change');
        modalCheckin.dispatchEvent(event);
      }
    });
  }
}
