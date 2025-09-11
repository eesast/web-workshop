const colorChangeBtn = document.getElementById('theme-color-change');
const lastTheme = localStorage.getItem('theme') || 'light';

document.body.className = lastTheme;

colorChangeBtn.addEventListener("click", () => {
  const newTheme = document.body.className === 'light' ? 'dark' : 'light';
  document.body.className = newTheme;
  localStorage.setItem('theme', newTheme);
});

const weatherBox = document.getElementById('weather');
weatherBox.innerText = '加载中...';

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  weatherBox.innerText = "❌ 浏览器不支持定位";
}

async function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  await fetchWeather(latitude, longitude);
  await updateClock();

  setInterval(() => fetchWeather(latitude, longitude), 300000);
  setInterval(updateClock, 1000);
}

function error() {
  weatherBox.innerText = "❌ 获取位置失败";
}

async function fetchWeather(latitude, longitude) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const response = await fetch(url);
    const data = await response.json();

    const weather = data.current_weather;
    const temperature = weather.temperature;
    const windspeed = weather.windspeed;
    const code = weather.weathercode;

    const description = getWeatherDescription(code);

    weatherBox.innerText = `${description}\n温度: ${temperature}°C\n风速: ${windspeed} km/h`;

  } catch (err) {
    weatherBox.innerText = "❌ 获取天气失败";
    console.error(err);
  }
}

function getWeatherDescription(code) {
  const map = {
    0: "☀️ 晴天",
    1: "🌤 基本晴朗",
    2: "⛅ 多云",
    3: "☁️ 阴天",
    45: "🌫 雾",
    48: "🌫 霜雾",
    51: "🌦 毛毛雨",
    61: "🌧 小雨",
    63: "🌧 中雨",
    65: "🌧 大雨",
    71: "❄️ 小雪",
    73: "❄️ 中雪",
    75: "❄️ 大雪",
    95: "⛈ 雷雨"
  };
  return map[code] || "❓ 未知天气";
}

function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const lines = weatherBox.innerText.split("\n").slice(0, 3).join("\n");
  weatherBox.innerText = `${lines}\n当前时间: ${hh}:${mm}:${ss}`;
}
