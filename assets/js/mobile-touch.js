(() => {
  // Touch helpers: enable tap-to-toggle tooltips on skill cards and dismiss on outside tap
  const isTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  if (!isTouch) return;

  document.documentElement.classList.add('is-touch');

  const cards = Array.from(document.querySelectorAll('.skill-card'));
  if (!cards.length) return;

  const clearAll = () => cards.forEach(c => c.classList.remove('touched'));

  cards.forEach(card => {
    card.addEventListener('touchend', (e) => {
      // Prevent quick scroll-to-click
      e.preventDefault();
      const isActive = card.classList.contains('touched');
      clearAll();
      if (!isActive) card.classList.add('touched');
    }, { passive: false });
  });

  // Dismiss on outside tap
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.skill-card')) clearAll();
  }, { passive: true });
})();