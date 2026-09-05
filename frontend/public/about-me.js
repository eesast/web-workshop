// ==================== 多语言文案 ====================
const translations = {
  zh: {
    title: "hyx的个人网页",
    backHome: "← 返回首页",
    language: "EN",
    darkMode: "🌙 暗色模式",
    lightMode: "☀️ 亮色模式",
    aboutMe: "关于我",
    aboutMeText: "大家好，我是 <strong>hyx</strong>，一名电子系的在校学生。目前正在学习暑期培养课程。",
    skills: "我的技能",
    hobbies: "兴趣爱好",
    hobby1: "听音乐、看电影",
    hobby2: "羽毛球、骑行、乒乓球",
    hobby3: "看游戏实况",
    contact: "联系方式",
    email: "邮箱",
    bilibili: "B站主页",
    homepage: "主页",
    backProject: "返回项目首页",
    githubTitle: "我的 GitHub",
    githubHint: "实时拉取公开仓库信息",
    githubLoading: "GitHub 信息加载中...",
    githubFailed: "GitHub 信息加载失败，请稍后重试",
    githubRepos: "个公开仓库",
    githubFollowers: "关注者",
    githubFollowing: "关注中",
    githubUpdated: "更新于",
    githubNoBio: "这个人很懒，没有写简介",
    githubNoRepos: "暂无公开仓库",
    footer: "© 2026 hyx · 感谢访问",
    greeting: [
      "夜深了，注意休息哦",
      "早上好，欢迎来到我的个人网页",
      "上午好，欢迎来到我的个人网页",
      "中午好，欢迎来到我的个人网页",
      "下午好，欢迎来到我的个人网页",
      "晚上好，欢迎来到我的个人网页",
    ],
  },
  en: {
    title: "hyx's Homepage",
    backHome: "← Back to Home",
    language: "中文",
    darkMode: "🌙 Dark Mode",
    lightMode: "☀️ Light Mode",
    aboutMe: "About Me",
    aboutMeText: "Hi, I'm <strong>hyx</strong>, a student in the Department of Electronic Engineering. I'm currently taking the summer training course.",
    skills: "My Skills",
    hobbies: "Hobbies",
    hobby1: "Listening to music and watching movies",
    hobby2: "Badminton, cycling and table tennis",
    hobby3: "Watching gameplay streams",
    contact: "Contact",
    email: "Email",
    bilibili: "Bilibili",
    homepage: "Homepage",
    backProject: "Back to Project Home",
    githubTitle: "My GitHub",
    githubHint: "Live public repositories",
    githubLoading: "Loading GitHub info...",
    githubFailed: "Failed to load GitHub info. Please try again later.",
    githubRepos: "public repos",
    githubFollowers: "followers",
    githubFollowing: "following",
    githubUpdated: "Updated",
    githubNoBio: "No bio provided",
    githubNoRepos: "No public repositories",
    footer: "© 2026 hyx · Thanks for visiting",
    greeting: [
      "It's late, take care",
      "Good morning, welcome to my homepage",
      "Good morning, welcome to my homepage",
      "Good afternoon, welcome to my homepage",
      "Good afternoon, welcome to my homepage",
      "Good evening, welcome to my homepage",
    ],
  },
};

// ==================== DOM 元素 ====================
const greetingDOM = document.getElementById("greeting");
const themeToggle = document.getElementById("theme-toggle");
const languageToggle = document.getElementById("language-toggle");
const githubProfile = document.getElementById("github-profile");
const githubRepos = document.getElementById("github-repos");

// ==================== 状态 ====================
const THEME_STORAGE_KEY = "about-me-theme";
const LANG_STORAGE_KEY = "about-me-lang";
const GITHUB_USERNAME = "pintu545";

let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
let currentLang = localStorage.getItem(LANG_STORAGE_KEY) === "en" ? "en" : "zh";
let githubStatus = "loading"; // loading | loaded | error
let githubProfileData = null;
let githubReposData = [];

// ==================== 主题切换 ====================
const updateThemeButton = () => {
  const t = translations[currentLang];
  themeToggle.textContent = currentTheme === "dark" ? t.lightMode : t.darkMode;
};

