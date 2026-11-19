/**
 * Interactive Presentation Deck Logic for Students View
 */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slideCounter = document.getElementById('slideCounter');
  const progressFill = document.getElementById('progressFill');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const overviewBtn = document.getElementById('overviewBtn');
  const notesBtn = document.getElementById('notesBtn');
  const themeToggle = document.getElementById('themeToggle');
  const overviewModal = document.getElementById('overviewModal');
  const closeOverview = document.getElementById('closeOverview');
  const overviewGrid = document.getElementById('overviewGrid');

  let currentSlideIndex = 0;
  const totalSlides = slides.length;

  // Initialize slides hash or default to 0
  function getInitialSlide() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#slide-')) {
      const idx = parseInt(hash.replace('#slide-', ''), 10) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < totalSlides) {
        return idx;
      }
    }
    return 0;
  }

  currentSlideIndex = getInitialSlide();

  function updateSlide(newIndex) {
    if (newIndex < 0 || newIndex >= totalSlides) return;

    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx === newIndex) {
        slide.classList.add('active');
      } else if (idx < newIndex) {
        slide.classList.add('prev');
      }
    });

    currentSlideIndex = newIndex;

    // Update Counter
    if (slideCounter) {
      slideCounter.textContent = `Slide ${currentSlideIndex + 1} of ${totalSlides}`;
    }

    // Update Progress
    if (progressFill) {
      const pct = ((currentSlideIndex + 1) / totalSlides) * 100;
      progressFill.style.width = `${pct}%`;
    }

    // Update Buttons State
    if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
    if (nextBtn) nextBtn.disabled = currentSlideIndex === totalSlides - 1;

    // Update URL hash
    window.location.hash = `slide-${currentSlideIndex + 1}`;

    // Update active overview card
    const cards = document.querySelectorAll('.overview-card');
    cards.forEach((card, idx) => {
      if (idx === currentSlideIndex) {
        card.classList.add('current');
      } else {
        card.classList.remove('current');
      }
    });
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      updateSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      updateSlide(currentSlideIndex - 1);
    }
  }

  // Button Listeners
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    // If modal is open, ESC closes it
    if (overviewModal && overviewModal.classList.contains('open')) {
      if (e.key === 'Escape') {
        overviewModal.classList.remove('open');
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ': // Spacebar
        e.preventDefault();
        nextSlide();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
      case 'Backspace':
        e.preventDefault();
        prevSlide();
        break;

      case 'Home':
        e.preventDefault();
        updateSlide(0);
        break;

      case 'End':
        e.preventDefault();
        updateSlide(totalSlides - 1);
        break;

      case 'f':
      case 'F':
        toggleFullscreen();
        break;

      case 'o':
      case 'O':
      case 'g':
      case 'G':
        toggleOverview();
        break;

      case 'n':
      case 'N':
        toggleNotes();
        break;
    }
  });

  // Touch / Swipe Navigation for mobile & tablets
  let touchStartX = 0;
  let touchEndX = 0;
  const stage = document.querySelector('.deck-viewport');

  if (stage) {
    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      nextSlide(); // Swiped left -> next
    } else if (touchEndX > touchStartX + threshold) {
      prevSlide(); // Swiped right -> prev
    }
  }

  // Fullscreen Toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Notes Toggle
  function toggleNotes() {
    const activeSlide = slides[currentSlideIndex];
    if (!activeSlide) return;
    const notesPanel = activeSlide.querySelector('.notes-panel');
    if (notesPanel) {
      notesPanel.classList.toggle('active');
    }
  }

  if (notesBtn) notesBtn.addEventListener('click', toggleNotes);

  // Overview Modal
  function buildOverviewGrid() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';

    slides.forEach((slide, idx) => {
      const card = document.createElement('div');
      card.className = `overview-card ${idx === currentSlideIndex ? 'current' : ''}`;
      
      const titleEl = slide.querySelector('.slide-title') || slide.querySelector('h1') || slide.querySelector('.slide-category');
      const titleText = titleEl ? titleEl.textContent.trim() : `Slide ${idx + 1}`;

      card.innerHTML = `
        <span class="card-num">Slide ${idx + 1}</span>
        <span class="card-title">${titleText}</span>
      `;

      card.addEventListener('click', () => {
        updateSlide(idx);
        overviewModal.classList.remove('open');
      });

      overviewGrid.appendChild(card);
    });
  }

  function toggleOverview() {
    if (!overviewModal) return;
    if (overviewModal.classList.contains('open')) {
      overviewModal.classList.remove('open');
    } else {
      buildOverviewGrid();
      overviewModal.classList.add('open');
    }
  }

  if (overviewBtn) overviewBtn.addEventListener('click', toggleOverview);
  if (closeOverview) closeOverview.addEventListener('click', () => overviewModal.classList.remove('open'));

  // Theme Toggle
  const savedTheme = localStorage.getItem('theme-qa') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme-qa', next);
    });
  }

  // Initial display
  updateSlide(currentSlideIndex);
});
