/* eslint-disable eqeqeq */
import message, { displaySuccessMessage, displayWarningMessage } from "./displayMessage.js";

message("欢迎加入电子系科协，共同享受网页开发的乐趣");

const intro = [
  {
    title: "HTML&CSS",
    content: "HTML、CSS、JS 是网页三大语言，是网页的基础和本质。其中只需 HTML 和 CSS 文件就已经可以构建好看的静态网页了。我们在本节中将“画”出整个应用的首页、主页和“关于这个工程”页，并用简单的素材美化这些页面。在此过程中，我们希望同学们感受到“原来网页就是这么简单的东西。”",
  },
  {
    title: "JS&TS",
    content: "JS 是让网页动起来的关键，也是一种通用编程语言。这里的”动“不是移动，而是”动态“——不同的情况显示不同的内容。在本节中，我们对之前的页面施加一些魔法，使网页的背景可以随机变化、菜单内容可以展开收缩、表单提交后数据可以保存到文件中以备后用。此外，我们还会介绍 TS——带有类型系统的 JS。",
  },
  {
    title: "DataBase (SQL&GraphQL)",
    content: "当数据的关系复杂度、规模、并发需求提高到用简单文件保存已不能满足，数据库便应运而生，并成为互联网中最重要的基础设施。在本节中，我们将对用户、会议二个对象和它们之间的关系进行数据库设计和创建（使用 SQL），并使用 Hasura 和 GraphQL 进行数据访存，从而为用户创建和登录、会议创建和加入功能作铺垫。",
  },
  {
    title: "Backend (NodeJS&Express)",
    content: "在浏览器的操作是受限的、在客户端的身份是可伪造的，因此我们需要在服务器端完成诸如复杂计算、身份验证等功能——即后端。NodeJS 和 Express 是后端的一种实现方式，其中 NodeJS 使 JS 脱离浏览器环境独立运行成为可能。我们在本节中将配合数据库构建完整的用户系统，并探索邮件验证功能。",
  },
  {
    title: "Frontend (React&Webpack)",
    content: "使用纯 HTML、CSS、JS 搭建网页，我们面临两个挑战：(1) 如果一次只改变部分（但很多）的页面元素，无论是用 JS 改 DOM 树还是重新写一个 HTML 都太费力 (2) 相同的页面元素组合只能复制粘贴，无法简单复用。为此，声明式、组件化的前端框架出现了。在本节中，我们会使用前端框架之一的 React 实现大部分的会议趣味功能，完成所有页面搭建。",
  },
  {
    title: "Deployment (CI/CD&Server)",
    content: "在前 5 节中，我们已经在本地完成了网站的全部开发工作，但如何让世界上所有人都能 24 小时访问你的网站呢？在本节，我们将运用 Github CI/CD 来构建前端和后端的 Docker 镜像，使用 Github Pages 来托管前端页面，并尝试自己购买一个云服务器来提供网站的后端和数据库服务。",
  },
];

