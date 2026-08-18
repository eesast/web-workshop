const themeToggleButton = document.getElementById("theme-toggle");

themeToggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  const isDark = document.body.classList.contains("dark-theme");
  themeToggleButton.textContent = isDark
    ? "切换亮色模式"
    : "切换暗色模式";
});

const githubStatus = document.getElementById("github-status");
const githubProfile = document.getElementById("github-profile");
const githubAvatar = document.getElementById("github-avatar");
const githubLink = document.getElementById("github-link");
const githubRepoCount = document.getElementById("github-repo-count");

const loadGithubProfile = async () => {
  try {
    const response = await fetch(
      "https://api.github.com/users/liyizhen23"
    );

    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`);
    }

    const user = await response.json();

    githubAvatar.src = user.avatar_url;
    githubLink.href = user.html_url;
    githubLink.textContent = `@${user.login}`;
    githubRepoCount.textContent = user.public_repos;

    githubStatus.hidden = true;
    githubProfile.hidden = false;
  } catch (error) {
    console.error("GitHub 信息加载失败", error);
    githubStatus.textContent = "GitHub 信息加载失败，请稍后重试。";
  }
};

loadGithubProfile();
