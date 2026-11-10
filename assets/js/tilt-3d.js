/* ==========================================================================
   TROODON PARK HOTEL — 3D TILT & MOUSE PERSPECTIVE ENGINE
   ========================================================================== */

(function init3DTiltEngine() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tiltCards = document.querySelectorAll('.card-3d, .room-card-3d, .service-box-3d, .seal-troodon-3d, .testimonial-card-3d');

  tiltCards.forEach(card => {
    let bounds;
    let isHovered = false;

    function onMouseEnter(e) {
      bounds = card.getBoundingClientRect();
      isHovered = true;
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
    }

    function onMouseMove(e) {
      if (!isHovered) return;
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = (mouseX / bounds.width) - 0.5; // -0.5 to 0.5
      const yPct = (mouseY / bounds.height) - 0.5;

      const maxTilt = card.classList.contains('seal-troodon-3d') ? 22 : 12;
      const rotateX = -yPct * maxTilt;
      const rotateY = xPct * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;
    }

    function onMouseLeave() {
      isHovered = false;
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
})();
