const translations = {
  "zh-CN": {
    title: "关于我",
    description:
      "大家好！我叫刘承昊，是一名碌碌无为的电子系食物链底端的CV工程师兼资深的五道口猥琐男，擅长ctrl C,ctrl V,ctrl X,经常被网络问题逼到死角,喜欢麻烦学长。",
    individual: "个人简介",
    photo_title: "我的照片",
    contact_title: "联系我",
    contact_info: "邮箱: ",
    hobby_title: "我的爱好",
    hobby1: "编程开发",
    hobby2: "阅读科幻小说",
    hobby3: "长跑",
    hobby4: "画画",
    hobby5: "看电影",
    fun_title: "有趣的经历",
    fun: "参加过拓竹杯，和THUAI8，都仅获得3等奖，但想到能摇身一变成举办方还是很有意思的<strong>🎉</strong>",
    github_title: "GitHub 仓库信息",
    repo_list: "仓库列表",
  },
  "en-US": {
    title: "About Me",
    description:
      "I am a developer who loves programming and is committed to creating valuable applications.",
    photo_title: "My Photo",
    individual: "Introduction",
    contact_title: "Contact Me",
    contact_info: "Email: ",
    hobby_title: "My Hobbies",
    hobby1: "Programming",
    hobby2: "Reading Science Fiction Novels",
    hobby3: "Running",
    hobby4: "Painting",
    hobby5: "Watching Movies",
    fun_title: "Fun Facts",
    fun: "I participated in the Tuzhu Cup and THUAI8, both only got 3rd prizes, but I thought it would be interesting if I could become the organizing committee.<strong>🎉</strong>",
    github_title: "GitHub Repository Information",
    repo_list: "Repository List",
  },
};

const languageToggle = document.getElementById("languageToggle");
const elements = document.querySelectorAll("[data-lang-key]");

function updateLanguage(lang) {
  elements.forEach((element) => {
    const key = element.getAttribute("data-lang-key");
    element.textContent = translations[lang][key];
  });
}

languageToggle.addEventListener("change", function () {
  const lang = this.checked ? "en-US" : "zh-CN";
  document.documentElement.lang = lang;
  updateLanguage(lang);
});

updateLanguage("zh-CN");

async function fetchGitHubInfo() {
  const userName = "lch24"; // 替换为你的GitHub用户名
  try {
    const response = await fetch(
      `https://api.github.com/users/${userName}/repos`
    );
    const repos = await response.json();

    const repoList = document.getElementById("repo-list");
    repoList.innerHTML = "";

    // 显示前5个仓库
    repos.slice(0, 5).forEach((repo) => {
      const repoItem = document.createElement("div");
      repoItem.className = "repo-item";
      repoItem.innerHTML = `
        <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
        <p>${repo.description || "无描述"}</p>
        <p>⭐ ${repo.stargazers_count} | 🍴 ${
        repo.forks_count
      } | 更新于 ${new Date(repo.updated_at).toLocaleString()}</p>
    `;
      repoList.appendChild(repoItem);
    });
  } catch (error) {
    document.getElementById("repo-list").textContent = "无法加载GitHub仓库信息";
    console.error("GitHub API请求失败:", error);
  }
}

window.addEventListener("load", fetchGitHubInfo);

async function fetchMusicChart() {
  try {
    // 使用实际项目中已有的API地址
    const response = await fetch("http://localhost:5500/api/music/wy/top?t=2");
    const result = await response.json();

    // 检查API响应状态
    if (result.code !== 200) {
      throw new Error(`API请求失败: ${result.msg}`);
    }

    const songs = result.data;
    const songList = document.getElementById("song-list");
    songList.innerHTML = "";

    // 创建歌曲列表
    songs.slice(0, 5).forEach((song, index) => {
      const songItem = document.createElement("div");
      songItem.className = "song-item";
      songItem.innerHTML = `
        <div class="song-item-container">
          <span class="song-rank">${index + 1}.</span>
          <img src="${song.pic}" alt="${song.song}封面" class="song-cover" />
          <div class="song-info">
            <div class="song-title">${song.song}</div>
            <div class="song-singer">${song.sing}</div>
          </div>
          <button class="play-button" data-url="${song.url}">播放</button>
        </div>
        `;
      songList.appendChild(songItem);
    });

    // // 添加隐藏的音频播放器
    const audioPlayer = document.createElement("audio");
    audioPlayer.id = "music-player";
    audioPlayer.hidden = true;
    document.body.appendChild(audioPlayer);

    // 播放按钮点击事件
    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("play-button")) {
        const audio = document.getElementById("music-player");
        const url = e.target.getAttribute("data-url");
        audio.src = url;
        audio.play().catch((error) => {
          console.error("播放失败:", error);
          alert("无法播放音乐: " + error.message);
        });
      }
    });
  } catch (error) {
    document.getElementById(
      "song-list"
    ).textContent = `无法加载音乐热榜数据: ${error.message}`;
    console.error("音乐API请求失败:", error);
  }
}

// 页面加载时获取音乐热榜
window.addEventListener("load", fetchMusicChart);
