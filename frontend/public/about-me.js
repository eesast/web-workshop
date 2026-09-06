const texts = {
  zh: {
    nav: ["首页", "记录", "专栏", "标签", "关于", "搜索"],
    intro: ["你好，欢迎来到 <em>Invincible Summer</em> 的个人空间；", "这里将记录我的生活随笔、学习笔记等个人文章",],
    loading: "正在加载 GitHub 数据……",
    error: "GitHub 数据加载失败，请稍后再试",
    repos: "公共仓库",
    followers: "关注者",
  },
  en: {
    nav: ["Home", "Records", "Columns", "Tags", "About", "Search"],
    intro: ["Hello, welcome to <em>Invincible Summer</em>'s personal space;", "Here will record my personal articles such as life essays, study notes, etc.",],
    loading: "Loading GitHub data...",
    error: "Failed to load GitHub data, please try again later",
    repos: "Public Repositories",
    followers: "Followers",
  },
}

let lang = "zh";
const langButton = document.querySelector(".language-button");

function changeLanguage(newLang) {
    lang = newLang;

    document.querySelectorAll(".nav-menu .nav-item").forEach((item, index) => {
        item.textContent = texts[lang].nav[index];
    });

    document.querySelectorAll(".about-content p").forEach((p, index) => {
        p.innerHTML = texts[lang].intro[index];
    });

    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    langButton.textContent = lang === "zh" ? "EN" : "中";

    renderGithubCard();
}

langButton.addEventListener("click", () => {
    changeLanguage(lang === "zh" ? "en" : "zh");
});

const themeButton = document.querySelector(".theme-button");

function applyTheme(dark) {
    document.body.classList.toggle("dark", dark);
    themeButton.textContent = dark ? "☀️" : "🌙";
}

themeButton.addEventListener("click", () => {
    applyTheme(!document.body.classList.contains("dark"));
});

applyTheme(localStorage.getItem("theme") === "dark");

const githubCard = document.querySelector(".github-card");
let githubUser = null;
let githubFailed = false;

function renderGithubCard() {
    if (githubUser) {
        githubCard.innerHTML = `
            <img src="${githubUser.avatar_url}" alt="${githubUser.login}">
            <div class="github-info">
                <p class="github-name"><strong>${githubUser.name ?? githubUser.login}</strong> · ${githubUser.login}</p>
                <p>${texts[lang].repos}：${githubUser.public_repos} · ${texts[lang].followers}：${githubUser.followers}</p>
            </div>
        `;
    } else {
        const key = githubFailed ? "error" : "loading";
        githubCard.innerHTML = `<p>${texts[lang][key]}</p>`;
    }
}

async function loadGithubUser() {
    try {
        const response = await fetch("https://api.github.com/users/invincible-summer");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        githubUser = await response.json();
    } catch {
        githubFailed = true;
    }
    renderGithubCard();
}

changeLanguage(lang);
loadGithubUser();
