'use strict';

// Theme toggle
const themeToggleBtn = document.querySelector('[data-theme-toggle]');
const htmlEl = document.documentElement;

// determine initial theme: saved -> system -> dark
const savedTheme = localStorage.getItem('theme');
const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
const initialTheme = savedTheme ? savedTheme : (prefersLight ? 'light' : 'dark');

htmlEl.setAttribute('data-theme', initialTheme);

// toggle handler
const toggleTheme = () => {
  const current = htmlEl.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
};

if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);



// add Event on multiple elment

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



// PRELOADING

const loadingElement = document.querySelector("[data-loading]");

window.addEventListener("load", function () {
  loadingElement.classList.add("loaded");
  document.body.classList.remove("active");
});



// MOBILE NAV TOGGLE

const [navTogglers, navLinks, navbar, overlay] = [
  document.querySelectorAll("[data-nav-toggler]"),
  document.querySelectorAll("[data-nav-link]"),
  document.querySelector("[data-navbar]"),
  document.querySelector("[data-overlay]")
];

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



// HEADER

const header = document.querySelector("[data-header]");

const activeElementOnScroll = function () {
  if (window.scrollY > 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
}

window.addEventListener("scroll", activeElementOnScroll);



/**
 * TEXT ANIMATION EFFECT FOR HERO SECTION
 */

const letterBoxes = document.querySelectorAll("[data-letter-effect]");

let activeLetterBoxIndex = 0;
let lastActiveLetterBoxIndex = 0;
let totalLetterBoxDelay = 0;

const setLetterEffect = function () {

  // loop through all letter boxes
  for (let i = 0; i < letterBoxes.length; i++) {
    // set initial animation delay
    let letterAnimationDelay = 0;

    // get all character from the current letter box
    const letters = letterBoxes[i].textContent.trim();
    // remove all character from the current letter box
    letterBoxes[i].textContent = "";

    // loop through all letters
    for (let j = 0; j < letters.length; j++) {

      // create a span
      const span = document.createElement("span");

      // set animation delay on span
      span.style.animationDelay = `${letterAnimationDelay}s`;

      // set the "in" class on the span, if current letter box is active
      // otherwise class is "out"
      if (i === activeLetterBoxIndex) {
        span.classList.add("in");
      } else {
        span.classList.add("out");
      }

      // pass current letter into span
      span.textContent = letters[j];

      // add space class on span, when current letter contain space
      if (letters[j] === " ") span.classList.add("space");

      // pass the span on current letter box
      letterBoxes[i].appendChild(span);

      // skip letterAnimationDelay when loop is in the last index
      if (j >= letters.length - 1) break;
      // otherwise update
      letterAnimationDelay += 0.05;

    }

    // get total delay of active letter box
    if (i === activeLetterBoxIndex) {
      totalLetterBoxDelay = Number(letterAnimationDelay.toFixed(2));
    }

    // add active class on last active letter box
    if (i === lastActiveLetterBoxIndex) {
      letterBoxes[i].classList.add("active");
    } else {
      letterBoxes[i].classList.remove("active");
    }

  }

  setTimeout(function () {
    lastActiveLetterBoxIndex = activeLetterBoxIndex;

    // update activeLetterBoxIndex based on total letter boxes
    activeLetterBoxIndex >= letterBoxes.length - 1 ? activeLetterBoxIndex = 0 : activeLetterBoxIndex++;

    setLetterEffect();
  }, (totalLetterBoxDelay * 1000) + 3000);

}

// call the letter effect function after window loaded
window.addEventListener("load", setLetterEffect);



/**
 * BACK TO TOP BUTTON
 */

const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  const bodyHeight = document.body.scrollHeight;
  const windowHeight = window.innerHeight;
  const scrollEndPos = bodyHeight - windowHeight;
  const totalScrollPercent = (window.scrollY / scrollEndPos) * 100;

  backTopBtn.textContent = `${totalScrollPercent.toFixed(0)}%`;

  // visible back top btn when scrolled 5% of the page
  if (totalScrollPercent > 5) {
    backTopBtn.classList.add("show");
  } else {
    backTopBtn.classList.remove("show");
  }
});



/**
 * SCROLL REVEAL
 */

const revealElements = document.querySelectorAll("[data-reveal]");

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



/**
 * CUSTOM CURSOR
 */

const cursor = document.querySelector("[data-cursor]");
const anchorElements = document.querySelectorAll("a");
const buttons = document.querySelectorAll("button");

// change cursorElement position based on cursor move
document.body.addEventListener("mousemove", function (event) {
  setTimeout(function () {
    cursor.style.top = `${event.clientY}px`;
    cursor.style.left = `${event.clientX}px`;
  }, 100);
});

// add cursor hoverd class
const hoverActive = function () { cursor.classList.add("hovered"); }

// remove cursor hovered class
const hoverDeactive = function () { cursor.classList.remove("hovered"); }

