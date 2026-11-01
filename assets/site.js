'use strict';
// Progressive enhancement only: links and images remain usable without JavaScript.
const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
header.classList.add('js-ready');
function closeMenu(restoreFocus = false) {
  const wasOpen = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  if (wasOpen && restoreFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
window.matchMedia('(min-width: 861px)').addEventListener('change', () => closeMenu());

const dialog = document.querySelector('.lightbox');
const links = [...document.querySelectorAll('[data-gallery]')];
const image = dialog.querySelector('.lightbox-stage img');
const caption = dialog.querySelector('#lightbox-caption');
const counter = dialog.querySelector('.lightbox-count');
const dialogControls = ['.lightbox-close', '.lightbox-prev', '.lightbox-next'].map(selector => dialog.querySelector(selector));
let current = 0;
let opener = null;
function showImage(index) {
  current = (index + links.length) % links.length;
  image.src = links[current].href;
  image.alt = links[current].dataset.caption;
  caption.textContent = image.alt;
  counter.textContent = `${current + 1} / ${links.length}`;
}
links.forEach((link, index) => link.addEventListener('click', event => {
  if (typeof dialog.showModal !== 'function' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  opener = link;
  showImage(index);
  dialog.showModal();
  dialogControls[0].focus();
}));
dialog.querySelector('.lightbox-prev').addEventListener('click', () => showImage(current - 1));
dialog.querySelector('.lightbox-next').addEventListener('click', () => showImage(current + 1));
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { if (opener) opener.focus(); });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !dialog.open) closeMenu(true);
  if (!dialog.open) return;
  if (event.key === 'Tab') {
    const index = dialogControls.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      dialogControls[dialogControls.length - 1].focus();
    } else if (!event.shiftKey && (index < 0 || index === dialogControls.length - 1)) {
      event.preventDefault();
      dialogControls[0].focus();
    }
  }
  if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(current - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showImage(current + 1); }
});
