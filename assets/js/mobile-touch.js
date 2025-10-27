(() => {
  // Skill cards: tap to show tooltip on touch devices
  const cards = document.querySelectorAll('.skill-card');
  const clearAll = () => cards.forEach(c => c.classList.remove('touched'));

  cards.forEach(card => {
    let timer;
    card.addEventListener('touchstart', (e) => {
      card.classList.add('touched');
      clearTimeout(timer);
      timer = setTimeout(() => card.classList.remove('touched'), 1500);
    }, { passive: true });
  });

  // Dismiss on outside tap
  document.addEventListener('touchstart', (e) => {
    if (!(e.target.closest && e.target.closest('.skill-card'))) clearAll();
  }, { passive: true });
})();