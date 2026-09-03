// about-me.js —— 第 10 讲（JS & TS）作业
// 让"关于我"页面"动起来"，包含：问候语 + 实时时钟、夜间模式、GitHub 仓库实时加载、表单提交反馈。

/* 1. 动态问候语 + 实时时钟（本地动态） */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 6) return "夜深了，记得早点休息";
  if (h < 12) return "早上好";
  if (h < 14) return "中午好";
  if (h < 18) return "下午好";
  return "晚上好";
};

const updateClock = () => {
  const clockDOM = document.getElementById("clock");
  if (!clockDOM) return;
  const now = new Date();
  const date = now.toLocaleDateString("zh-CN");
  const time = now.toLocaleTimeString("zh-CN");
  clockDOM.innerText = `${getGreeting()}！现在是 ${date} ${time}（北京时间）`;
};

updateClock();
setInterval(updateClock, 1000);

/* 2. 夜间 / 日间模式切换（使用 localStorage 记住偏好） */
const themeToggleDOM = document.getElementById("theme-toggle");
const applyTheme = (theme) => {
  document.body.classList.toggle("dark", theme === "dark");
  if (themeToggleDOM) {
    themeToggleDOM.textContent = theme === "dark" ? "☀️ 日间模式" : "🌙 夜间模式";
  }
};

let savedTheme = localStorage.getItem("about-me-theme");
if (!savedTheme) {
  savedTheme =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
}
applyTheme(savedTheme);

if (themeToggleDOM) {
  themeToggleDOM.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("about-me-theme", nextTheme);
  });
}

/* 3. 网络资源：实时加载 GitHub 公开仓库（fetch + Promise + async/await） */
const GITHUB_USER = "sililass";
const loadRepos = async () => {
  const listDOM = document.getElementById("repo-list");
  if (!listDOM) return;
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=5`
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const repos = await response.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      listDOM.innerHTML = "<li>目前还没有公开仓库，期待他发奋图强～</li>";
      return;
    }
    listDOM.innerHTML = repos
      .map(
        (repo) =>
          `<li>
             <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
             <span class="lang">${repo.language || "其他"} · ⭐ ${repo.stargazers_count}</span><br />
             <span class="muted">${repo.description || "暂无简介"}</span>
           </li>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    listDOM.innerHTML = "<li>GitHub 数据加载失败，请检查网络后刷新重试。</li>";
  }
};

loadRepos();

/* 4. 留言表单提交反馈（DOM 事件） */
const contactFormDOM = document.querySelector("#contact form");
if (contactFormDOM) {
  contactFormDOM.addEventListener("submit", (event) => {
    event.preventDefault();
    const nicknameInput = document.getElementById("nickname");
    const tipDOM = document.getElementById("form-tip");
    const nickname = nicknameInput ? nicknameInput.value || "同学" : "同学";
    const submitTime = new Date().toLocaleTimeString("zh-CN");
    if (tipDOM) {
      tipDOM.textContent = `🎉 感谢 ${nickname} 的留言（${submitTime}）！这是静态示例，未来接入后端后就能真正送达啦。`;
    }
    contactFormDOM.reset();
  });
}
