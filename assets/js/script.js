'use strict';

// Add event listener on multiple elements
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

// Theme toggle
const themeToggleBtn = document.querySelector('[data-theme-toggle]');
const htmlEl = document.documentElement;
if (themeToggleBtn) {
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme ? savedTheme : (prefersLight ? 'light' : 'dark');
  htmlEl.setAttribute('data-theme', initialTheme);

  const toggleTheme = () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };
  themeToggleBtn.addEventListener('click', toggleTheme);
}

// PRELOADING
const loadingElement = document.querySelector("[data-loading]");
if (loadingElement) {
  window.addEventListener("load", function () {
    loadingElement.classList.add("loaded");
    document.body.classList.remove("active");
  });
}

// MOBILE NAV TOGGLE
const [navTogglers, navLinks, navbar, overlay] = [
  document.querySelectorAll("[data-nav-toggler]"),
  document.querySelectorAll("[data-nav-link]"),
  document.querySelector("[data-navbar]"),
  document.querySelector("[data-overlay]")
];

if (navbar) {
  const toggleNav = function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("active");
  }
  addEventOnElements(navTogglers, "click", toggleNav);

  const closeNav = function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("active");
  }
  addEventOnElements(navLinks, "click", closeNav);
}

// HEADER
const header = document.querySelector("[data-header]");
if (header) {
  const activeElementOnScroll = function () {
    if (window.scrollY > 50) {
      header.classList.add("active");
    } else {
      header.classList.remove("active");
    }
  }
  window.addEventListener("scroll", activeElementOnScroll);
}

// TEXT ANIMATION EFFECT FOR HERO SECTION
const letterBoxes = document.querySelectorAll("[data-letter-effect]");
if (letterBoxes.length > 0) {
  let activeLetterBoxIndex = 0;
  let lastActiveLetterBoxIndex = 0;
  let totalLetterBoxDelay = 0;

  const setLetterEffect = function () {
    for (let i = 0; i < letterBoxes.length; i++) {
      let letterAnimationDelay = 0;
      const letters = letterBoxes[i].textContent.trim();
      letterBoxes[i].textContent = "";

      for (let j = 0; j < letters.length; j++) {
        const span = document.createElement("span");
        span.style.animationDelay = `${letterAnimationDelay}s`;
        span.classList.add(i === activeLetterBoxIndex ? "in" : "out");
        span.textContent = letters[j];
        if (letters[j] === " ") span.classList.add("space");
        letterBoxes[i].appendChild(span);
        if (j < letters.length - 1) {
          letterAnimationDelay += 0.05;
        }
      }

      if (i === activeLetterBoxIndex) {
        totalLetterBoxDelay = Number(letterAnimationDelay.toFixed(2));
      }

      letterBoxes[i].classList.toggle("active", i === lastActiveLetterBoxIndex);
    }

    setTimeout(function () {
      lastActiveLetterBoxIndex = activeLetterBoxIndex;
      activeLetterBoxIndex = (activeLetterBoxIndex + 1) % letterBoxes.length;
      setLetterEffect();
    }, (totalLetterBoxDelay * 1000) + 3000);
  }

  window.addEventListener("load", setLetterEffect);
}

// BACK TO TOP BUTTON
const backTopBtn = document.querySelector("[data-back-top-btn]");
if (backTopBtn) {
  window.addEventListener("scroll", function () {
    const bodyHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollEndPos = bodyHeight - windowHeight;
    const totalScrollPercent = (window.scrollY / scrollEndPos) * 100;

    backTopBtn.textContent = `${totalScrollPercent.toFixed(0)}%`;

    if (totalScrollPercent > 5) {
      backTopBtn.classList.add("show");
    } else {
      backTopBtn.classList.remove("show");
    }
  });
}

// SCROLL REVEAL
const revealElements = document.querySelectorAll("[data-reveal]");
if (revealElements.length > 0) {
  const scrollReveal = function () {
    for (let i = 0; i < revealElements.length; i++) {
      const elementIsInScreen = revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15;
      if (elementIsInScreen) {
        revealElements[i].classList.add("revealed");
      } else {
        revealElements[i].classList.remove("revealed");
      }
    }
  }
  window.addEventListener("scroll", scrollReveal);
  scrollReveal();
}

