const root = document.documentElement;
const themeButton = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("about-me-theme");

const setTheme = (dark) => {
  root.classList.toggle("dark", dark);
  themeButton.textContent = dark ? "切换日间模式" : "切换夜间模式";
  themeButton.setAttribute("aria-pressed", String(dark));
};

const timeElement = document.getElementById("live-time");
const updateTime = () => {
  timeElement.textContent = `本地时间：${new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date())}`;
};
updateTime();
window.setInterval(updateTime, 1000);

setTheme(savedTheme === "dark");
themeButton.addEventListener("click", () => {
  const dark = !root.classList.contains("dark");
  setTheme(dark);
  localStorage.setItem("about-me-theme", dark ? "dark" : "light");
});

const status = document.getElementById("github-status");
const info = document.getElementById("github-info");
document.getElementById("load-github").addEventListener("click", async () => {
  status.textContent = "正在读取 GitHub 公开信息……";
  info.hidden = true;
  try {
    const response = await fetch("https://api.github.com/users/tuu23888-gif");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const profile = await response.json();
    info.innerHTML = `
      <img src="${profile.avatar_url}" alt="GitHub 头像" />
      <div><strong>${profile.name || profile.login}</strong><br />
      <span>${profile.public_repos} 个公开仓库 · ${profile.followers} 位关注者</span><br />
      <a href="${profile.html_url}" target="_blank" rel="noreferrer">打开 GitHub 主页</a></div>`;
    info.hidden = false;
    status.textContent = "已从网络加载公开资料。";
  } catch (error) {
    console.error(error);
    status.textContent = "暂时无法读取 GitHub 信息，请检查网络后重试。";
  }
});
