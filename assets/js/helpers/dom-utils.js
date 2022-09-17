export function isOverflowed(el) {
  const style = getComputedStyle(el);
  return /(auto|scroll|hidden)/.test(style.overflow + style.overflowX + style.overflowY);
}

export function getScrollParent(el) {
  if (el instanceof HTMLElement) {
    while ((el = el.parentElement)) {
      if (isOverflowed(el)) {
        return el;
      }
    }
  }

  return document.scrollingElement || document.documentElement;
}

export const debounceRAF = (fn) => {
  let raf;

  return function () {
    window.cancelAnimationFrame(raf);
    raf = window.requestAnimationFrame(fn.bind(this, ...arguments));
  };
};

export function documentTitle(to, extra) {
  let baseTitle = 'Brizo';
  let pathTitle = to.matched
    .map((i) => (i.meta && i.meta.title ? i.meta.title : ''))
    .filter((i) => i)
    .reverse()
    .join(' - ');
  let title = pathTitle ? `${pathTitle} - ${baseTitle}` : baseTitle;
  document.title = extra ? `${extra} - ${title}` : title;
}
