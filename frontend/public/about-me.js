const themeButtonDOM = document.getElementById("theme-button");
const pageDOM = document.getElementById("page");
const sectionDOMList = document.getElementsByClassName("section");

let isDarkMode = false;

function changeTheme() {
  let pageBackgroundColor = "white";
  let bodyBackgroundColor = "white";
  let textColor = "black";
  let buttonText = "切换为暗色模式";

  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    pageBackgroundColor = "black";
    bodyBackgroundColor = "black";
    textColor = "white";
    buttonText = "切换为亮色模式";
  }

  document.body.style.backgroundColor = bodyBackgroundColor;
  pageDOM.style.backgroundColor = pageBackgroundColor;
  pageDOM.style.color = textColor;

  for (let i = 0; i < sectionDOMList.length; i++) {
    const sectionDOM = sectionDOMList[i];
    sectionDOM.style.backgroundColor = pageBackgroundColor;
    sectionDOM.style.color = textColor;
  }

  themeButtonDOM.innerText = buttonText;
}

themeButtonDOM.addEventListener("click", changeTheme);

const musicButtonDOM = document.getElementById("music-button");
const musicInfoDOM = document.getElementById("music-info");
const musicPlayerDOM = document.getElementById("music-player");

async function loadHotSong() {
  try {
    musicInfoDOM.innerText = "正在加载热歌……";
    musicPlayerDOM.src =
      "https://free.wqwlkj.cn/wqwlapi/wyy_random.php?type=jump";

    await musicPlayerDOM.play();
    musicInfoDOM.innerText = "正在播放热歌。";
  } catch (error) {
    console.error(error);
    musicInfoDOM.innerText =
      "热歌已加载；若未自动播放，请点击播放器中的播放按钮。";
  }
}

function showMusicError() {
  musicInfoDOM.innerText = "热歌加载失败，请检查网络后重试。";
}

musicButtonDOM.addEventListener("click", loadHotSong);
musicPlayerDOM.addEventListener("ended", loadHotSong);
musicPlayerDOM.addEventListener("error", showMusicError);