// CUSTOM CURSOR
const cursor = document.querySelector("[data-cursor]");
if (cursor) {
  const anchorElements = document.querySelectorAll("a");
  const buttons = document.querySelectorAll("button");

  document.body.addEventListener("mousemove", function (event) {
    setTimeout(function () {
      cursor.style.top = `${event.clientY}px`;
      cursor.style.left = `${event.clientX}px`;
    }, 100);
  });

  const hoverActive = () => cursor.classList.add("hovered");
  const hoverDeactive = () => cursor.classList.remove("hovered");

  addEventOnElements(anchorElements, "mouseover", hoverActive);
  addEventOnElements(anchorElements, "mouseout", hoverDeactive);
  addEventOnElements(buttons, "mouseover", hoverActive);
  addEventOnElements(buttons, "mouseout", hoverDeactive);

  document.body.addEventListener("mouseout", () => cursor.classList.add("disabled"));
  document.body.addEventListener("mouseover", () => cursor.classList.remove("disabled"));
}

// SKILLS & EDUCATION SECTIONS TOGGLE
const initializeToggleSection = (section, options = {}) => {
  const toggleBox = section.querySelector('[data-toggle-box]');
  if (!toggleBox) { return; }

  const toggleBtns = Array.from(toggleBox.querySelectorAll('[data-toggle-btn]'));
  if (!toggleBtns.length) { return; }

  const {
    defaultIndex = 0,
    onToggle,
    toggleContainerActiveClass = null,
    toggleContainerActiveIndex = 1
  } = options;

  const setActiveState = (activeIndex) => {
    toggleBtns.forEach((btn, index) => {
      const isActive = index === activeIndex;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (toggleContainerActiveClass) {
      toggleBox.classList.toggle(toggleContainerActiveClass, activeIndex === toggleContainerActiveIndex);
    }

    if (typeof onToggle === 'function') {
      onToggle(activeIndex);
    }
  };

  toggleBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => setActiveState(index));
    btn.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveState(index);
      }
    });
  });

  setActiveState(defaultIndex);
};

// Initialize Skills Section
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
  const skillsBox = skillsSection.querySelector('[data-skills-box]');
  const skillsList = skillsBox?.querySelector('.skills-list');
  const toolsList = skillsBox?.querySelector('.tools-list');

  initializeToggleSection(skillsSection, {
    defaultIndex: 0,
    toggleContainerActiveClass: 'active',
    toggleContainerActiveIndex: 1,
    onToggle: (activeIndex) => {
      const showTools = activeIndex === 1;

      if (skillsBox) {
        skillsBox.classList.toggle('active', showTools);
      }

      if (skillsList) {
        skillsList.setAttribute('aria-hidden', showTools ? 'true' : 'false');
      }

      if (toolsList) {
        toolsList.setAttribute('aria-hidden', showTools ? 'false' : 'true');
      }
    }
  });
}

// Initialize Education Section
const educationSection = document.querySelector('#education');
if (educationSection) {
  const qualificationList = educationSection.querySelector('.qualification-list');
  const certificationList = educationSection.querySelector('.certification-list');
  const loadMoreBtn = educationSection.querySelector('[data-load-more-certs]');

  initializeToggleSection(educationSection, {
    defaultIndex: 0,
    onToggle: (activeIndex) => {
      const showCerts = activeIndex === 1;

      if (qualificationList) {
        qualificationList.classList.toggle('active', !showCerts);
        qualificationList.setAttribute('aria-hidden', showCerts ? 'true' : 'false');
      }

      if (certificationList) {
        certificationList.classList.toggle('active', showCerts);
        certificationList.setAttribute('aria-hidden', showCerts ? 'false' : 'true');
      }

      if (loadMoreBtn) {
        loadMoreBtn.style.display = showCerts ? 'inline-flex' : 'none';
      }
    }
  });

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      educationSection
        .querySelectorAll('.certification-list .hidden-cert')
        .forEach((item) => item.classList.remove('hidden-cert'));
      loadMoreBtn.style.display = 'none';
    });
  }
}
