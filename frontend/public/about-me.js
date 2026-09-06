const themeToggle = document.getElementById("theme-toggle");

// ===== 功能 1：亮色 / 暗色模式 =====
const applyTheme = (dark) => {
  document.body.classList.toggle("dark", dark);
  themeToggle.textContent = dark ? "切换到亮色模式" : "切换到暗色模式";
};

const savedTheme = localStorage.getItem("about-me-theme");
applyTheme(savedTheme === "dark");

themeToggle.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark");
  applyTheme(dark);
  localStorage.setItem("about-me-theme", dark ? "dark" : "light");
});

// ===== 功能 2：拉取 GitHub 公开资料（网络资源） =====
const githubAvatar = document.getElementById("github-avatar");
const githubName = document.getElementById("github-name");
const githubRepos = document.getElementById("github-repos");
const githubError = document.getElementById("github-error");

const loadGithubProfile = async () => {
  try {
    const response = await fetch("https://api.github.com/users/Victor-692");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const user = await response.json();

    githubAvatar.src = user.avatar_url;
    githubAvatar.hidden = false;
    githubName.textContent = user.name || user.login;
    githubRepos.textContent = `公开仓库数：${user.public_repos}`;
    githubError.hidden = true;
  } catch (err) {
    console.error(err);
    githubName.textContent = "GitHub 资料加载失败";
    githubRepos.textContent = "";
    githubError.hidden = false;
    githubError.textContent = "请检查网络后刷新页面。";
  }
};

loadGithubProfile();
