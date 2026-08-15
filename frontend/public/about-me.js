const themeButton = document.querySelector("#theme-toggle");

const savedTheme = localStorage.getItem("about-me-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  themeButton.textContent = "切换浅色模式";
}

themeButton.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");

  localStorage.setItem("about-me-theme", isDark ? "dark" : "light");

  themeButton.textContent = isDark
    ? "切换浅色模式"
    : "切换深色模式";
});

const statusElement = document.querySelector("#github-status");
const reposElement = document.querySelector("#github-repos");

async function loadGithubRepos() {
  try {
    const response = await fetch(
  "https://api.github.com/users/wang-yx-123/repos?sort=updated&per_page=100"
);

if (!response.ok) {
  throw new Error(`HTTP error: ${response.status}`);
}

const repos = await response.json();

const hiddenRepoNames = new Set(["z-libraryopp.github.io"]);

const visibleRepos = repos
  .filter((repo) => {
    return !hiddenRepoNames.has(repo.name.trim().toLowerCase());
  })
  .slice(0, 5);

statusElement.textContent = `最近的公开仓库（共 ${visibleRepos.length} 个）`;

for (const repo of visibleRepos) {
      const item = document.createElement("li");

      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = repo.name;

      const description = document.createTextNode(
        `：${repo.description || "暂无简介"}`
      );

      item.append(link, description);
      reposElement.appendChild(item);
    }
  } catch (error) {
    console.error(error);
    statusElement.textContent = "GitHub 仓库加载失败，请稍后重试。";
  }
}

loadGithubRepos();
