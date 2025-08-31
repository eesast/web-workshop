let langSwitcher = document.getElementById("js-language-switcher");

let isEnglish = false;

function langSwitcherFunc() {
    // 切换语言状态
    isEnglish = !isEnglish;

    const selfDescription = document.getElementById("js-self-description");
    // 清除现有内容
    while (selfDescription.firstChild) {
        selfDescription.removeChild(selfDescription.firstChild);
    }

    if (!isEnglish) {
        let newParagraph1 = document.createElement("p");
        newParagraph1.textContent = "A Chinese international student from Malaysia, a student of Tsinghua University's Class of 2024, Dushi College.";

        let newParagraph2 = document.createElement("p");
        newParagraph2.textContent = "I wanted to experience a different learning atmosphere and university life from Malaysia, so I embarked on a journey to study in Beijing. I usually enjoy playing the piano, singing, playing games, and traveling, and I want to explore and try many new things. I love nature and the universe, and I dream of contributing to the development of human aviation.";

        let newParagraph3 = document.createElement("p");
        newParagraph3.textContent = "I'm an anime fan, I enjoy watching various types of anime and also like to play anime music.";

        selfDescription.appendChild(newParagraph1);
        selfDescription.appendChild(newParagraph2);
        selfDescription.appendChild(newParagraph3);

        langSwitcher.textContent = "CH";
    }
    else {
        let newParagraph1 = document.createElement("p");
        newParagraph1.textContent = "来自马来西亚的华人留学生，清华24级笃实书院学生";

        let newParagraph2 = document.createElement("p");
        newParagraph2.textContent = "想体验不同于马来西亚的学习氛围及大学生活，于是踏上了在北京留学的旅途。平时喜欢弹钢琴、唱歌、打游戏，也喜欢旅行，想探索和尝试许多新事物。热爱大自然、宇宙，梦想为人类航空发展贡献一份力";

        let newParagraph3 = document.createElement("p");
        newParagraph3.textContent = "是个二次元宅，喜欢看各种类型动漫，也喜欢弹动漫曲";

        selfDescription.appendChild(newParagraph1);
        selfDescription.appendChild(newParagraph2);
        selfDescription.appendChild(newParagraph3);

        langSwitcher.textContent = "EN";
    }

}

langSwitcher.addEventListener("click", langSwitcherFunc);




// 获取天气
const weatherDOM = document.getElementById('js-weather-widget');
const apiKey = 'ce4b9a6139cf616af29a4325b4818647';
const city = 'Beijing';
const getWeather = async (objDOM) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const responseJSON = await response.json();

    if(responseJSON.main) {
        const temp = Math.round(responseJSON.main.temp);
        objDOM.innerHTML = `北京: ${temp}°C, ${responseJSON.weather[0].description}`;
    }
  }
  catch (err) {
    console.error(err);
    objDOM.innerText = "获取天气信息失败";
  }
}
getWeather(weatherDOM);