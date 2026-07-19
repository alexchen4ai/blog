// Subtle scroll-reveal: fades content in as it enters the viewport.
// Elements are only hidden after .reveal-ready is set, so content stays
// visible if JS fails. Disabled under prefers-reduced-motion.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const selectors = [
    ".post > article > .clearfix > *",
    ".alan-work",
    ".alan-row",
    ".news table tr",
    ".post-list > li",
    ".card.hoverable",
    ".publications ol.bibliography > li",
  ];

  const elements = Array.from(document.querySelectorAll(selectors.join(",")));
  if (!elements.length) return;

  document.documentElement.classList.add("reveal-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );

  elements.forEach((el, i) => {
    el.classList.add("reveal-item");
    el.style.setProperty("--reveal-delay", `${Math.min(i % 6, 4) * 55}ms`);
    observer.observe(el);
  });
})();
