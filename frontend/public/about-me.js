const toggle = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(isDark) {
  body.classList.toggle('dark', isDark);
  toggle.textContent = isDark ? '☀' : '🌙';
  try {
    localStorage.setItem('about-me-theme', isDark ? 'dark' : 'light');
  } catch (e) { }
}

let saved = null;
try {
  saved = localStorage.getItem('about-me-theme');
} catch (e) { }

if (saved === 'dark' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  applyTheme(true);
}

toggle.addEventListener('click', function () {
  applyTheme(!body.classList.contains('dark'));
});


const langToggle = document.getElementById('lang-toggle');

const i18n = {
  zh: {
    email_label: '邮箱',
    github_label: 'GitHub账号',
    public_repo: '公开仓库',
    personal_info: '个人信息',
    student_info: '电子系无56班学生，软件部部员',
    hobbies: '兴趣',
    hobbies_list: '战雷、galgame、番剧'
  },
  en: {
    email_label: 'Email',
    github_label: 'GitHub Account',
    public_repo: 'Public Repos',
    personal_info: 'Personal Info',
    student_info: 'Student in Class Wu 56, Dept. of EE; member of the Software Dept.',
    hobbies: 'Hobbies',
    hobbies_list: 'War Thunder, galgame, anime'
  }
};

function applyLang(lang) {
  const dict = i18n[lang] || i18n.zh;
  const nodes = document.querySelectorAll('[data-i18n]');
  for (let i = 0; i < nodes.length; i++) {
    const key = nodes[i].getAttribute('data-i18n');
    if (dict[key] != null) nodes[i].textContent = dict[key];
  }
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
  document.title = lang === 'zh' ? '关于我' : 'About Me';
  langToggle.textContent = lang === 'zh' ? 'En' : '中';
  try { localStorage.setItem('about-me-lang', lang); } catch (e) { }
}

let savedLang = null;
try { savedLang = localStorage.getItem('about-me-lang'); } catch (e) { }

const initialLang = savedLang || (navigator.language && navigator.language.indexOf('zh') === 0 ? 'zh' : 'en');
applyLang(initialLang);

langToggle.addEventListener('click', function () {
  const current = document.documentElement.getAttribute('lang');
  applyLang(current === 'zh-CN' ? 'en' : 'zh');
});

const el = document.getElementById('public_repo_count');
if (el) {
  (async function () {
    try {
      const response = await fetch('https://api.github.com/users/Ricky1911');
      const data = await response.json();
      el.textContent = data.public_repos;
    }
    catch (e) {
      console.error('请求失败:', e);
      el.textContent = '—';
    }
  })();
}
