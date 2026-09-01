const fullUrl = window.location.href;
const currentUrl = window.location.origin + window.location.pathname;
const paths = currentUrl.split("/");
const isMainPage = currentUrl.replace(/\/$/, "") === baseUrl.replace(/\/$/, "");

document.documentElement.lang = "zh-CN";

const getDemoUrl = () => {
  return `${baseUrl.replace(/\/$/, "")}/demo/`;
};

const getViewOnGitHubUrl = () => {
  if (!repoUrl || isMainPage) {
    return `${repoUrl}/`;
  }

  let target = `${repoUrl}/blob/${repoBranch}/${repoPath.replace(/\/$/, "")}`;
  if (!target.endsWith("/")) {
    target += "/";
  }

  target += currentUrl.slice(baseUrl.length + 1);
  if (target.endsWith("/")) {
    target += "README.md";
  } else if (target.endsWith(".html")) {
    target = target.replace(/\.html$/, ".md");
  }

  return target;
};

const getReturnToHomeUrl = () => {
  return `${baseUrl.replace(/\/$/, "")}/`;
};

void fullUrl;
void paths;
