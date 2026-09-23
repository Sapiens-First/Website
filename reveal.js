(function () {
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const s = window.scrollY, m = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = `scaleX(${m > 0 ? s / m : 0})`;
    }, { passive: true });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
