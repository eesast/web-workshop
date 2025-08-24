// 表单提交功能
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 获取表单值
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // 在实际应用中，这里会发送数据到服务器
    // 这里我们只做一个简单的提示
    alert(`感谢您的消息，${name}！我们会尽快回复您。`);
    
    // 重置表单
    this.reset();
});

// 暗色模式切换功能
const toggleSwitch = document.querySelector('#checkbox');
const currentTheme = localStorage.getItem('theme');

// 检查本地存储中的主题设置
if (currentTheme) {
    document.body.classList.add(currentTheme);
    
    if (currentTheme === 'dark-mode') {
        toggleSwitch.checked = true;
    }
}

// 切换主题函数
function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', '');
    }    
}

// 添加事件监听器
toggleSwitch.addEventListener('change', switchTheme, false);

// 网易云音乐播放器功能
// 元素引用
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const cover = document.getElementById('cover');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume');
const playIcon = document.getElementById('play-icon');
const albumCover = document.querySelector('.album-cover');

// 播放列表和当前歌曲索引
let songs = [];
let currentSongIndex = 0;

// 网易云API基础URL
const apiUrl = 'https://163api.qijieya.cn';

// 固定歌单ID
const playlistId = '12781341478';

// 初始化播放器
function initPlayer() {
    // 获取歌单中的歌曲
    fetch(`${apiUrl}/playlist/track/all?id=${playlistId}&limit=100&offset=0`)
        .then(response => response.json())
        .then(data => {
            songs = data.songs.map(song => song.id);
            loadSong(0);
        })
        .catch(error => {
            console.error('获取歌单失败:', error);
            songTitle.textContent = '加载失败';
            songArtist.textContent = '请检查网络连接';
        });
    
    // 事件监听
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPreviousSong);
    nextBtn.addEventListener('click', playNextSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNextSong);
    progressContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', setVolume);
}

// 加载歌曲
function loadSong(index) {
    if (songs.length === 0) return;
    
    currentSongIndex = index;
    const songId = songs[index];
    
    // 获取歌曲详情
    fetch(`${apiUrl}/song/detail?ids=${songId}`)
        .then(response => response.json())
        .then(data => {
            const song = data.songs[0];
            songTitle.textContent = song.name;
            songArtist.textContent = song.ar.map(artist => artist.name).join(', ');
            cover.src = song.al.picUrl;
            
            // 获取歌曲URL
            return fetch(`${apiUrl}/song/url/v1?id=${songId}&level=jymaster`);
        })
        .then(response => response.json())
        .then(data => {
            audio.src = data.data[0].url;
            audio.load();
            updatePlayButton();
        })
        .catch(error => {
            console.error('加载歌曲失败:', error);
        });
}

// 切换播放/暂停
function togglePlayPause() {
    if (audio.paused) {
        audio.play();
        albumCover.classList.add('rotate');
    } else {
        audio.pause();
        albumCover.classList.remove('rotate');
    }
    updatePlayButton();
}

// 更新播放按钮图标
function updatePlayButton() {
    if (audio.paused) {
        playIcon.innerHTML = '<path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>';
    } else {
        playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>';
    }
}

// 播放上一首
function playPreviousSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    audio.play();
    albumCover.classList.add('rotate');
    updatePlayButton();
}

// 播放下一首
function playNextSong() {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    audio.play();
    albumCover.classList.add('rotate');
    updatePlayButton();
}

// 更新进度条
function updateProgress() {
    const { currentTime, duration } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // 更新时间显示
    currentTimeEl.textContent = formatTime(currentTime);
    
    if (!isNaN(duration)) {
        durationEl.textContent = formatTime(duration);
    }
}

// 设置进度
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// 设置音量
function setVolume() {
    audio.volume = volumeSlider.value;
}

// 格式化时间
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// 初始化播放器
window.addEventListener('load', initPlayer);