const themeButton = document.getElementById("theme-toggle");

themeButton.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");

  themeButton.textContent = isDark
    ? "切换亮色模式"
    : "切换暗色模式";
});

const mottoDOM = document.getElementById("motto");

const loadMotto = async () => {
  try {
    const response = await fetch(
      "https://api.vvhan.com/api/ian/wenxue?type=json"
    );
    if (!response.ok) {
      throw new Error("网络请求失败");
    }

    const responseJSON = await response.json();
    const content = responseJSON.data.content;
    const source = responseJSON.data.form;
    mottoDOM.textContent = `“${content}” ——《${source}》`;
  } catch (error) {
    console.error(error);
    mottoDOM.textContent = "每日一言加载失败";
  }
};

loadMotto();
