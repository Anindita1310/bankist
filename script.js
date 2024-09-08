'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScroll.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  console.log(
    'Current scrolling (X/Y)',
    window.pageXOffset,
    window.pageYOffset
  );

  console.log(
    'height/width viewport ',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  //Scrolling
  /*window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  );*/
  /*window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });*/
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Page navigation
//document.querySelectorAll('.nav__link').forEach(function (el) {
//el.addEventListener('click', function (e) {
// e.preventDefault();
//console.log('Link');
//const id = this.getAttribute('href');
//console.log(id);
//document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//});
//});

//Event delegation
//1.Add event listener to common parent element
//2.Determine which element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //console.log(e.target);
  e.preventDefault();
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//tabbed component

//tabs.forEach(t => t.addEventListener('click', () => console.log('Tab')));

//Event delegation
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  //Removing active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Activate tab
  clicked.classList.add('operations__tab--active');
  //Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation
/*const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);
window.addEventListener('scroll', function () {
  console.log(window.scrollY);
  if (this.window.scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});*/
// Sticky navigation: IntersectionObserver API

/*const obsCallBack = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallBack, obsOptions);
observer.observe(section1);*/

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`,
});
headerObserver.observe(header);

//Revealing Elements on a scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});
//Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '+200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlides = slides.length;

  //0% 100% 200% 300%
  //Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - currentSlide)}%)`)
    );
  };

  //Next slide
  const nextSlide = function () {
    if (currentSlide === maxSlides - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDots(currentSlide);
  };
  //Prev slide
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlides - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDots(currentSlide);
  };
  const init = function () {
    goToSlide(0);
    createDots();
    activateDots(0);
  };
  init();
  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  //Current slide -100% 0% 100% 200%
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') {
      prevSlide();
    }
    e.key === 'ArrowRight' && nextSlide();
  });

  //Dots

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDots(slide);
    }
  });
};
slider();

///////////////////////////////////////
//Lectures
//Selecting elements
/*console.log(document.documentElement); //selects the entire html page
console.log(document.head);
console.log(document.body);
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections); //Returns a nodelist

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons); //Returns a collection

console.log(document.getElementsByClassName('btn')); //Returns a collection
//Creating and inserting elements
//.insertAdjacentHTML
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
//header.prepend(message);
header.append(message);
//header.before(message); //it will come before the header
//header.after(message);

//Delete element
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.height); //will not give any output because it hidden inside css unless defined like background color case

console.log(message.style.backgroundColor);
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);
console.log(getComputedStyle(message).backgroundColor);

message.style.height =
  Number.parseFloat(getComputedStyle(message, 10).height) + 30 + 'px';
console.log(message.style.height);

document.documentElement.style.setProperty('--color-primary', 'orangered');
//Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);
logo.alt = 'Beautiful minimalist logo';

//Non standard
console.log(logo.designer); //Will return undefined
console.log(logo.getAttribute('designer')); //Will return the value of the attribute
logo.setAttribute('company', 'Bankist');

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));

const link2 = document.querySelector('.nav__link--btn ');
console.log(link2.href);
console.log(link2.getAttribute('href'));
//Will return the value of the attribute

//Data attributes
console.log(logo.dataset.versionNumber);

//Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); //not includes*/

/*//Types of Events and Event Handlers
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener:You are reading the heading');
  //h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

//h1.onmouseenter = function (e) {
// alert('onmouseenter:You are reading the heading!!');
//};*/

/*//Event propagation in practice
//rgb(255,255,255)
const randomInt = (max, min) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
//console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);
  //Stop Propagation
  //e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});*/

//Smooth scrolling(Video 189)

/*const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScroll.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  console.log(
    'Current scrolling (X/Y)',
    window.pageXOffset,
    window.pageYOffset
  );

  console.log(
    'height/width viewport ',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  //Scrolling
  /*window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  );*/
/*window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });*/
/*section1.scrollIntoView({ behavior: 'smooth' });
});*/

/*//Dom traversing
const h1 = document.querySelector('h1');
//Going downwards

console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); //it will return all kinds of elements even comments
console.log(h1.children); //here if we want exactly which html elements are children.Works for direct children
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';
//Going upwards
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

//QuerySelector finds children whereas closest finds parents

//Going sideways
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.style.transform = 'scale(0.5)';
  }
});*/
