(() => {
  'use strict';

  const page = document.getElementById('page');
  const header = document.querySelector('.page-header');
  const heroAvatar = document.querySelector('.profile-image');
  const headerAvatar = document.querySelector('.header-avatar');

  if (!page || !header || !heroAvatar || !headerAvatar) return;

  // 页头是 fixed 的，内容要从页头下方开始
  const syncHeaderSpace = () => {
    page.style.paddingTop = header.offsetHeight + 'px';
  };
  syncHeaderSpace();
  window.addEventListener('resize', syncHeaderSpace);
  window.addEventListener('load', syncHeaderSpace);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeaderSpace);
  }

  const MAX_PULL = 90;     // 顶部最多被拉开的距离（px）
  const SHRINK_END = 180;  // 主头像缩小到最小时滚过的距离
  const DOCK_START = 110;  // 页头小头像开始出现
  const DOCK_END = 230;    // 页头小头像完全出现

  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  let pull = 0;        // 当前的下拉量
  let pullVel = 0;     // 回弹速度
  let lastInput = 0;   // 最近一次拉动输入的时间
  let heroScale = 1;   // 由滚动决定的基础缩放

  function render() {
    const bounce = pull / MAX_PULL;
    const docked = clamp01((window.scrollY - DOCK_START) / (DOCK_END - DOCK_START));

    // 顶部回弹时，头像跟着放大一点
    heroAvatar.style.transform = 'scale(' + (heroScale * (1 + bounce * 0.35)) + ')';

    // 滚过阈值后，小头像吸附到标题栏最右侧
    headerAvatar.style.opacity = docked;
    headerAvatar.style.transform = 'scale(' + (0.55 + 0.45 * docked) + ')';

    page.style.transform = pull > 0.05 ? 'translateY(' + pull.toFixed(2) + 'px)' : '';
  }

  function onScroll() {
    heroScale = 1 - 0.55 * clamp01(window.scrollY / SHRINK_END);
    render();
  }

  // 欠阻尼弹簧：松手后过冲一点点再回稳
  function tick(now) {
    if (now - lastInput > 140 && (pull !== 0 || pullVel !== 0)) {
      pullVel += -pull * 0.09;
      pullVel *= 0.74;
      pull += pullVel;
      if (Math.abs(pull) < 0.05 && Math.abs(pullVel) < 0.05) {
        pull = 0;
        pullVel = 0;
      }
      render();
    }
    requestAnimationFrame(tick);
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    window.addEventListener('wheel', (e) => {
      if (window.scrollY > 0 || e.deltaY >= 0) return;
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 16
        : e.deltaMode === 2 ? e.deltaY * 100
        : e.deltaY;
      lastInput = performance.now();
      pullVel = 0;
      pull = Math.min(MAX_PULL, pull + (-dy) * 0.22 * (1 - pull / MAX_PULL));
      render();
    }, { passive: false });

    let touchY = null;
    window.addEventListener('touchstart', (e) => {
      if (window.scrollY <= 0) touchY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (touchY === null) return;
      const dy = e.touches[0].clientY - touchY;
      if (dy <= 0 || window.scrollY > 0) {
        touchY = null;
        return;
      }
      e.preventDefault();
      lastInput = performance.now();
      pullVel = 0;
      pull = Math.min(MAX_PULL, dy * 0.5);
      render();
    }, { passive: false });
    window.addEventListener('touchend', () => { touchY = null; });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  requestAnimationFrame(tick);
})();