const applyTheme = (theme) => {
  currentTheme = theme;
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  updateThemeButton();
};

themeToggle.addEventListener("click", () => {
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

// ==================== 问候语 ====================
const updateGreeting = () => {
  const h = new Date().getHours();
  let idx;
  if (h < 6) idx = 0;
  else if (h < 9) idx = 1;
  else if (h < 12) idx = 2;
  else if (h < 14) idx = 3;
  else if (h < 18) idx = 4;
  else idx = 5;
  greetingDOM.innerText = translations[currentLang].greeting[idx];
};

// ==================== 中英文切换 ====================
const applyLanguage = () => {
  const t = translations[currentLang];
  localStorage.setItem(LANG_STORAGE_KEY, currentLang);

  document.title = t.title;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  languageToggle.textContent = t.language;
  updateGreeting();
  updateThemeButton();
  if (githubStatus === "loaded") {
    renderGithub(githubProfileData, githubReposData);
  } else {
    renderGithubMessage(githubStatus === "error" ? "githubFailed" : "githubLoading");
  }
};

languageToggle.addEventListener("click", () => {
  currentLang = currentLang === "zh" ? "en" : "zh";
  applyLanguage();
});

// ==================== GitHub 信息（网络资源） ====================
const renderGithubMessage = (messageKey) => {
  const t = translations[currentLang];
  githubProfile.innerHTML = `<span class="github-loading">${t[messageKey]}</span>`;
  githubRepos.innerHTML = "";
};

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const renderGithub = (profile, repos) => {
  const t = translations[currentLang];
  const name = profile.name || profile.login || GITHUB_USERNAME;
  const bio = profile.bio || t.githubNoBio;
  const avatar = profile.avatar_url || "";
  const htmlUrl = profile.html_url || `https://github.com/${GITHUB_USERNAME}`;
  const publicRepos = profile.public_repos ?? 0;
  const followers = profile.followers ?? 0;
  const following = profile.following ?? 0;

  githubProfile.innerHTML = `
    <div class="github-head">
      <img class="github-avatar" src="${avatar}" alt="${name}" />
      <div class="github-meta">
        <a class="github-name" href="${htmlUrl}" target="_blank" rel="noopener">${name}</a>
        <p class="github-bio">${bio}</p>
        <div class="github-stats">
          <span>${publicRepos} ${t.githubRepos}</span>
          <span>${followers} ${t.githubFollowers}</span>
          <span>${following} ${t.githubFollowing}</span>
        </div>
      </div>
    </div>
  `;

  if (!repos.length) {
    githubRepos.innerHTML = `<li class="repo-empty">${t.githubNoRepos}</li>`;
    return;
  }
  githubRepos.innerHTML = repos
    .slice(0, 6)
    .map((repo) => {
      const stars = repo.stargazers_count ?? 0;
      const language = repo.language || "—";
      const updated = formatDate(repo.updated_at);
      const desc = repo.description || "";
      return `
        <li class="repo-item">
          <a class="repo-name" href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
          ${desc ? `<span class="repo-desc">${desc}</span>` : ""}
          <span class="repo-meta">
            <span class="repo-lang">${language}</span>
            <span>⭐ ${stars}</span>
            <span>${t.githubUpdated} ${updated}</span>
          </span>
        </li>
      `;
    })
    .join("");
};

const getGithubData = async () => {
  githubStatus = "loading";
  renderGithubMessage("githubLoading");
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`),
    ]);
    if (!profileRes.ok) {
      throw new Error(`profile HTTP ${profileRes.status}`);
    }
    const profile = await profileRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];
    githubProfileData = profile;
    githubReposData = Array.isArray(repos) ? repos : [];
    githubStatus = "loaded";
    renderGithub(githubProfileData, githubReposData);
  } catch (error) {
    console.error("GitHub 信息加载失败：", error);
    githubStatus = "error";
    renderGithubMessage("githubFailed");
  }
};

// ==================== 初始化 ====================
applyTheme(currentTheme);
applyLanguage();
getGithubData();