// add hover effect on cursor, when hover on any button or hyperlink
addEventOnElements(anchorElements, "mouseover", hoverActive);
addEventOnElements(anchorElements, "mouseout", hoverDeactive);
addEventOnElements(buttons, "mouseover", hoverActive);
addEventOnElements(buttons, "mouseout", hoverDeactive);

// add disabled class on cursorElement, when mouse out of body
document.body.addEventListener("mouseout", function () {
  cursor.classList.add("disabled");
});

// remove diabled class on cursorElement, when mouse in the body
document.body.addEventListener("mouseover", function () {
  cursor.classList.remove("disabled");
});


// SKILLS & EDUCATION SECTIONS

// Utility function for touch detection
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

// Utility function for transient touch/hover effects
const createTouchEffect = (element, duration = 1600) => {
  let timeoutId = null;

  const showEffect = (customDuration) => {
    element.classList.add('touched');
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      element.classList.remove('touched');
      timeoutId = null;
    }, customDuration || duration);
  };

  // Touch handlers
  element.addEventListener('touchstart', () => showEffect(2000), { passive: true });

  // Click/hover handlers
  element.addEventListener('click', (ev) => {
    if (isTouchDevice) {
      ev.preventDefault();
      showEffect(1600);
      return;
    }
    if (element.classList.contains('touched')) {
      element.classList.remove('touched');
    } else {
      showEffect(1600);
    }
  });

  // Cleanup on mouse leave
  element.addEventListener('mouseleave', () => {
    if (element.classList.contains('touched')) {
      element.classList.remove('touched');
    }
  });
};

// Toggle functionality for skills/education sections
const initializeToggleSection = (section, options = {}) => {
  const {
    toggleBoxSelector = '[data-toggle-box]',
    toggleBtnSelector = '[data-toggle-btn]',
    contentSelector,
    onToggle = () => { },
  } = options;

  const toggleBox = section.querySelector(toggleBoxSelector);
  const toggleBtns = toggleBox ? Array.from(toggleBox.querySelectorAll(toggleBtnSelector)) : [];

  if (!toggleBtns.length) return null;

  const setActive = (index) => {
    toggleBtns.forEach((btn, i) => btn.classList.toggle('active', i === index));
    toggleBox.classList.toggle('active', index === 1);
    onToggle(index);
  };

  // Event listeners
  toggleBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => setActive(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Initialize with active button or default to first
  const initialIndex = toggleBtns.findIndex(b => b.classList.contains('active'));
  setActive(initialIndex >= 0 ? initialIndex : 0);

  return { toggleBox, toggleBtns, setActive };
};

/* -- Skills Section -- */
(function () {
  const skillsSection = document.querySelector('#skills');
  if (!skillsSection) return;

  const skillsBox = skillsSection.querySelector('[data-skills-box]');

  // Initialize skills toggle
  initializeToggleSection(skillsSection, {
    onToggle: (index) => {
      if (skillsBox) {
        skillsBox.classList.toggle('active', index === 1);
      }
    }
  });

  // Add touch effects to skill cards
  const skillCards = skillsSection.querySelectorAll('.skill-card');
  skillCards.forEach(card => createTouchEffect(card));
})();

/* -- Education Section -- */
(function () {
  const educationSection = document.querySelector('#education');
  if (!educationSection) return;

  const qualList = educationSection.querySelector('.qualification-list');
  const certList = educationSection.querySelector('.certification-list');
  const loadMoreBtn = educationSection.querySelector('[data-load-more-certs]');

  // Initialize education toggle
  initializeToggleSection(educationSection, {
    onToggle: (index) => {
      const showQual = index === 0;
      if (qualList) {
        qualList.classList.toggle('active', showQual);
        qualList.setAttribute('aria-hidden', (!showQual).toString());
      }
      if (certList) {
        certList.classList.toggle('active', !showQual);
        certList.setAttribute('aria-hidden', showQual.toString());
      }
      if (loadMoreBtn) {
        loadMoreBtn.style.display = showQual ? 'none' : 'inline-block';
      }
    }
  });

  // Load More functionality
  if (loadMoreBtn && certList) {
    const hiddenCerts = Array.from(certList.querySelectorAll('.hidden-cert'));
    let expanded = false;

    const toggleHidden = (show) => {
      hiddenCerts.forEach(cert => cert.style.display = show ? '' : 'none');
      loadMoreBtn.textContent = show ? 'Show Less' : 'Load More';
      loadMoreBtn.classList.toggle('expanded', show);
      expanded = show;
    };

    toggleHidden(false); // Initialize hidden
    loadMoreBtn.style.display = certList.classList.contains('active') ? 'inline-block' : 'none';

    loadMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleHidden(!expanded);
    });
  }

  // Add touch effects to education cards
  const cards = educationSection.querySelectorAll('.qualification-card, .certification-card-link');
  cards.forEach(card => createTouchEffect(card, 1400));
})();