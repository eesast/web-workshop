const bodyDOM = document.getElementsByTagName("body")[0];
const themeToggleDOM = document.getElementById("theme-toggle");
const languageToggleDOM = document.getElementById("language-toggle");

let currentLang = localStorage.getItem("lang") || "zh";

const setThemeButtonText = () => {
  const isDark = bodyDOM.classList.contains("dark");
  if (currentLang === "zh") {
    themeToggleDOM.innerText = isDark ? "切换亮色模式" : "切换暗色模式";
  } else {
    themeToggleDOM.innerText = isDark ? "Light Mode" : "Dark Mode";
  }
};

const applyLanguage = (lang) => {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.querySelectorAll("[data-zh]").forEach((el) => {
    el.innerText = el.getAttribute(lang === "zh" ? "data-zh" : "data-en");
  });
  languageToggleDOM.innerText = lang === "zh" ? "English" : "中文";
  setThemeButtonText();
  updateClock();
};

if (localStorage.getItem("theme") === "dark") {
  bodyDOM.classList.add("dark");
}

themeToggleDOM.addEventListener("click", () => {
  if (bodyDOM.classList.contains("dark")) {
    bodyDOM.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    bodyDOM.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
  setThemeButtonText();
});

languageToggleDOM.addEventListener("click", () => {
  applyLanguage(currentLang === "zh" ? "en" : "zh");
});

const clockDOM = document.getElementById("clock");
const updateClock = () => {
  const locale = currentLang === "zh" ? "zh-CN" : "en-US";
  const date = new Date().toLocaleDateString(locale);
  const time = new Date().toLocaleTimeString(locale);
  clockDOM.innerText = currentLang === "zh"
    ? `今天是 ${date}，现在是北京时间 ${time}`
    : `Today is ${date}, now Beijing time ${time}`;
};
updateClock();
setInterval(updateClock, 1000);

const githubReposDOM = document.getElementById("github-repos");
const getGithubRepos = async (objDOM) => {
  try {
    const response = await fetch("https://api.github.com/users/gbx-cyber2/repos?sort=updated");
    const repos = await response.json();
    const repoList = repos.map((repo) => {
      return `
        <li>
          <a href="${repo.html_url}" target="_blank"><strong>${repo.name}</strong></a>
          ${repo.description ? ` - ${repo.description}` : ""}
        </li>
      `;
    });
    objDOM.innerHTML = repoList.join("");
  } catch (err) {
    console.error(err);
    objDOM.innerHTML = `<li>${currentLang === "zh" ? "仓库加载失败" : "Failed to load repositories"}</li>`;
  }
};
getGithubRepos(githubReposDOM);
