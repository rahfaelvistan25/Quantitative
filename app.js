/**
 * Educational Interactive Logic for Quantitative Analysis Module
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu & Backdrop Toggle
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const tocLinks = document.querySelectorAll('.toc-link');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  tocLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        closeSidebar();
      }
    });
  });

  // 2. Theme Toggle (Light / Dark)
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  
  const savedTheme = localStorage.getItem('theme-qa') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const target = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', target);
      localStorage.setItem('theme-qa', target);
      updateThemeButton(target);
    });
  }

  function updateThemeButton(theme) {
    if (!themeIcon || !themeText) return;
    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light';
    } else {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark';
    }
  }

  // 3. Reading Progress Bar & Back to Top
  const progressBar = document.getElementById('readingProgress');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Scrollspy for Table of Contents
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinksMap = {};
  tocLinks.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    navLinksMap[id] = link;
  });

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(l => l.classList.remove('active'));
        if (navLinksMap[id]) {
          navLinksMap[id].classList.add('active');
          // auto scroll sidebar if item is outside view
          if (window.innerWidth > 860) {
            navLinksMap[id].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  // 5. Interactive Quiz (Part 13 - Multiple Choice)
  const answerKey = {
    q1: 'B',
    q2: 'C',
    q3: 'B',
    q4: 'B',
    q5: 'B',
    q6: 'D',
    q7: 'A',
    q8: 'B',
    q9: 'B',
    q10: 'B'
  };

  const explanations = {
    q1: "Correct! Quantitative analysis uses numbers, data, and mathematical calculations to make decisions.",
    q2: "Correct! The decision variable represents something the decision-maker can control or choose (e.g. number of computers).",
    q3: "Correct! A constraint is a limitation or restriction you must abide by, such as a budget or physical space.",
    q4: "Correct! Deterministic models assume all input values and parameters are known and fixed with certainty.",
    q5: "Correct! Probabilistic approaches incorporate probabilities to model uncertain conditions.",
    q6: "Correct! An impossible event has a 0% probability; a certain event has a 100% probability.",
    q7: "Correct! EMV stands for Expected Monetary Value.",
    q8: "Correct! Decision-making under Risk occurs when possible outcomes and their probabilities are known.",
    q9: "Correct! Step 3 is 'Collect Relevant Data' to inform the mathematical model.",
    q10: "Correct! Evaluating and validating checks whether the result and underlying assumptions make realistic sense."
  };

  const quizCards = document.querySelectorAll('.quiz-card');
  const userAnswers = {};

  quizCards.forEach(card => {
    const qId = card.getAttribute('data-qid');
    const options = card.querySelectorAll('.quiz-option');

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        userAnswers[qId] = opt.getAttribute('data-value');
      });
    });
  });

  const checkQuizBtn = document.getElementById('btnCheckQuiz');
  const resetQuizBtn = document.getElementById('btnResetQuiz');
  const quizScoreDisplay = document.getElementById('quizScoreDisplay');

  if (checkQuizBtn) {
    checkQuizBtn.addEventListener('click', () => {
      let score = 0;
      let total = Object.keys(answerKey).length;

      quizCards.forEach(card => {
        const qId = card.getAttribute('data-qid');
        const correctVal = answerKey[qId];
        const selectedVal = userAnswers[qId];
        const feedbackEl = card.querySelector('.quiz-feedback');
        const options = card.querySelectorAll('.quiz-option');

        // Reset previous feedback styles
        options.forEach(opt => {
          opt.classList.remove('correct', 'incorrect');
          if (opt.getAttribute('data-value') === correctVal && selectedVal) {
            opt.classList.add('correct');
          } else if (opt.getAttribute('data-value') === selectedVal && selectedVal !== correctVal) {
            opt.classList.add('incorrect');
          }
        });

        if (feedbackEl) {
          feedbackEl.classList.add('show');
          if (selectedVal === correctVal) {
            score++;
            feedbackEl.className = 'quiz-feedback show';
            feedbackEl.style.backgroundColor = 'var(--success-bg)';
            feedbackEl.style.color = 'var(--success-text)';
            feedbackEl.style.border = '1px solid var(--success-border)';
            feedbackEl.textContent = `✓ ${explanations[qId]}`;
          } else if (selectedVal) {
            feedbackEl.className = 'quiz-feedback show';
            feedbackEl.style.backgroundColor = '#fef2f2';
            feedbackEl.style.color = '#991b1b';
            feedbackEl.style.border = '1px solid #fecaca';
            feedbackEl.textContent = `✗ Incorrect. Correct answer is option ${correctVal}. ${explanations[qId]}`;
          } else {
            feedbackEl.className = 'quiz-feedback show';
            feedbackEl.style.backgroundColor = 'var(--warning-bg)';
            feedbackEl.style.color = 'var(--warning-text)';
            feedbackEl.style.border = '1px solid var(--warning-border)';
            feedbackEl.textContent = `⚠️ Please select an answer first. (Correct answer: ${correctVal})`;
          }
        }
      });

      if (quizScoreDisplay) {
        quizScoreDisplay.innerHTML = `<strong>Your Score:</strong> ${score} / ${total} (${Math.round((score / total) * 100)}%)`;
      }
    });
  }

  if (resetQuizBtn) {
    resetQuizBtn.addEventListener('click', () => {
      quizCards.forEach(card => {
        const qId = card.getAttribute('data-qid');
        delete userAnswers[qId];
        card.querySelectorAll('.quiz-option').forEach(opt => {
          opt.classList.remove('selected', 'correct', 'incorrect');
        });
        const feedbackEl = card.querySelector('.quiz-feedback');
        if (feedbackEl) {
          feedbackEl.classList.remove('show');
          feedbackEl.textContent = '';
        }
      });
      if (quizScoreDisplay) {
        quizScoreDisplay.innerHTML = `Select answers and click <strong>Check Answers</strong>.`;
      }
    });
  }

  // 6. Interactive Calculator 1: Break-Even Calculator
  const beFixedInput = document.getElementById('calcBeFixed');
  const bePriceInput = document.getElementById('calcBePrice');
  const beVarInput = document.getElementById('calcBeVar');
  const beOutput = document.getElementById('calcBeOutput');

  function calculateBreakEven() {
    if (!beFixedInput || !bePriceInput || !beVarInput || !beOutput) return;
    const fixed = parseFloat(beFixedInput.value) || 0;
    const price = parseFloat(bePriceInput.value) || 0;
    const variable = parseFloat(beVarInput.value) || 0;

    const contributionMargin = price - variable;
    if (contributionMargin <= 0) {
      beOutput.innerHTML = `<span style="color: #ef4444;">⚠️ Selling price must be greater than variable cost per unit.</span>`;
      return;
    }

    const beQuantity = fixed / contributionMargin;
    const totalRev = beQuantity * price;
    beOutput.innerHTML = `
      Break-Even Units: <strong>${beQuantity % 1 === 0 ? beQuantity : beQuantity.toFixed(2)} units</strong> | 
      Break-Even Revenue: <strong>₱${totalRev.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
    `;
  }

  [beFixedInput, bePriceInput, beVarInput].forEach(inp => {
    if (inp) inp.addEventListener('input', calculateBreakEven);
  });

  // 7. Interactive Calculator 2: EMV Calculator
  const emvProbHigh = document.getElementById('calcEmvProb');
  const emvProfitHigh = document.getElementById('calcEmvHighVal');
  const emvProfitLow = document.getElementById('calcEmvLowVal');
  const emvOutput = document.getElementById('calcEmvOutput');

  function calculateEMV() {
    if (!emvProbHigh || !emvProfitHigh || !emvProfitLow || !emvOutput) return;
    let probHigh = parseFloat(emvProbHigh.value);
    if (isNaN(probHigh)) probHigh = 0.6;
    if (probHigh > 1) probHigh = probHigh / 100; // handle percentage input like 60
    const probLow = Math.max(0, 1 - probHigh);

    const valHigh = parseFloat(emvProfitHigh.value) || 0;
    const valLow = parseFloat(emvProfitLow.value) || 0;

    const emvTotal = (probHigh * valHigh) + (probLow * valLow);
    emvOutput.innerHTML = `
      High Weight: ${(probHigh * 100).toFixed(0)}% (₱${(probHigh * valHigh).toLocaleString()}) + 
      Low Weight: ${(probLow * 100).toFixed(0)}% (₱${(probLow * valLow).toLocaleString()}) = 
      <strong>EMV: ₱${emvTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
    `;
  }

  [emvProbHigh, emvProfitHigh, emvProfitLow].forEach(inp => {
    if (inp) inp.addEventListener('input', calculateEMV);
  });

  // Run initial calculations
  calculateBreakEven();
  calculateEMV();

  // Print button listener
  const btnPrint = document.getElementById('btnPrint');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }
});