// 矢量图标库：https://www.iconfont.cn/
const toggleIcon = `
  <svg t="1722360230110" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2465" width="1em" height="1em" style="position: relative; top: 0.2em;">
    <path d="M454.464 143.68l-253.44 253.44c-12.032 12.032-12.032 31.36 0 43.392 11.968 11.968 31.36 11.968 43.328 0l237.376-237.376 237.376 237.376c11.968 11.968 31.36 11.968 43.328 0 12.032-12.032 12.032-31.36 0-43.392l-253.44-253.44C491.264 126.016 478.016 124.032 454.464 143.68zM507.968 947.648l252.48-253.376c11.968-11.968 11.968-31.36 0-43.392-11.968-11.968-31.296-11.968-43.264 0l-236.48 237.376L244.16 650.88c-11.968-11.968-31.296-11.968-43.264 0-11.968 12.032-11.968 31.424 0 43.392l252.48 253.376C465.984 960 491.136 964.48 507.968 947.648z" p-id="2466"></path>
  </svg>
`;
const collapseIcon = `
  <svg t="1722360489907" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5373" width="1em" height="1em" style="position: relative; top: 0.2em;">
    <path d="M536.832 401.344C535.552 403.648 534.4 406.016 532.48 408 526.208 414.272 517.952 416.832 509.696 416.512 501.504 416.832 493.248 414.272 486.976 408 485.056 406.016 483.904 403.648 482.56 401.344L230.016 147.84C218.048 135.872 218.048 116.48 230.016 104.512 241.92 92.544 261.312 92.544 273.216 104.512L509.696 341.824 746.24 104.512C758.144 92.544 777.536 92.544 789.44 104.512 801.408 116.48 801.408 135.872 789.44 147.84L536.832 401.344ZM483.52 621.248C484.864 618.944 485.952 616.576 487.936 614.592 494.208 608.32 502.464 605.76 510.72 606.08 518.976 605.76 527.232 608.32 533.504 614.592 535.488 616.576 536.576 618.944 537.92 621.248L791.424 874.752C803.392 886.72 803.392 906.112 791.424 918.08 779.456 930.048 760.064 930.048 748.096 918.08L510.72 680.768 273.344 918.08C261.376 930.048 241.984 930.048 230.016 918.08 218.048 906.112 218.048 886.72 230.016 874.752L483.52 621.248Z" p-id="5374"></path>
  </svg>
`;

let nowOpenedIndex = localStorage.getItem("nowOpenedIndex");
const planDOM = document.getElementById("about-plan");
planDOM.innerHTML = intro.map((item, index) => {
  return `
    <li>
      <div class="about-plan-title">
        <strong>${item.title}</strong>
        <span class="about-plan-title-icon">
          ${index == nowOpenedIndex ? collapseIcon : toggleIcon}
        </span>
      </div>
      <span ${index == nowOpenedIndex ? "" : "hidden"}>
        ${item.content}
      </span>
    </li>
  `;
}
).join("");

const planTitleDOMList = document.getElementsByClassName("about-plan-title");
for (let i = 0; i < planTitleDOMList.length; i++) {
  planTitleDOMList[i].addEventListener("click", () => {
    let nowOpenedIndex = localStorage.getItem("nowOpenedIndex");
    if (nowOpenedIndex !== null) {
      nowOpenedIndex = Number(nowOpenedIndex);
      const planTitleIconDOM = planTitleDOMList[nowOpenedIndex].querySelector(".about-plan-title-icon");
      const planContentDOM = planTitleDOMList[nowOpenedIndex].nextElementSibling;
      planTitleIconDOM.innerHTML = toggleIcon;
      planContentDOM.setAttribute("hidden", "");
      localStorage.removeItem("nowOpenedIndex");
    }
    if (i != nowOpenedIndex) {
      const planTitleIconDOM = planTitleDOMList[i].querySelector(".about-plan-title-icon");
      const planContentDOM = planTitleDOMList[i].nextElementSibling;
      planTitleIconDOM.innerHTML = collapseIcon;
      planContentDOM.removeAttribute("hidden");
      localStorage.setItem("nowOpenedIndex", i);
    }
  });
}

const contactUsDOM = document.getElementById("contact-us");
contactUsDOM.onsubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(contactUsDOM);
  const email = formData.get("email").toLowerCase();
  if (!email.endsWith("tsinghua.edu.cn")) {
    displayWarningMessage("目前仅支持清华邮箱！");
    return false;
  }
  const name = formData.get("name").toLowerCase();
  const message = formData.get("textarea").toLowerCase();
  // 防SQL注入
  const re = /select|update|delete|insert|trancate|join|union|exec|insert|drop|count|'|"|;|>|<|%/i;
  if (re.test(name) || re.test(message)) {
    displayWarningMessage("包含SQL关键字或非法字符！");
    return false;
  }
  displaySuccessMessage("提交成功！");
  return true;
};
