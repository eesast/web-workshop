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
    headerAvatar.classList.toggle('shown', docked > 0);

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

  // ---------- 亮色 / 暗色模式 ----------
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const syncTheme = () => {
      themeToggle.setAttribute('aria-pressed', document.body.classList.contains('dark'));
    };
    themeToggle.addEventListener('click', () => {
      const dark = document.body.classList.toggle('dark');
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (err) {}
      syncTheme();
    });
    syncTheme();
  }

  // ---------- GitHub 信息与贡献绿墙 ----------
  async function loadGitHub() {
    const user = 'Pillowe582';
    const metaEl = document.getElementById('github-meta');
    const bioEl = document.getElementById('github-bio');
    const wallEl = document.getElementById('contrib-wall');
    const tipEl = document.getElementById('contrib-tip');
    if (!metaEl || !wallEl || !tipEl) return;

    let stats = '';
    try {
      const res = await fetch('https://api.github.com/users/' + user, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (res.ok) {
        const d = await res.json();
        stats = d.public_repos + ' 个公开仓库 · ' + d.followers + ' 位关注者';
        if (d.bio) {
          bioEl.textContent = d.bio;
          bioEl.hidden = false;
        }
      }
    } catch (err) { /* 断网时保持安静，只展示能拿到的部分 */ }

    try {
      // 官方 GraphQL 需要令牌，这里用公开镜像拿最近一年的贡献
      const res = await fetch('https://github-contributions-api.jogruber.de/v4/' + user + '?y=last');
      if (res.ok) {
        const data = await res.json();
        const days = data.contributions || [];
        if (days.length) {
          wallEl.textContent = '';
          const frag = document.createDocumentFragment();
          for (let i = 0; i < days.length; i += 7) {
            const week = document.createElement('div');
            week.className = 'contrib-week';
            for (let j = i; j < Math.min(i + 7, days.length); j++) {
              const day = days[j];
              const cell = document.createElement('span');
              cell.className = 'contrib-cell c' + (day.level || 0);
              cell.title = day.date + ' · ' + day.count + ' 次贡献';
              week.appendChild(cell);
            }
            frag.appendChild(week);
          }
          wallEl.appendChild(frag);
          const total = days.reduce((sum, d) => sum + (d.count || 0), 0);
          metaEl.textContent = (stats ? stats + ' · ' : '') + '过去一年 ' + total + ' 次贡献';
          tipEl.textContent = '最近一年的贡献';
          return;
        }
      }
    } catch (err) {}

    metaEl.textContent = stats;
    tipEl.innerHTML = '贡献数据暂时取不到，<a href="https://github.com/Pillowe582" target="_blank" rel="noopener">去 GitHub 直接看</a>。';
  }
  loadGitHub();
  window.setInterval(loadGitHub, 5 * 60 * 1000);

  // ---------- 音乐浮窗 ----------
  function initPlayer() {
    const netease = (id) => 'https://music.163.com/song/media/outer/url?id=' + id + '.mp3';
    // 网易云直链池；歌曲可能因版权下架，加载失败会自动跳下一首
    const songs = [
      { title: '风息的离别诗', src: netease('3411268934') },
      { title: '永夜的悼挽', src: netease('3411268292') },
      { title: '须臾的舒闲', src: netease('3411268918') },
      { title: 'Flower Dance', src: netease('552194857') },
      { title: 'Por Una Cabeza', src: netease('1424286681') },
    ];
    // 全部失败时的保底曲目
    const fallback = { title: '李健 · 风吹麦浪', src: './assets/李健-风吹麦浪.mp3' };

    const dock = document.getElementById('music-dock');
    const audio = document.getElementById('music-audio');
    const titleEl = document.getElementById('music-title');
    const playBtn = document.getElementById('music-play');
    const nextBtn = document.getElementById('music-next');
    const loopBtn = document.getElementById('music-loop');
    const toggleBtn = document.getElementById('music-toggle');
    if (!dock || !audio || !titleEl || !playBtn || !nextBtn || !loopBtn || !toggleBtn) return;

    let index = -1;
    let failures = 0;
    let dead = false;
    let blocked = false; // 自动播放被浏览器拦下时，等第一次交互再续上

    const pick = () => {
      let i = index;
      while (i === index && songs.length > 1) {
        i = Math.floor(Math.random() * songs.length);
      }
      return i;
    };

    function load(song, i, autoplay) {
      index = i;
      audio.src = song.src;
      titleEl.textContent = song.title;
      if (autoplay) {
        audio.play().then(() => { blocked = false; }).catch(() => { blocked = true; });
      }
    }

    function next() {
      if (failures >= songs.length) {
        failures = 0;
        load(fallback, -1, true);
        return;
      }
      const i = pick();
      load(songs[i], i, true);
    }

    function togglePlay() {
      if (!audio.src || dead) {
        dead = false;
        failures = 0;
        next();
        return;
      }
      if (audio.paused) {
        blocked = false;
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }

    playBtn.addEventListener('click', togglePlay);
    toggleBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', () => {
      failures = 0;
      next();
    });
    loopBtn.addEventListener('click', () => {
      audio.loop = !audio.loop;
      loopBtn.classList.toggle('active', audio.loop);
      loopBtn.setAttribute('aria-pressed', String(audio.loop));
    });

    audio.addEventListener('ended', () => {
      if (!audio.loop) next();
    });
    audio.addEventListener('error', () => {
      if (dead) return;
      failures += 1;
      if (failures > songs.length + 1) {
        dead = true;
        titleEl.textContent = '歌都放不出来，歇一会儿…';
        return;
      }
      next();
    });
    audio.addEventListener('play', () => dock.classList.add('playing'));
    audio.addEventListener('pause', () => dock.classList.remove('playing'));

    // 页面加载后立即随机起一首；被自动播放策略拦住时，等第一次交互继续
    next();

    const unlock = () => {
      if (blocked && audio.src && audio.paused) {
        audio.play().then(() => { blocked = false; }).catch(() => {});
      }
    };
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
  }
  initPlayer();
})();
